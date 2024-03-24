'use client';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {History} from 'lucide-react';
import {useRouter} from 'next/navigation';
import React from 'react';

type Props = {};

const HistoryCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        router.push('/quiz/history');
      }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-2">
        <CardTitle className="text-2xl font-bold ">History</CardTitle>
        <History size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {' '}
          View your past quiz attempts
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
