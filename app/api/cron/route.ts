import {clerkClient} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export async function GET(req: Request) {
  try {
    // if (
    //   req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
    // ) {
    //   return new NextResponse('Unauthorized', {status: 401});
    // }
    const users = await clerkClient.users.getUserList({
      limit: 499,
    });

    const usersWithoutClasses: any = [];
    {
      users.map(user => {
        if (!user.publicMetadata.userClass) {
          usersWithoutClasses.push(user.emailAddresses[0].emailAddress);
        }
      });
    }

    console.log('[USER]', usersWithoutClasses);

    return NextResponse.json({ok: true});
  } catch (error) {
    console.log('[CRON JOB ERROR]', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
