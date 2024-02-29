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
        <p><strong>Best regards,<br />David Moses Ansumana</strong></p>
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

    const pushUserDetails = (user: any) => {
      userData.push({
        name: user?.first_name || 'Student',
        email: user?.email_addresses[0]?.email_address || null,
      });
    };

    if (data.userCategory === 'general' || data.userCategory === 'noClass') {
      response.data.forEach((user: any) => {
        if (user && (!data.userCategory || !user.public_metadata.userClass)) {
          pushUserDetails(user);
        }
      });
    } else if (
      data.userCategory === 'courseNotCompleted' ||
      data.userCategory === 'noCourse'
    ) {
      const usersToCheck =
        data.userCategory === 'courseNotCompleted'
          ? await db.userProgress.findMany({
              where: {isCompleted: false},
              select: {userId: true},
            })
          : await db.userProgress.findMany({select: {userId: true}});
      const userIDsToCheck = usersToCheck.map(user => user.userId);
      console.log(userIDsToCheck);
      response.data.forEach((user: any) => {
        // Check if the user is in the response and not in the database users
        if (user && !userIDsToCheck.includes(user.id)) {
          pushUserDetails(user);
        }
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
