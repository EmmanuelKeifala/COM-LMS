import {db} from '@/lib/db';
export const getAnalytics = async () => {
  try {
    // Fetch joined from the 'joined' collection
    const joinedCourses = await db.joined.findMany({
      include: {
        course: true,
      },
    });

    // Fetch completed courses for all users
    const completedCourses = await db.userProgress.findMany({
      where: {
        isCompleted: true,
      },
    });

    // Count the occurrences of each course title
    const courseCounts: {[courseTitle: string]: number} = {};
    const courseTitleToFirstWords: {[courseTitle: string]: string} = {};

    joinedCourses.forEach(joined => {
      const firstWords = joined.course.title
        .split(' ')
        .slice(0, 2)
        .map(word => word[0])
        .join('');

      // Populate courseCounts
      courseCounts[firstWords] = (courseCounts[firstWords] || 0) + 1;

      // Populate courseTitleToFirstWords
      courseTitleToFirstWords[joined.course.title] = firstWords;
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

    // Collect analytics data for each user
    const userData = await Promise.all(
      joinedCourses.map(async joined => {
        const userId = joined.userId;

        // Fetch completed courses for the specific user
        const userCompletedCourses = await db.userProgress.findMany({
          where: {
            userId,
            isCompleted: true,
          },
        });

        // Fetch in-progress courses for the specific user
        const userInProgressCourses = await db.userProgress.findMany({
          where: {
            userId,
            isCompleted: false,
          },
        });

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
      totalCompletedCourses: completedCourses.length,
      userData,
      data,
      totalStudents,
      tableData,
    };
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
