import {auth} from '@clerk/nextjs';
import axios from 'axios';
import {NextResponse} from 'next/server';

const CLERK_API_URL = 'https://api.clerk.com/v1/users/';

// Reusable authentication middleware
const authenticateUser = () => {
  const {userId} = auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
};

const handleRequest = async (req: Request, method: string) => {
  try {
    const userId = authenticateUser();
    let response;

    // Make request to Clerk API based on the HTTP method
    if (method === 'GET') {
      response = await axios.get(`${CLERK_API_URL}${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          Accept: 'application/json',
        },
      });
    } else if (method === 'POST') {
      const {userClass} = await req.json();
      response = await axios.patch(
        `${CLERK_API_URL}${userId}`,
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
    } else {
      throw new Error('Invalid HTTP method');
    }

    // Return success response
    return new NextResponse(
      method === 'GET' ? response.data.public_metadata.userClass : 'OK',
      {status: 200},
    );
  } catch (error) {
    console.error('[CLASSES]', error);
    // Return error response
    return new NextResponse('Internal Error', {status: 500});
  }
};

export async function POST(req: Request) {
  return handleRequest(req, 'POST');
}

export async function GET(req: Request) {
  return handleRequest(req, 'GET');
}
