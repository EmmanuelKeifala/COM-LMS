export const isUploader = (userId?: string | null) => {
  const uploaderIds = process.env.NEXT_PUBLIC_UPLOADER_IDS?.split(',') || [];

  return uploaderIds.includes(userId || '');
};
