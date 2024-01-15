import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import {clerkClient} from '@clerk/nextjs';
import {db} from '@/lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT!),
  service: process.env.EMAIL_SERVICE!,
  auth: {
    user: process.env.SMTP_MAIL!,
    pass: process.env.SMTP_PASSWORD!,
  },
});

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
    const courseLink = `https://meyoneducation.vercel.app/uploader/courses/${courseDetail?.id}`;

    const info = await transporter.sendMail({
      from: '"meyoneducation" <meyoneducationhub@gmail.com>', // sender address
      to: userEmails,
      subject: 'Hello, 🔥',
      html: `<p> We have just published the ${courseDetail?.title} course</p> <br /> <div>Here is the link: <a href=${courseLink}>${courseDetail?.title}</a> </div> <br /> <p>Regards, <br /> meyoneducation</p>`,
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
    return new NextResponse('Internal Error', {status: 500});
  }
}
