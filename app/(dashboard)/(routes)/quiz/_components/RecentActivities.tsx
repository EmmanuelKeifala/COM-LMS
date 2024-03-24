import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import {db} from '@/lib/db';
import {auth} from '@clerk/nextjs';
import HistoryComponent from '../history/_components/HistoryComponent';

type Props = {};

const RecentActivityCard = async (props: Props) => {
  const {userId} = auth();
  const games_count = await db.game.count({
    where: {
      userId: userId!!,
    },
  });
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/quiz/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of {games_count} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent limit={10} userId={userId} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
