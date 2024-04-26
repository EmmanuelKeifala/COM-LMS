import React from 'react';
import {DataCard} from '../analytics/_components/data-card';
import {getFeedbacks} from '@/actions/get-feedbacks';
import {DataTable} from './_components/data-table';
import {columns} from './_components/columns';

const FeedbackPage = async () => {
  const {feedbacks} = await getFeedbacks();
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Feedbacks" value={feedbacks.length} />
      </div>
      <div className="p-6">
        <DataTable columns={columns} data={feedbacks} />
      </div>
    </div>
  );
};

export default FeedbackPage;
