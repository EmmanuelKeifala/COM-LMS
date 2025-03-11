import { db } from "@/lib/db";
import { isUploader } from "@/lib/uploader";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    if (!userId || !isUploader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chapterOwner = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapterOwner) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const lastVideo = await db.videoUrl.findFirst({
      where: {
        chapterId: params.chapterId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastVideo ? lastVideo?.position + 1 : 1;

    if (title.includes("preview")) {
      const urlExist = await db.videoUrl.findMany({
        where: {
          videoUrl: title,
        },
      });
      if (urlExist.length > 0) {
        return NextResponse.json(
          { message: "Video already exists" },
          { status: 400 }
        );
      }
      const chapterVideo = await db.videoUrl.create({
        data: {
          videoUrl: title,
          chapterId: params.chapterId,
          position: newPosition,
        },
      });
      return NextResponse.json(chapterVideo);
    } else {
      const index = title.indexOf("/view");

      var modifiedUrl = title.substring(0, index) + "/preview";
      const urlExist = await db.videoUrl.findMany({
        where: {
          videoUrl: modifiedUrl,
        },
      });
      if (urlExist.length > 0) {
        return NextResponse.json(
          { message: "Video already exists" },
          { status: 400 }
        );
      }
      const chapterVideo = await db.videoUrl.create({
        data: {
          videoUrl: modifiedUrl,
          chapterId: params.chapterId,
          position: newPosition,
        },
      });
      return NextResponse.json(chapterVideo);
    }
  } catch (error) {
    console.error("[VIDEO]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
