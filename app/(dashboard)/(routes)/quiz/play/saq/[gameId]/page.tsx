import {db} from '@/lib/db';
import {redirect} from 'next/navigation';
import React from 'react';
import SAQ from './_components/SAQ';

type Props = {
  params: {
    gameId: string;
  };
};

const SAQPage = async ({params: {gameId}}: Props) => {
  try {
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
    });

    if (!game || game.gameType !== 'saq') {
      // Redirect if game is null or gameType is not 'mcq'
      return redirect('/quiz/quizzer');
    }

    return <SAQ game={game} />;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return <div>Error fetching game data. Please try again later.</div>;
  }
};

export default SAQPage;
