import {db} from '@/lib/db';
import {Course, Joined} from '@prisma/client';

type PurchaseWithCourse = Joined & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: {[courseTitle: string]: {total: number; students: number}} =
    {};

  purchases.forEach(purchase => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = {total: 0, students: 0};
    }
    grouped[courseTitle].total += purchase.course.price!;
    grouped[courseTitle].students += 1;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    // Fetch purchases from the 'joined' collection
    const purchases = await db.joined.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true,
      },
    });

    // Group purchases by course
    const groupedEarnings = groupByCourse(purchases);

    // Map grouped data to the desired format
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, {total, students}]) => ({
        name: courseTitle,
        total: total,
        students: students,
      }),
    );

    // Calculate total revenue and total students
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalStudents = data.reduce((acc, curr) => acc + curr.students, 0);

    return {
      data,
      totalRevenue,
      totalStudents,
    };
  } catch (error) {
    // Log the error for debugging

    // Return an object with default values
    return {
      data: [],
      totalRevenue: 0,
      totalStudents: 0,
    };
  }
};
