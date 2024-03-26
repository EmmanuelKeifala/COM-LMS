import {strict_output} from '@/lib/gpt';
import {NextResponse} from 'next/server';
import {ZodError} from 'zod';

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const {amount, topic, type} = body;
    console.log('[AMOUNT]: ', amount);

    // Define a maximum chunk size
    const chunkSize = 5; // Adjust this value as needed

    // Create an array to hold all generated questions
    let allQuestions: any[] = [];

    // Create prompts based on the requested amount in batches
    for (let i = 0; i < amount; i += chunkSize) {
      const prompts: string[] = [];
      // Generate prompts for the current batch
      for (let j = i; j < Math.min(i + chunkSize, amount); j++) {
        prompts.push(
          `You are to generate a random hard ${type} question about ${topic}`,
        );
      }
      // Call strict_output for the current batch based on type
      let questionsBatch: any;
      if (type === 'open_ended') {
        questionsBatch = await strict_output(
          'You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words and they should be undergraduate based take them from online sources and they should be medical field focus, store all the pairs of answers and questions in a JSON array',
          prompts,
          {
            question: 'question',
            answer: 'answer with max length of 15 words',
          },
        );
      } else if (type === 'mcq') {
        questionsBatch = await strict_output(
          'You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words and they should be undergraduate based take them from online sources and they should be medical field focus, store all answers and questions and options in a JSON array',
          prompts,
          {
            question: 'question',
            answer: 'answer with max length of 15 words',
            option1: 'option1 with max length of 15 words',
            option2: 'option2 with max length of 15 words',
            option3: 'option3 with max length of 15 words',
          },
        );
      }
      // Append the generated questions to the allQuestions array
      allQuestions = allQuestions.concat(questionsBatch);
    }

    console.log('[QUESTIONS: ', allQuestions);

    // Return the concatenated questions array
    return NextResponse.json(
      {
        questions: allQuestions,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        },
      );
    } else {
      return NextResponse.json(
        {
          error: 'internal server error',
        },
        {
          status: 500,
        },
      );
    }
  }
};
