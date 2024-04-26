import {db} from '@/lib/db';

export const getFeedbacks = async () => {
  try {
    const feedbacks = await db.feedback.findMany({
      cacheStrategy: {swr: 1, ttl: 1},
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
