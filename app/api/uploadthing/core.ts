import {isUploader} from '@/lib/uploader';
import {auth} from '@clerk/nextjs';
import {createUploadthing, type FileRouter} from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = () => {
  const {userId} = auth();
  const isAuthorized = isUploader(userId);

  if (!userId || !isAuthorized) throw new Error('Unauthorized');
  return {userId};
};

export const ourFileRouter = {
  courseImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f([
    'text',
    'image',
    'video',
    'audio',
    'pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12',
  ])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({video: {maxFileCount: 1, maxFileSize: '512GB'}})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
