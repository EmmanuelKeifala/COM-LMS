import {z} from 'zod';

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, {message: 'Topic must be at least four(4) characters long'}),
  type: z.enum(['mcq', 'open_ended', 'saq']),
  amount: z.number().min(1).max(20),
});
