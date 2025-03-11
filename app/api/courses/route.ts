import { db } from "@/lib/db";
import { isUploader } from "@/lib/uploader";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const checkPermissions = async (userId: string | undefined | null) => {
  if (!userId || !isUploader) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return null; // No error, user is authorized
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    const permissionError = await checkPermissions(userId);
    if (permissionError) return permissionError;

    if (!userId) {
      return;
    }

    // Create course with a single query
    const course = await db.course.create({
      data: { userId, title },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { videoId, url: newUrl } = await req.json();

    const permissionError = await checkPermissions(userId);
    if (permissionError) return permissionError;

    // Retrieve the existing video URL and check if it's already updated
    const existingVideo = await db.videoUrl.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const oldUrl = existingVideo.videoUrl;

    // Prevent redundant URL update if the URL is the same
    if (oldUrl === newUrl) {
      return NextResponse.json(
        { message: "New URL must be different from the old URL" },
        { status: 400 }
      );
    }

    // Transaction to update video and related ratings in one go
    const updatedVideoUrl = await db.$transaction(async (prisma) => {
      // Update video URL
      const updatedVideo = await prisma.videoUrl.update({
        where: { id: videoId },
        data: { videoUrl: newUrl },
      });

      // Set isReviewed to true for all related VideoRating records
      await prisma.videoRating.updateMany({
        where: { videoId },
        data: { isReviewed: true },
      });

      return updatedVideo;
    });

    return NextResponse.json(updatedVideoUrl);
  } catch (error) {
    console.error("[VIDEO]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
