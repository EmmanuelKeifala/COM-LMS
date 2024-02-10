import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import {clerkClient} from '@clerk/nextjs';
import {db} from '@/lib/db';
import {transporter} from '@/lib/sendEmail';

export async function PATCH(
  req: Request,
  {params}: {params: {courseId: string}},
) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {},
      },
    });

    if (!course) {
      return new NextResponse('Not found', {status: 404});
    }

    const hasPublishedChapter = course.chapters.some(
      chapter => chapter.isPublished,
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse('Missing required fields', {status: 401});
    }

    const courseDetail = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });
    const courseLevel = await db.level.findUnique({
      where: {
        id: courseDetail?.levelId!,
      },
    });

    const users = await clerkClient.users.getUserList({
      limit: 499,
    });
    let userEmails: any = [];

    {
      users.map(user => {
        if (user.publicMetadata.userClass === courseLevel?.name) {
          userEmails.push(user.emailAddresses[0].emailAddress);
        }
      });
    }
    const courseLink = `https://meyoneducation.vercel.app/courses/${courseDetail?.id}`;

    const info = await transporter.sendMail({
      from: '"meyoneducation" <meyoneducationhub@gmail.com>', // sender address
      to: userEmails,
      subject: 'Hello, 🔥',
      html: `<p> We have just published the ${courseDetail?.title} course</p> <br /> <div>Here is the link: <a href=${courseLink}>${courseDetail?.title}</a> </div> <br /> <p>Regards, <br /> meyoneducation</p>`,
    });

    const usersWithoutClasses: any = [];
    {
      users.map(user => {
        if (!user.publicMetadata.userClass) {
          usersWithoutClasses.push(user.emailAddresses[0].emailAddress);
        }
      });
    }
    const reminderEmail = await transporter.sendMail({
      from: '"meyoneducation" <meyoneducationhub@gmail.com>', // sender address
      to: usersWithoutClasses,
      subject: 'Hello Student',
      html: `<p><strong>Reminder: Select Your Class on meyoneducation Platform</strong></p>

    <p>Dear Student,</p>

    <p>We hope this email finds you well. We would like to remind you to select your class on the meyoneducation platform. We have recently published the exciting new course, "${courseDetail?.title}," and it's essential for you to enroll in your respective class to access the course materials.</p>

    <p><strong>Details:</strong></p>
    
    <p><strong>Course Title:</strong> ${courseDetail?.title}</p>
    <p><strong>Course Link:</strong> <a href="${courseLink}">${courseDetail?.title}</a></p>

    <p>If you're unsure how to select your class, or if you have any questions, please don't hesitate to reach out to us. You can ask for assistance in our dedicated WhatsApp group, where our team and fellow students are ready to help.</p>

    <p>We appreciate your prompt attention to this matter. Your commitment to your education is valued, and we want to ensure you have the best learning experience possible.</p>

    <p><strong>Best regards,</strong></p>
    <p><em>meyoneducation Team</em></p>`,
    });

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log('[COURSE_ID_PUBLISH]', error);
    return NextResponse.json({status: 500, message: error});
  }
}
