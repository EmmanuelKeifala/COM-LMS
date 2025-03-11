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
    const { name, url } = await req.json();

    if (!userId || !isUploader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapterOwner = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapterOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapterAttachment = await db.chapterAttachment.create({
      data: {
        url: url,
        name: name,
        chapterId: params.chapterId,
      },
    });

    return NextResponse.json(chapterAttachment);
  } catch (error) {
    console.error("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
