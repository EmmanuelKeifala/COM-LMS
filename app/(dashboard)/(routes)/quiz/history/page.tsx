import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import React from 'react';
import Link from 'next/link';
import {buttonVariants} from '@/components/ui/button';
import {LucideLayoutDashboard} from 'lucide-react';
import {auth} from '@clerk/nextjs/server';
import HistoryComponent from './_components/HistoryComponent';

type Props = {};

const History = async (props: Props) => {
  const {userId} = await auth();
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">History</CardTitle>
              <Link className={buttonVariants()} href="/quiz">
                <LucideLayoutDashboard className="mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-scroll">
            <HistoryComponent limit={100} userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
