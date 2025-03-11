import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto"; // Import the crypto module

export async function DELETE(
  req: Request,
  { params }: { params: { feedbackId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const feedbackData = await db.feedback.findUnique({
      where: {
        id: params.feedbackId,
      },
    });

    if (!feedbackData) {
      return new NextResponse("Feedback not found", { status: 404 });
    }

    const imageUrl = feedbackData.url;

    // if (!imageUrl) {
    //   return new NextResponse('Image URL not found', {status: 404});
    // }

    // // Extract public ID from Cloudinary URL
    // const publicId = imageUrl
    //   ? imageUrl.split('/').pop()?.split('.')[0]
    //   : undefined;

    // // Generate signature
    // const timestamp = Math.floor(Date.now() / 1000); // Unix time now
    // const paramsToSign = {
    //   timestamp,
    //   public_id: publicId,
    //   api_key: process.env.CLOUDINARY_API_KEY, // Add your Cloudinary API key
    //   eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop', // Add eager transformation if needed
    // } as Record<string, string | number>; // Type assertion to allow indexing with string
    // const sortedParams = Object.keys(paramsToSign)
    //   .sort()
    //   .map(key => `${key}=${paramsToSign[key]}`)
    //   .join('&');
    // const stringToSign = `${sortedParams}${process.env.CLOUDINARY_API_SECRET}`;
    // const signature = crypto
    //   .createHash('sha1') // Use 'sha1' or 'sha256' based on your configuration
    //   .update(stringToSign)
    //   .digest('hex');

    // // Make HTTP DELETE request to Cloudinary's API endpoint
    // try {
    //   const response = await fetch(
    //     `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME!}/image/destroy?public_id=${publicId}&api_key=${process.env.CLOUDINARY_API_KEY!}&timestamp=${timestamp}&signature=${signature}`,
    //     {
    //       method: 'POST',
    //     },
    //   );

    //   if (!response.ok) {
    //     throw new Error('Failed to delete image');
    //   }

    //   // Handle successful deletion
    // } catch (error) {
    //   console.error('Error deleting image:', error);
    // }

    // Delete the feedback from the database
    const deletedFeedback = await db.feedback.delete({
      where: {
        id: params.feedbackId,
      },
    });

    return NextResponse.json(deletedFeedback);
  } catch (error) {
    console.error("[FEEDBACK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
