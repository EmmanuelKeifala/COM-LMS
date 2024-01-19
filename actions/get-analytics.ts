import {db} from '@/lib/db';
import {clerkClient} from '@clerk/nextjs';
import {Course, Joined} from '@prisma/client';
import axios from 'axios';

type PurchaseWithCourse = Joined & {
  course: Course;
};

export const getAnalytics = async () => {
  try {
    // Fetch purchases from the 'joined' collection
    const purchases = await db.joined.findMany({
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
    purchases.forEach(purchase => {
      const firstWords = purchase.course.title
        .split(' ')
        .slice(0, 2)
        .map(word => word[0])
        .join('');
      courseCounts[firstWords] = (courseCounts[firstWords] || 0) + 1;
    });

    // Fetch in-progress courses for all users
    const inProgressCourses = await db.userProgress.findMany({
      where: {
        isCompleted: false,
      },
    });

    // Map course counts to the desired format for the Chart component
    const data = Object.entries(courseCounts).map(([name, students]) => ({
      name,
      students,
    }));

    const totalStudents = data.reduce((acc, curr) => acc + curr.students, 0);

    // Collect analytics data for each user
    const userData = await Promise.all(
      purchases.map(async purchase => {
        const userId = purchase.userId;

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

// const fetchUserDetails = async (userId: string) => {
//   try {
//     const maxRetries = 3;
//     let retries = 0;

//     const makeRequest = async () => {
//       const response = await axios.get(
//         `https://api.clerk.com/v1/users/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//             Accept: 'application/json',
//           },
//         },
//       );
//       return response.data;
//     };

//     let userResponse = await makeRequest();

//     while (userResponse === null && retries < maxRetries) {
//       const retryAfter = userResponse.headers['retry-after'] || 1; // Default to 1 second if no header is provided
//       await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//       userResponse = await makeRequest();
//       retries += 1;
//     }

//     return userResponse;
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//     return null;
//   }
// };
