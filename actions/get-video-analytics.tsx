import {db} from '@/lib/db';

export const getVideoAnalytics = async (userId: string) => {
  try {
    const ratedVideos = await db.videoRating.findMany({
      include: {
        video: true,
      },
    });
    const ratedVideosNotReviewed = await db.videoRating.findMany({
      where: {
        isReviewed: false,
        value: {
          lte: 3,
        },
      },
      include: {
        video: true,
      },
    });
    const totalVideos = ratedVideos.length;

    return {
      totalVideos,
      ratedVideosNotReviewed,
    };
  } catch (error) {
    return {
      totalVideos: 0,
      ratedVideos: [],
    };
  }
};
