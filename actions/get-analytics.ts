import {db} from '@/lib/db';
export const getAnalytics = async () => {
  try {
    const analyticsData = await db.$transaction(async prisma => {
      // Fetch joined courses with only necessary columns
      const joinedCourses = await prisma.joined.findMany({
        select: {
          userId: true,
          course: {
            select: {
              title: true,
            },
          },
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });

      // Use batch fetching to get all user progress in a single query
      const userProgress = await prisma.userProgress.findMany({
        where: {
          userId: {
            in: joinedCourses.map(joined => joined.userId),
          },
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });

      // Count the occurrences of each course title using Prisma's distinct option
      const courseCounts: {[courseTitle: string]: number} = {};
      const courseTitleToFirstWords: {[courseTitle: string]: string} = {};

      joinedCourses.forEach(joined => {
        const firstWords = joined.course.title
          .split(' ')
          .slice(0, 2)
          .map(word => word[0])
          .join('');

        courseCounts[firstWords] = (courseCounts[firstWords] || 0) + 1;
        courseTitleToFirstWords[joined.course.title] = firstWords;
      });

      // Use Prisma's count aggregate function for completed courses
      const completedCoursesCount = await prisma.userProgress.count({
        where: {
          isCompleted: true,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });

      // Map course counts to the desired format for the Chart component
      const data = Object.entries(courseCounts).map(([name, students]) => ({
        name,
        students,
      }));

      const tableData = Object.entries(courseTitleToFirstWords).map(
        ([actualName, abbreviation]) => ({
          actualName,
          abbreviation,
        }),
      );

      const totalStudents = data.reduce((acc, curr) => acc + curr.students, 0);

      // Parallelize the fetching of user-specific data
      const userData = await Promise.all(
        joinedCourses.map(async joined => {
          const userId = joined.userId;

          const userCompletedCourses = userProgress.filter(
            course => course.userId === userId && course.isCompleted === true,
          );

          const userInProgressCourses = userProgress.filter(
            course => course.userId === userId && course.isCompleted === false,
          );

          return {
            totalStudents,
            userId,
            completedCount: userCompletedCourses.length,
            inProgressCount: userInProgressCourses.length,
            completedCourses: userCompletedCourses,
            inProgressCourses: userInProgressCourses,
          };
        }),
      );

      return {
        totalCompletedCourses: completedCoursesCount,
        userData,
        data,
        totalStudents,
        tableData,
      };
    });

    return analyticsData;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalCompletedCourses: 0,
      userData: [],
      data: [],
      totalStudents: 0,
    };
  }
};
