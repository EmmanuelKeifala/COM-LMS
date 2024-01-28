import {NextResponse} from 'next/server';
import {transporter} from '@/lib/sendEmail';
import axios from 'axios';

// async function sendEmailBatch(emails: any[]) {
//   const emailPromises = emails.map(async (user: any) => {
//     await transporter.sendMail({
//       from: '"meyoneducation" <meyoneducationhub@gmail.com>',
//       to: user.email,
//       subject: 'Hello',
//       html: `<p><strong>Reminder: Select Your Class on meyoneducation Platform</strong></p>
//         <p>Dear ${user.name},</p>
//         <p>We hope this email finds you well. We would like to remind you to select your class on the meyoneducation platform. We have recently published the exciting new course, and it's essential for you to enroll in your respective class to access the course materials.</p>
//         <p>If you're unsure how to select your class, or if you have any questions, please don't hesitate to reach out to us. You can ask for assistance in our dedicated <a href="https://chat.whatsapp.com/HzNqllW1I3RI4wCOzXkEPu">WhatsApp group</a>, where our team and fellow students are ready to help.</p>
//         <p>We appreciate your prompt attention to this matter. Your commitment to your education is valued, and we want to ensure you have the best learning experience possible.</p>
//         <p><strong>Best regards,</strong></p>
//         <p><em>meyoneducation Team</em></p>`,
//     });
//   });

//   // Wait for all emails in the batch to be sent
//   await Promise.all(emailPromises);
//   transporter.close();
// }

// export async function GET(req: Request) {
//   try {
//     const response = await axios.get(
//       `https://api.clerk.com/v1/users?limit=499`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//           Accept: 'application/json',
//         },
//       },
//     );

//     const usersWithoutClasses: any = [];

//     response.data.forEach((user: any) => {
//       if (!user.publicMetadata?.userClass) {
//         usersWithoutClasses.push({
//           name: user?.first_name || 'Student',
//           email: user.email_addresses[0].email_address,
//         });
//       }
//     });

//     // Set the batch size and delay between batches
//     const batchSize = 50;
//     const delayBetweenBatches = 5000; // 5 seconds

//     // Send emails in batches
//     for (let i = 0; i < usersWithoutClasses.length; i += batchSize) {
//       const batch = usersWithoutClasses.slice(i, i + batchSize);
//       // await sendEmailBatch(batch);

//       // Introduce a delay between batches
//       if (i + batchSize < usersWithoutClasses.length) {
//         await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
//       }
//     }

//     return NextResponse.json('Emails sent successfully', {status: 200});
//   } catch (error) {
//     console.log('[CRON JOB ERROR]', error);
//     return new NextResponse('Internal server error', {status: 500});
//   }
// }
