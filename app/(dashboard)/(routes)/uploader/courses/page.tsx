import {auth} from '@clerk/nextjs/server';
import {  NextResponse } from "next/server";

import {db} from '@/lib/db';

import {DataTable} from './_components/data-table';
import {columns} from './_components/columns';

const CoursesPage = async () => {
   const {userId} = await auth();
   if (!userId) {
    return NextResponse.redirect('/');
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
