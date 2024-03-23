'use client';
import {ChevronRight, Loader2, Timer} from 'lucide-react';
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

  const checkAnswer: any = React.useCallback(async () => {
    const payload = {
      questionId: currentQuestion.id,
      userAnswer: '',
    };
    try {
      setIsChecking(true);
      const response = await axios.post('/api/quiz/checkAnswer', payload);
      if (response.data) {
        setAveragePercentage(response.data.percentageSimilar);
        toast.success(`Your answers are graded based on similarity 🥳`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsChecking(false);
    }
  }, [currentQuestion.id]);

  const handleNext = React.useCallback(async () => {
    await checkAnswer();
    if (questionIndex < game.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else if (questionIndex === game.questions.length - 1) {
      setHasEnded(true);
    }
  }, [questionIndex, game.questions.length, checkAnswer]);

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
          <div className="flex flex-col items-center justify-center w-full mt-4">
            {/* <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        /> */}
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
    </div>
  );
};

export default OpenEnded;
