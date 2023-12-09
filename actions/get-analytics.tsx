import {db} from '@/lib/db';
import {Course, Joined} from '@prisma/client';

type PurchaseWithCourse = Joined & {
  course: Course;
};

export const getAnalytics = async (userId: string) => {
  try {
    // Fetch purchases from the 'joined' collection
    const purchases = await db.joined.findMany({
      include: {
        course: true,
      },
    });

    // Count the occurrences of each course
    const courseCounts: {[courseTitle: string]: number} = {};
    purchases.forEach(purchase => {
      // Extract the first two words from the course title
      const firstWords = purchase.course.title.split(' ').slice(0, 2).join(' ');

      if (!courseCounts[firstWords]) {
        courseCounts[firstWords] = 0;
      }
      courseCounts[firstWords]++;
    });

    // Map course counts to the desired format for the Chart component
    const data = Object.entries(courseCounts).map(([name, students]) => ({
      name,
      students,
    }));
    const totalStudents = data.reduce((acc, curr) => acc + curr.students, 0);

    return {
      data,
      totalStudents,
    };
  } catch (error) {
    return {
      data: [],
      totalStudents: 0,
    };
  }
};
