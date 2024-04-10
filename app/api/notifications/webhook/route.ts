import {clerkClient} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import webPush, {WebPushError} from 'web-push';

export async function POST(req: Request, res: Response) {
  try {
    const {event, usersWithSubscriptions} = await req.json();
    const pushPromises = usersWithSubscriptions
      .map(
        (recipient: {privateMetadata: {subscription: never[]}; id: string}) => {
          const subscriptions: any =
            recipient.privateMetadata.subscription || [];
          return subscriptions.map((subscription: any) => {
            webPush
              .sendNotification(
                subscription.subscription,
                JSON.stringify({
                  title: event.title,
                  description: event.description,
                  slug: event.slug.current,
                  icon: '/logo1.png',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/post/${event.slug.current}`,
                }),
                {
                  vapidDetails: {
                    subject: 'mailto:meyoneducationhub@gmail.com',
                    publicKey: process.env.NEXT_PUBLIC_PUSH_SERVER_KEY!,
                    privateKey: process.env.PRIVATE_PUSH_SERVER_KEY!,
                  },
                },
              )
              .catch(error => {
                console.log('Error sending push notification', error);
                if (error instanceof WebPushError && error.statusCode === 401) {
                  clerkClient.users.updateUser(recipient.id, {
                    privateMetadata: {
                      subscription: subscriptions.filter(
                        (sub: any) =>
                          sub.subscription !== subscription.subscription,
                      ),
                    },
                  });
                }
              });
          });
        },
      )
      .flat();

    await Promise.all(pushPromises.filter((promise: null) => promise !== null));

    return NextResponse.json('success', {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json('error', {status: 500});
  }
}
