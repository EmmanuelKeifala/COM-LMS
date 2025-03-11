import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { formData } = await req.json();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const feedback = await db.feedback.create({
      data: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        feedbackType: formData.feedbackType,
        rate: formData.rate,
        url: formData.url || "",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.log("[FEEDBACK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
