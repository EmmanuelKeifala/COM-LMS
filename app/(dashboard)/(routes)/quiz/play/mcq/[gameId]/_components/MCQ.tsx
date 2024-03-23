'use client';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ChevronRight, Timer} from 'lucide-react';
import {Metadata} from 'next';
import React from 'react';
export const metadata: Metadata = {
  title: 'Take Quiz',
};
type Props = {
  game: any;
};

const MCQ = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);
  const options = React.useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) {
      return [];
    }
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

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
          {/* <MCQCounter /> */}
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
          <Button className="mt-2">
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MCQ;
