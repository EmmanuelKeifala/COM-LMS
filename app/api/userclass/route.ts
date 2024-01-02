import {auth} from '@clerk/nextjs';
import axios from 'axios';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    // Ensure user authentication
    const {userId} = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const {userClass} = await req.json();

    // Make PATCH request to Clerk API
    const response = await axios.patch(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        public_metadata: {userClass},
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          Accept: 'application/json',
        },
      },
    );

    // Return success response
    return new NextResponse('OK', {status: 200});
  } catch (error) {
    console.error('[CLASSES]', error);
    // Return error response
    return new NextResponse('Internal Error', {status: 500});
  }
}
