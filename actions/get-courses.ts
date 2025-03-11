import { Category, Course, Level } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import axios from "axios";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  level: Level | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<{
  coursesWithProgress: CourseWithProgressWithCategory[];
  userClass: string;
}> => {
  try {
    // Fetch user details only once
    const userResponse = await fetchUserDetails(userId);
    const userClass = userResponse?.public_metadata?.userClass || "";

    // Find the Level based on userClass
    const level = userClass ? await getLevelByName(userClass) : null;

    // Fetch courses based on levelId if userClass is available
    const courses = await getCoursesByFilters(title, categoryId, level?.id!!);

    // Fetch progress for each course in parallel
    const coursesWithProgress = await Promise.all(
      courses.map(async (course: any) => {
        const progressPercentage = await getProgress(userId, course.id);
        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return { coursesWithProgress, userClass };
  } catch (error) {
    console.error("[GET_COURSES]", error);
    return { coursesWithProgress: [], userClass: "" };
  }
};

const fetchUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

const getLevelByName = async (name: string) => {
  return await db.level.findUnique({
    where: {
      name,
    },
    cacheStrategy: { swr: 60, ttl: 60 },
  });
};

const getCoursesByFilters = async (
  title: string | undefined,
  categoryId: string | undefined,
  levelId: string | null
) => {
  return await db.course.findMany({
    where: {
      isPublished: true,
      title: {
        contains: title || "",
        mode: "insensitive",
      },
      categoryId,
      levelId,
    },
    include: {
      category: true,
      level: true,
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    cacheStrategy: { swr: 60, ttl: 60 },
  });
};
