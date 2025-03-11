import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react';
import MCQ from './_components/MCQ';

type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = async ({ params: { gameId } }: Props) => {
  try {
    // Fetch game data with caching
    const game = await db.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
          },
        },
      },
      cacheStrategy: { swr: 60, ttl: 60 }, // Cache the game query
    });

    // Redirect if game is null or gameType is not 'mcq'
    if (!game || game.gameType !== 'mcq') {
      return redirect('/quiz/quizzer');
    }

    // Render the MCQ component with the fetched game data
    return <MCQ game={game} />;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return <div>Error fetching game data. Please try again later.</div>;
  }
};

export default MCQPage;