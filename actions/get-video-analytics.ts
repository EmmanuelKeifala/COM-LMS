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
    const videosWithEnoughRatings: any = ratedVideosNotReviewed.filter(
      videoRating => {
        // Assuming that `userId` is associated with the user making the request
        const uniqueRaters = new Set(
          ratedVideosNotReviewed.map(vr => vr.userId),
        );
        return uniqueRaters.size >= 5;
      },
    );
    return {
      totalVideos,
      ratedVideosNotReviewed: videosWithEnoughRatings,
    };
  } catch (error) {
    return {
      totalVideos: 0,
      ratedVideos: [],
    };
  }
};
