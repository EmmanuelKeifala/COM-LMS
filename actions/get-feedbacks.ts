import {db} from '@/lib/db';

export const getFeedbacks = async () => {
  try {
    const feedbacks = await db.feedback.findMany({
      cacheStrategy: {swr: 60, ttl: 60},
    });

    return {
      feedbacks,
    };
  } catch (error) {
    return {
      feedbacks: [],
    };
  }
};
