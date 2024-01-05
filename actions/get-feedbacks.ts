import {db} from '@/lib/db';

export const getFeedbacks = async () => {
  try {
    const feedbacks = await db.feedback.findMany();

    return {
      feedbacks,
    };
  } catch (error) {
    return {
      feedbacks: [],
    };
  }
};
