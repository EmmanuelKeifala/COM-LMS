'use client';

import {UserButton, useAuth} from '@clerk/nextjs';
import {usePathname, useRouter} from 'next/navigation';
import {Button} from './ui/button';
import Link from 'next/link';
import {LogOut} from 'lucide-react';
import {SearchInput} from './search-input';
import {isUploader} from '@/lib/uploader';
import AboutUs from './AboutUs';
import {ModeToggle} from './ThemeToggle';
import ClassSelection from './ClassSelection';

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {userId} = useAuth();

  const isUploderPage = pathname?.startsWith('/uploader');
  const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname === '/search';
  const isMeetingPage = pathname.includes('/videoStreaming');

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="w-full flex gap-x-2 ml-auto items-center justify-between">
        {isSearchPage && <ClassSelection />}
        {!isMeetingPage && <AboutUs />}
        {isUploderPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isUploader(userId) ? (
          <Link href="/uploader/courses">
            <Button size="sm" variant="ghost">
              Uploader mode
            </Button>
          </Link>
        ) : null}
        {isMeetingPage && (
          <div className="flex flex-row w-full gap-10">
            <div className="hover:font-bold hover:rounded-md">
              <Link href="/videoStreaming/meets">New Meeting</Link>
            </div>
            <div className="flex items-center gap-5 hover:font-bold hover:rounded-md">
              <Link href="/meeting">Meetings</Link>
            </div>
          </div>
        )}
        <div className="flex gap-3 items-center">
          <UserButton afterSignOutUrl="/" />
          <ModeToggle />
        </div>
      </div>
    </>
  );
};
