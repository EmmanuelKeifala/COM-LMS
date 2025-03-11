import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

const CLERK_API_URL = "https://api.clerk.com/v1/users";

// Reusable function to authenticate user
const authenticateUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};

// Reusable function to make requests to Clerk API
const makeClerkRequest = async (
  userId: string,
  method: "GET" | "PATCH",
  data?: any
) => {
  const url = `${CLERK_API_URL}/${userId}`;
  const headers = {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    Accept: "application/json",
  };

  const response = await axios({
    method,
    url,
    headers,
    data,
  });

  return response.data;
};

// Handle GET and POST requests
const handleRequest = async (req: Request, method: "GET" | "POST") => {
  try {
    const userId = await authenticateUser();

    if (method === "GET") {
      const userData = await makeClerkRequest(userId, "GET");
      return NextResponse.json(
        { userClass: userData.public_metadata?.userClass || "" },
        { status: 200 }
      );
    }

    if (method === "POST") {
      const { userClass } = await req.json();
      await makeClerkRequest(userId, "PATCH", {
        public_metadata: { userClass },
      });
      return NextResponse.json({ message: "OK" }, { status: 200 });
    }

    throw new Error("Invalid HTTP method");
  } catch (error) {
    console.error("[CLASSES]", error);
    return NextResponse.json(
      { error: "Internal Error" },
      {
        status:
          error instanceof Error && error.message === "Unauthorized"
            ? 401
            : 500,
      }
    );
  }
};

export const POST = async (req: Request) => handleRequest(req, "POST");
export const GET = async (req: Request) => handleRequest(req, "GET");
