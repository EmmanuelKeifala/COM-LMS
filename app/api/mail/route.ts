import {NextResponse} from 'next/server';
import {transporter} from '@/lib/sendEmail';
import axios from 'axios';
import {db} from '@/lib/db';

async function sendEmailBatch(emails: any[], data: any) {
  const emailPromises = emails.map(async (user: any) => {
    await transporter.sendMail({
      from: '"meyoneducation" <meyoneducationhub@gmail.com>',
      to: user.email,
      subject: data.subject,
      html: `
        <p>Dear ${user.name},</p>
        ${data.messageBody}
        <p><strong>Best regards,<br /> Emmanuel Keifala</strong></p>
        <p><em>meyoneducation Team</em></p>`,
    });
  });

  // Wait for all emails in the batch to be sent
  await Promise.all(emailPromises);
}

export async function POST(req: Request) {
  try {
    const {data} = await req.json();
    const response = await axios.get(
      `https://api.clerk.com/v1/users?limit=499`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          Accept: 'application/json',
        },
      },
    );

    const userData: any[] = [];

    const fetchUserDetailsPromises = (userIds: string[]) =>
      userIds.map(userId => fetchUserDetails(userId));

    const pushUserDetails = (user: any) => {
      userData.push({
        name: user?.first_name || 'Student',
        email: user?.email_addresses[0]?.email_address || null,
      });
    };

    if (data.userCategory === 'general') {
      response.data.forEach((user: any) => {
        if (user) {
          pushUserDetails(user);
        }
      });
    } else if (data.userCategory === 'noClass') {
      response.data.forEach((user: any) => {
        if (!user.public_metadata.userClass) {
          pushUserDetails(user);
        }
      });
    } else if (data.userCategory === 'courseNotCompleted') {
      const enrolledUsers = await db.userProgress.findMany({
        where: {
          isCompleted: false,
        },
        select: {
          userId: true,
        },
      });

      const uniqueUserIds = Array.from(
        new Set(enrolledUsers.map(user => user.userId)),
      );

      const completedCourseUserDetails = await Promise.all(
        fetchUserDetailsPromises(uniqueUserIds),
      );

      const uniqueEmailsSet = new Set<string>();
      const filteredCompletedCourseUserEmails = completedCourseUserDetails
        .filter(user => user.email !== null && !uniqueEmailsSet.has(user.email))
        .map(user => {
          uniqueEmailsSet.add(user.email);
          pushUserDetails(user);
        });
    } else if (data.userCategory === 'noCourse') {
      const noCourseUsers = await db.userProgress.findMany({
        select: {
          userId: true,
        },
      });
      const noCourseUserIds = noCourseUsers.map(user => user.userId);
      const noCourseIds: any[] = [];

      response.data.forEach(async (user: any) => {
        if (user) {
          if (!noCourseUserIds.includes(user.id)) {
            noCourseIds.push(user.id);
          }
        }
      });

      const completedCourseUserDetails = await Promise.all(
        fetchUserDetailsPromises(noCourseIds),
      );

      const uniqueEmailsSet = new Set<string>();
      const filteredCompletedCourseUserEmails = completedCourseUserDetails
        .filter(user => user.email !== null && !uniqueEmailsSet.has(user.email))
        .map(user => {
          uniqueEmailsSet.add(user.email);
          pushUserDetails(user);
        });
    }


    // Set the batch size and delay between batches
    const batchSize = 50;
    const delayBetweenBatches = 5000;

    // Send emails in batches
    for (let i = 0; i < userData.length; i += batchSize) {
      const batch = userData.slice(i, i + batchSize);

      // Parallelize email sending within a batch
      await Promise.all(batch.map(user => sendEmailBatch([user], data)));

      // Introduce a delay between batches
      if (i + batchSize < userData.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    return NextResponse.json('Emails sent successfully', {status: 200});
  } catch (error) {
    console.log('[Email Error]', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}

const fetchUserDetails: any = async (userId: string) => {
  try {
    const response = await axios.get(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          Accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};
