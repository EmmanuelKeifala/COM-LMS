import {db} from '@/lib/db';
import {redirect} from 'next/navigation';
import React from 'react';
import OpenEnded from './_components/OpenEnded';

type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = async ({params: {gameId}}: Props) => {
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
            answer: true,
          },
        },
      },
    });

    if (!game || game.gameType !== 'open_ended') {
      // Redirect if game is null or gameType is not 'mcq'
      return redirect('/quiz/quizzer');
    }

    return <OpenEnded game={game} />;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return <div>Error fetching game data. Please try again later.</div>;
  }
};

export default OpenEndedPage;
