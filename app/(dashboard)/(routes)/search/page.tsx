import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import CoursesList from '@/components/courses-list';

import { Categories } from './_components/categories';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const { coursesWithProgress, userClass } = await getCourses({
    userId,
    ...searchParams,
  });

  const level = await db.level.findUnique({
    where: {
      name: userClass,
    },
  });

  const categories = await db.category.findMany({
    where: {
      levelId: level?.id!,
    },
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-4">

        {userClass &&
              <Suspense fallback={<div>Loading...</div>}>
                         <Categories items={categories}/>
         </Suspense> 
         }
        {userClass ? (
          <CoursesList items={coursesWithProgress} />
        ) : (
          <div className="text-center text-sm text-muted-foreground mt-10">
            Please select your class to load your courses
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;