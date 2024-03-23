'use client';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {BarChart, ChevronRight, Loader2, Timer} from 'lucide-react';
import {Metadata} from 'next';
import React from 'react';
import MCQCounter from '../../../_components/MCQCounter';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Take Quiz',
};
type Props = {
  game: any;
};

const MCQ = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);
  const options = React.useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) {
      return [];
    }
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const checkAnswer: any = React.useCallback(async () => {
    const payload = {
      questionId: currentQuestion.id,
      userAnswer: options[selectedChoice],
    };
    try {
      setIsChecking(true);
      const response = await axios.post('/api/quiz/checkAnswer', payload);
      if (response.data.isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
        toast.success('Correct 🥳');
      } else {
        setWrongAnswers(wrongAnswers + 1);
        toast.error('Wrong 😔');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsChecking(false);
    }
  }, [
    currentQuestion.id,
    options,
    selectedChoice,
    wrongAnswers,
    correctAnswers,
  ]);

  const handleNext = React.useCallback(async () => {
    await checkAnswer();
    if (questionIndex < game.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedChoice(0);
    } else if (questionIndex === game.questions.length - 1) {
      setHasEnded(true);
    }
  }, [questionIndex, game.questions.length, checkAnswer]);

  React.useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === '1') {
        setSelectedChoice(0);
      } else if (event.key === '2') {
        setSelectedChoice(1);
      } else if (event.key === '3') {
        setSelectedChoice(2);
      } else if (event.key === '4') {
        setSelectedChoice(3);
      } else if (event.key === 'Enter') {
        await handleNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center mt-10">
        <div className="max-w-4xl w-full px-4">
          <h1 className="text-3xl font-bold text-center mb-4">Quiz Ended</h1>
          <p className="text-lg text-center text-gray-700 mb-8">
            You completed In 00:00
          </p>
          <Link
            href={`/quiz/statistics/${game.id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-700 transition duration-150 ease-in-out">
            View Statistics <BarChart className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center mt-10">
      <div className="max-w-4xl w-full px-4">
        <div className="flex flex-row justify-between mb-4 items-center">
          <p className="text-slate-400 ">
            Topic{' '}
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-3" />
            <span>00:00</span>
          </div>
          <MCQCounter
            correctAnswers={correctAnswers}
            wrongAnswers={wrongAnswers}
          />
        </div>
        <Card className="w-full mt-4">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="mr-5 text-center divide-y divide-zinc-800/50">
              <div>{questionIndex + 1}</div>
              <div className="text-base text-slate-400">
                {game.questions.length}
              </div>
            </CardTitle>
            <CardDescription className="flex-grow text-lg">
              {currentQuestion.question}
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex flex-col items-center justify-center w-full mt-4">
          {options.map((option, index) => {
            return (
              <Button
                key={index}
                className="justify-start w-full py-8 mb-4"
                variant={selectedChoice === index ? 'default' : 'secondary'}
                onClick={() => {
                  setSelectedChoice(index);
                }}>
                <div className="flex items-center justify-start">
                  <div className="p-2 px-3 mr-5 border rounded-md">
                    {index + 1}
                  </div>
                  <div className="text-start">{option}</div>
                </div>
              </Button>
            );
          })}
          {!isChecking ? (
            <Button
              className="mt-2"
              onClick={() => {
                handleNext();
              }}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Loader2 className="mx-auto animate-spin" size={30} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQ;
