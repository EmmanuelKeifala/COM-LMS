import { db } from "@/lib/db";
import { isUploader } from "@/lib/uploader";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { name, url } = await req.json();

    if (!userId || !isUploader)
      return new NextResponse("Unauthorized", { status: 401 });

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    const attachment = await db.attachment.create({
      data: {
        url: url, // Use the url property from the data object
        name: name, // Use the name property from the data object
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("COURSE_ID_ATTACHEMENTS", error);
    return new NextResponse("Internal sever error", { status: 500 });
  }
}
