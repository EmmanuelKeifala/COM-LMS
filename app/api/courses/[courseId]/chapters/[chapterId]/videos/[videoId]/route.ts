import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; videoId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.videoUrl.delete({
      where: {
        chapterId: params.chapterId,
        id: params.videoId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("VIDEO_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
