import {db} from '@/lib/db';

export const getVideoAnalytics = async (userId: string) => {
  try {
    // Fetch rated videos and rated videos not reviewed in parallel
    const [ratedVideos, ratedVideosNotReviewed] = await Promise.all([
      db.videoRating.findMany({
        include: {
          video: true,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      }),
      db.videoRating.findMany({
        where: {
          isReviewed: false,
          value: {lte: 3},
        },
        include: {
          video: true,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      }),
    ]);

    // Calculate total videos
    const totalVideos = ratedVideos.length;

    // Filter videos with enough ratings
    const videosWithEnoughRatings = ratedVideosNotReviewed.filter(
      (videoRating: any) => {
        // Assuming that `userId` is associated with the user making the request
        const uniqueRaters = new Set(
          ratedVideosNotReviewed.map((vr: any) => vr.userId),
        );
        return uniqueRaters.size >= 5;
      },
    );

    return {
      totalVideos,
      ratedVideosNotReviewed: videosWithEnoughRatings,
    };
  } catch (error) {
    console.error('[GET_VIDEO_ANALYTICS]', error);
    // Properly handle errors and return a default value
    return {
      totalVideos: 0,
      ratedVideosNotReviewed: [],
    };
  }
};
