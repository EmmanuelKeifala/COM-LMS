import {getChapter} from '@/actions/get-chapters';
import {Banner} from '@/components/banner';
import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';
import {VideoPlayer} from './_components/video-player';
import YoutubePlayerComponent from '@/components/YoutubePlayerComponent';
import {CourseProgressButton} from './_components/course-progress-button';
import {CourseEnrollButton} from './_components/course-enroll-button';
import {Separator} from '@/components/ui/separator';
import {Preview} from '@/components/preview';
import {File, LucideLightbulb} from 'lucide-react';
import ChatButton from '@/components/ChatButton';

const ChapterIdPage = async ({
  params,
}: {
  params: {courseId: string; chapterId: string};
}) => {
  const {userId} = auth();

  if (!userId) return redirect('/');
  const {
    chapter,
    course,
    attachments,
    nextChapter,
    userProgress,
    isEnrolled,
    chapterAttachment,
    videoUrls,
    quizUrls,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect('/');
  }
  const isLocked = !chapter.isFree && !isEnrolled;
  const completeOnEnd = !!isEnrolled && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to enroll this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        {isEnrolled && (
          <div className="w-full flex items-end justify-end m-10">
            <ChatButton />
          </div>
        )}
        <div className="p-4">
          <YoutubePlayerComponent
            youtubeUrls={videoUrls}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {isEnrolled ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            {chapter.description != '<p>none</p>' && (
              <Preview value={chapter.description!} />
            )}
          </div>
          <div>
            {!!attachments.length && (
              <>
                <Preview value={'Course Resources'} />
                <Separator />
                <div className="p-4">
                  {attachments.map((attachment, index) => (
                    <a
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                      <span className="mr-2">{index + 1}.</span> <File />
                      <p className="ml-2 line-clamp-1"> {attachment.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <Separator />
          </div>
          <div>
            {!!chapterAttachment.length && (
              <>
                <Preview value={'Chapter Resources'} />
                <Separator />
                <div className="p-4">
                  {chapterAttachment.map((attachment, index) => (
                    <a
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                      <span className="mr-2">{index + 1}.</span> <File />
                      <p className="ml-2 line-clamp-1"> {attachment.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <Separator />
          </div>
          <div>
            {!!quizUrls.length && (
              <>
                <Preview value={'Chapter Quizzes'} />
                <Separator />
                <div className="p-4">
                  {quizUrls.map((attachment, index) => (
                    <a
                      href={attachment.quizUrl}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                      <LucideLightbulb className="mr-2" />
                      <p className="line-clamp-1"> Quiz {index + 1}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
