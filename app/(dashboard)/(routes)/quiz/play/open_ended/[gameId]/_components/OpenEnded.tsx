'use client';
import {ChevronRight, Loader2, Timer, BarChart} from 'lucide-react';
import React from 'react';
import {differenceInSeconds} from 'date-fns';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {formatTimeDelta} from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import OpenEndedPercentage from './OpenEndedPercentage';
import BlankAnswerInput from './BlankedAnswer';
import {checkAnswerSchema} from '@/lib/validation';
import {z} from 'zod';
import Link from 'next/link';
type Props = {
  game: any;
};

const OpenEnded = ({game}: Props) => {
  const [hasEnded, setHasEnded] = React.useState(false);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState('');
  const [averagePercentage, setAveragePercentage] = React.useState(0);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);

  async function endGameMutation(gameId: any) {
    try {
      const payload = {gameId};
      const response = await axios.post(`/api/quiz/endGame`, payload);
      return response.data;
    } catch (error) {
      console.error('Error ending game:', error);
      throw error;
    }
  }

  const checkAnswer: any = React.useCallback(async () => {
    let filledAnswer = blankAnswer;
    document
      .querySelectorAll<HTMLInputElement>('#user-blank-input')
      .forEach(input => {
        filledAnswer = filledAnswer.replace('_____', input.value);
        input.value = '';
      });
    const payload: any = {
      questionId: currentQuestion.id,
      userAnswer: filledAnswer,
    };
    try {
      setIsChecking(true);
      const response = await axios.post('/api/quiz/checkAnswer', payload);
      if (response.data) {
        setAveragePercentage(prev => {
          return (prev + response.data.percentageSimilar) / (questionIndex + 1);
        });
        toast.success(
          `Your answer is ${response.data.percentageSimilar}% similar to the correct answer`,
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsChecking(false);
    }
  }, [blankAnswer, currentQuestion.id, questionIndex]);

  const handleNext = React.useCallback(async () => {
    await checkAnswer();
    if (questionIndex < game.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      await endGameMutation(game.id);
      setHasEnded(true);
    }
  }, [checkAnswer, questionIndex, game.questions.length, game.id]);

  if (hasEnded) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center mt-10 text-center">
        <div className="max-w-4xl w-full px-4">
          <h1 className="text-3xl font-bold mb-4">Quiz Ended</h1>
          <p className="text-lg text-gray-700 mb-8">
            You completed In{' '}
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </p>
          <Link
            href={`/quiz/statistics/${game.id}`}
            className="inline-flex items-center bg-blue-500 border px-4 py-2  border-transparent rounded-md font-semibold text-white hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-700 transition duration-150 ease-in-out">
            View Statistics <BarChart className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full w-full flex flex-col justify-center items-center mt-10">
      <div className="max-w-4xl w-full px-4">
        <div className="flex flex-row justify-between mb-4 items-center flex-wrap">
          <p className="text-slate-400 mb-2">
            Topic{' '}
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400 mb-2">
            <Timer className="mr-3" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
          <OpenEndedPercentage percentage={averagePercentage} />
        </div>
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
              <div>{questionIndex + 1}</div>
              <div className="text-base text-slate-400">
                {game.questions.length}
              </div>
            </CardTitle>
            <CardDescription className="flex-grow text-lg">
              {currentQuestion?.question}
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex flex-col items-center justify-center w-full mt-4">
          <div className="flex flex-col items-center justify-center w-full mt-2 mb-2">
            <BlankAnswerInput
              setBlankAnswer={setBlankAnswer}
              answer={currentQuestion.answer}
            />
            {!isChecking ? (
              <Button
                className="mt-4"
                onClick={() => {
                  handleNext();
                }}>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Loader2 className="mx-auto animate-spin mt-4" size={30} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenEnded;
