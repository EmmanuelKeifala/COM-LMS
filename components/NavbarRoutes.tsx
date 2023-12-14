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

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {userId} = useAuth();

  const isUploderPage = pathname?.startsWith('/uploader');
  const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname === '/search';
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        <AboutUs />
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
        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
      </div>
    </>
  );
};
