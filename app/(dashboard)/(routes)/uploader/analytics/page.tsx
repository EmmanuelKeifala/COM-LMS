import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';

import {getAnalytics} from '@/actions/get-analytics';

import {DataCard} from './_components/data-card';
import {Chart} from './_components/chart';

const AnalyticsPage = async () => {
  const {userId} = auth();

  if (!userId) {
    return redirect('/');
  }

  const {data, totalStudents} = await getAnalytics(userId);
  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Students Enrolled" value={totalStudents} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
