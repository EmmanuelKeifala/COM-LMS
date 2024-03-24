import {db} from '@/lib/db';
import {LucideLayoutDashboard} from 'lucide-react';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import React from 'react';
import ResultsCard from './_components/ResultsCard';
import AccuracyCard from './_components/AccuracyCard';
import TimeTakenCard from './_components/TimeTaken';
import QuestionsList from './_components/QuestionList';
import {buttonVariants} from '@/components/ui/button';

type Props = {
  params: {
    gameId: string;
  };
};

const StatisticsPage = async ({params: {gameId}}: Props) => {
  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    include: {questions: true},
  });

  if (!game) redirect('/quiz/quizzer');

  let accuracy: number = 0;

  if (game.gameType === 'mcq') {
    let totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === 'open_ended') {
    let totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / game.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;
  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>

          <div className="flex items-center space-x-2">
            <Link href={'/quiz'} className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Quiz
            </Link>
          </div>
        </div>
        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(game.timeEned ?? 0)}
            timeStarted={new Date(game.timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={game.questions} />
      </div>
    </>
  );
};

export default StatisticsPage;
