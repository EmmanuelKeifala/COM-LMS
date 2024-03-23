import {db} from '@/lib/db';
import {NextResponse} from 'next/server';
import {ZodError} from 'zod';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const {questionId, userAnswer} = body;

    const question = await db.question.findUnique({
      where: {
        id: questionId,
      },
    });
    if (!question) {
      return NextResponse.json(
        {
          error: 'Question was not found',
        },
        {
          status: 401,
        },
      );
    }
    await db.question.update({
      where: {
        id: questionId,
      },
      data: {
        userAnswer,
      },
    });
    if (question.questionType === 'mcq') {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();

      await db.question.update({
        where: {id: questionId},
        data: {
          isCorrect,
        },
      });
      return NextResponse.json(
        {
          isCorrect,
        },
        {
          status: 200,
        },
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        },
      );
    }
  }
}
