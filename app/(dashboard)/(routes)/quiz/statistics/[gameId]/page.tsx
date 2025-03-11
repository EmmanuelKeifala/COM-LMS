import { db } from '@/lib/db';
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import ResultsCard from './_components/ResultsCard';
import AccuracyCard from './_components/AccuracyCard';
import TimeTakenCard from './_components/TimeTaken';
import QuestionsList from './_components/QuestionList';
import { buttonVariants } from '@/components/ui/button';
import { JsonValue } from '@prisma/client/runtime/library';
import { GameType as PrismaGameType } from '@prisma/client';
import { NextResponse } from 'next/server';

type GameType = 'mcq' | 'open_ended' | 'saq';

interface Question {
  question: string;
  id: string;
  answer: string;
  gameId: string;
  options: JsonValue;
  percentageCorrect: number | null;
  isCorrect: boolean | null;
  questionType: GameType;
  userAnswer: string | null;
}

// Update interface to match database schema
interface Game {
  id: string;
  gameType: GameType;
  questions: Question[];
  timeEned: string | null;  // Changed from timeEnded to timeEned to match DB
  timeStarted: string | null;
  userId: string;
  topic: string;
}

interface PageProps {
  params: {
    gameId: string;
  };
}

const mapPrismaGameType = (type: PrismaGameType): GameType => {
  switch (type) {
    case 'mcq':
      return 'mcq';
    case 'open_ended':
      return 'open_ended';
    case 'saq':
      return 'saq';
    default:
      return 'mcq';
  }
};

const calculateAccuracy = (game: Game): number => {
  if (game.gameType === 'mcq') {
    const totalCorrect = game.questions.filter((q) => q.isCorrect).length;
    return Math.round((totalCorrect / game.questions.length) * 100 * 100) / 100;
  }

  if (game.gameType === 'open_ended' || game.gameType === 'saq') {
    const totalPercentage = game.questions.reduce(
      (acc, question) => acc + (question.percentageCorrect ?? 0),
      0
    );
    return Math.round((totalPercentage / game.questions.length) * 100 * 100) / 100;
  }

  return 0;
};

async function getGame(gameId: string): Promise<Game | null> {
  try {
    const game = await db.game.findUnique({
      where: {
        id: gameId
      },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            answer: true,
            gameId: true,
            options: true,
            percentageCorrect: true,
            isCorrect: true,
            questionType: true,
            userAnswer: true
          }
        }
      }
    });

    if (!game) {
      return null;
    }

    const mappedQuestions: Question[] = game.questions.map(question => ({
      ...question,
      questionType: mapPrismaGameType(question.questionType as PrismaGameType)
    }));

    return {
      id: game.id,
      gameType: mapPrismaGameType(game.gameType as PrismaGameType),
      questions: mappedQuestions,
      timeEned: game.timeEned?.toISOString() || null,  // Changed from timeEnded to timeEned
      timeStarted: game.timeStarted?.toISOString() || null,
      userId: game.userId,
      topic: game.topic
    };
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
}

const StatisticsPage = async ({ params }: PageProps) => {
  const game = await getGame(params.gameId);

  if (!game) {
    return NextResponse.redirect('/quiz/quizzer');
  }

  const accuracy = calculateAccuracy(game);

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Statistics</h2>

        <div className="flex items-center space-x-2">
          <Link href="/quiz" className={buttonVariants()}>
            <LucideLayoutDashboard className="mr-2" />
            Back to Quiz
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-7">
        <ResultsCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeTakenCard
          timeEnded={game.timeEned ? new Date(game.timeEned) : new Date(0)}  // Changed prop to use timeEned
          timeStarted={game.timeStarted ? new Date(game.timeStarted) : new Date(0)}
        />
      </div>

      <QuestionsList questions={game.questions} />
    </div>
  );
};

export default StatisticsPage;