import React from 'react';
import QuizMeCard from './_components/QuizMeCard';
import HistoryCard from './_components/HistoryCard';
import HotTopics from './_components/HotTopics';
import RecentActivities from './_components/RecentActivities';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">
          {' '}
          Quiz Dashboard
        </h2>
      </div>
      <div className="grid grid-4 mt-4 md:grid-col-2 gap-5">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grd-cols-2 lg:grid-col">
        <HotTopics />
        <RecentActivities />
      </div>
    </div>
  );
};

export default page;
