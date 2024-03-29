import React from 'react';
import BlogTable from './_components/BlogTable';

type Props = {};

const BlogDashboard = (props: Props) => {
  return (
    <div className="space-y-5">
      <BlogTable />
    </div>
  );
};

export default BlogDashboard;
