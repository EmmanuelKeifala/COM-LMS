import {z} from 'zod';

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, {message: 'Topic must be at least four(4) characters long'}),
  type: z.enum(['mcq', 'open_ended', 'saq']),
  amount: z.number().min(1).max(60),
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});

export type IBlog = {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
  is_premium: boolean;
  content: string;
  is_published: boolean;
};

export type IBlogDetial = {
  created_at: string;
  id: string;
  image_url: string;
  is_premium: boolean;
  is_published: boolean;
  title: string;
  blog_content: {
    blog_id: string;
    content: string;
    created_at: string;
  };
} | null;

export type IBlogForm = {
  created_at: string;
  id: string;
  image_url: string;
  is_premium: boolean;
  is_published: boolean;
  title: string;
  blog_content: {
    blog_id: string;
    content: string;
    created_at: string;
  };
};
