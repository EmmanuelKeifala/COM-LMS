import {db} from '@/lib/db';
import {auth} from '@clerk/nextjs';
import axios from 'axios';
import {NextResponse} from 'next/server';
import {ZodError} from 'zod';

export async function POST(req: Request, res: Response) {
  try {
    const {userId} = auth();
    // if (!userId) return new NextResponse('Unauthorized', {status: 401});
    const body = await req.json();
    const {amount, topic, type} = body;

    const game = await db.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: userId!!,
        topic,
      },
    });

    const {data} = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/quiz/questions`,
      // `http://localhost:3000/api/quiz/questions`,
      {
        amount,
        topic,
        type,
      },
    );

    let manyData = [];
    if (type === 'mcq' || type === 'open_ended' || type === 'saq') {
      if (data.questions && Array.isArray(data.questions)) {
        manyData = data.questions.map((question: any) => {
          const questionData: any = {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: type,
          };

          if (type === 'mcq') {
            const options = [
              question.answer,
              question.option1,
              question.option2,
              question.option3,
            ];

            // Shuffle the options array using Fisher-Yates (Knuth) Shuffle Algorithm
            for (let i = options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [options[i], options[j]] = [options[j], options[i]];
            }

            questionData.options = JSON.stringify(options);
          }

          return questionData;
        });
      } else {
        throw new Error('Questions data is missing or not an array');
      }
    }

    await db.question.createMany({
      data: manyData,
    });

    return NextResponse.json({
      gameId: game.id,
    });
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
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      {
        status: 500,
      },
    );
  }
}
