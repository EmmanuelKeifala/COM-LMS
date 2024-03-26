import {Clock, CopyCheck, Edit2, XCircle} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {db} from '@/lib/db';

type Props = {
  limit: number;
  userId: any;
};
const IncompleteGames = async ({limit, userId}: Props) => {
  const games = await db.game.findMany({
    take: limit,
    where: {
      userId,
      timeEned: null,
    },
    orderBy: {
      timeStarted: 'desc',
    },
  });
  return (
    <div className="space-y-8">
      {games.map(game => {
        return (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === 'mcq' ? (
                <CopyCheck className="mr-3" />
              ) : (
                <Edit2 className="mr-3" />
              )}
              <div className="ml-4 space-y-1">
                <div className="w-full flex flex-row justify-center items-center">
                  <Link
                    className="text-base font-medium leading-none underline flex flex-row "
                    href={`/quiz/play/${game.gameType}/${game.id}`}>
                    {game.topic}
                  </Link>
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <span className="font-light text-slate-400 ml-4">
                      (incomplete){' '}
                    </span>
                    <XCircle size={25} color="red" />
                  </div>
                </div>

                {game.timeEned ? (
                  <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(game.timeEned ?? 0).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(game.timeStarted).toLocaleDateString()}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {game.gameType === 'mcq' ? 'Multiple Choice' : 'Open-Ended'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default IncompleteGames;
