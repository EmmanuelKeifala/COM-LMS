import {db} from '@/lib/db';

export const getVideoAnalytics = async (userId: string) => {
  try {
    const ratedVideos = await db.videoRating.findMany({
      include: {
        video: true,
      },
    });
    const totalVideos = ratedVideos.length;

    return {
      totalVideos,
      ratedVideos,
    };
  } catch (error) {
    return {
      totalVideos: 0,
      ratedVideos: [],
    };
  }
};
