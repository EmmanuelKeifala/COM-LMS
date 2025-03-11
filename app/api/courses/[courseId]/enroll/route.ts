import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });
    const purchase = await db.joined?.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });
    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }
    await db.joined.create({
      data: {
        courseId: params.courseId,
        userId: user.id,
      },
    });
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
    });
  } catch (error) {
    console.log("[ENROLLMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
