import { auth, createClerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PushSubscription } from "web-push";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
export async function POST(req: Request, res: Response) {
  try {
    const newSubscription: PushSubscription | undefined = await req.json();

    if (newSubscription === undefined)
      return NextResponse.json("Bad request", { status: 400 });
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) return NextResponse.json("User not found", { status: 401 });

    const userSubscriptions: any = user!.privateMetadata.subscription || [];
    const updatedSubscriptions = userSubscriptions.filter(
      (subscription: any) => {
        return subscription.endpoint !== newSubscription.endpoint;
      }
    );
    updatedSubscriptions.push(newSubscription);
    await clerkClient.users.updateUser(userId, {
      privateMetadata: { subscription: updatedSubscriptions },
    });

    return NextResponse.json("Success", { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const subscriptionToDelete: PushSubscription | undefined = await req.json();
    if (subscriptionToDelete === undefined)
      return NextResponse.json("Bad request", { status: 400 });

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) return NextResponse.json("User not found", { status: 401 });

    const userSubscriptions: any = user!.privateMetadata.subscription || [];
    const updatedSubscriptions = userSubscriptions.filter(
      (subscription: any) => {
        subscription.endpoint !== subscriptionToDelete.endpoint;
      }
    );

    await clerkClient.users.updateUser(userId, {
      privateMetadata: { subscription: updatedSubscriptions },
    });

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
