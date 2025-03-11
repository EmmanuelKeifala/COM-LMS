import { db } from "@/lib/db";

export const getAnalytics = async () => {
  try {
    const analyticsData = await db.$transaction(async (prisma) => {
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
        cacheStrategy: { swr: 60, ttl: 60 },
      });

      // Extract unique user IDs for batch fetching
      const userIds = [
        ...new Set(joinedCourses.map((joined) => joined.userId)),
      ];

      // Use batch fetching to get all user progress in a single query
      const userProgress = await prisma.userProgress.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
        cacheStrategy: { swr: 60, ttl: 60 },
      });

      // Count the occurrences of each course title using a Map for better performance
      const courseCounts = new Map<string, number>();
      const courseTitleToFirstWords: { [courseTitle: string]: string } = {};

      joinedCourses.forEach((joined) => {
        const firstWords = joined.course.title
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("");

        courseCounts.set(firstWords, (courseCounts.get(firstWords) || 0) + 1);
        courseTitleToFirstWords[joined.course.title] = firstWords;
      });

      // Use Prisma's count aggregate function for completed courses
      const completedCoursesCount = await prisma.userProgress.count({
        where: {
          isCompleted: true,
        },
        cacheStrategy: { swr: 60, ttl: 60 },
      });

      // Map course counts to the desired format for the Chart component
      const data = Array.from(courseCounts.entries()).map(
        ([name, students]) => ({
          name,
          students,
        })
      );

      const tableData = Object.entries(courseTitleToFirstWords).map(
        ([actualName, abbreviation]) => ({
          actualName,
          abbreviation,
        })
      );

      const totalStudents = data.reduce((acc, curr) => acc + curr.students, 0);

      // Create a map of user progress for quick lookup
      const userProgressMap = new Map<string, typeof userProgress>();
      userProgress.forEach((progress) => {
        if (!userProgressMap.has(progress.userId)) {
          userProgressMap.set(progress.userId, []);
        }
        userProgressMap.get(progress.userId)!.push(progress);
      });

      // Parallelize the fetching of user-specific data
      const userData = await Promise.all(
        joinedCourses.map(async (joined) => {
          const userId = joined.userId;
          const userCourses = userProgressMap.get(userId) || [];

          const userCompletedCourses = userCourses.filter(
            (course) => course.isCompleted === true
          );

          const userInProgressCourses = userCourses.filter(
            (course) => course.isCompleted === false
          );

          return {
            totalStudents,
            userId,
            completedCount: userCompletedCourses.length,
            inProgressCount: userInProgressCourses.length,
            completedCourses: userCompletedCourses,
            inProgressCourses: userInProgressCourses,
          };
        })
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
    console.error("Error fetching analytics:", error);
    return {
      totalCompletedCourses: 0,
      userData: [],
      data: [],
      totalStudents: 0,
    };
  }
};
