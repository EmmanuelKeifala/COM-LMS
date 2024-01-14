import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';
import {getAnalytics} from '@/actions/get-analytics';
import {DataCard} from './_components/data-card';
import {Chart} from './_components/chart';
import {DataTable} from './_components/data-table';
import {columns} from './_components/columns';

const AnalyticsPage = async () => {
  const {userId} = auth();

  if (!userId) {
    return redirect('/');
  }

  const analyticsData: any = await getAnalytics();
  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total Students Enrolled"
          value={analyticsData?.totalStudents}
        />
        <DataCard
          label="Total courses completed"
          value={analyticsData?.totalCompletedCourses}
        />
      </div>
      <h2 className="text-xl font-semibold mb-4">Total Students Enrolled</h2>
      <Chart data={analyticsData?.data} />
      <div className="mt-4">
        {/* <DataTable columns={columns} data={analyticsData?.userData} /> */}
      </div>
    </div>
  );
};

export default AnalyticsPage;
