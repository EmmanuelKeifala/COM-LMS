'use client';

import {UserButton, useAuth} from '@clerk/nextjs';
import {usePathname, useRouter} from 'next/navigation';
import {Button} from './ui/button';
import Link from 'next/link';
import {BellOff, BellRing, LogOut} from 'lucide-react';
import {SearchInput} from './search-input';
import {isUploader} from '@/lib/uploader';
import AboutUs from './AboutUs';
import {ModeToggle} from './ThemeToggle';
import ClassSelection from './ClassSelection';
import {useEffect, useState} from 'react';
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unRegisterPushNotification,
} from '@/actions/push-service';
import toast from 'react-hot-toast';

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const {userId} = useAuth();

  const isUploderPage = pathname?.startsWith('/uploader');
  const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname === '/search';
  const isBlogPage = pathname === '/blog';

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto items-center justify-between">
        {isSearchPage && <ClassSelection />}
        {isBlogPage && <PushNotificationToggleButton />}
        <AboutUs />
        {isUploderPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isUploader(userId) ? ( 
          <>
            <Link href="/uploader/courses">
              <Button size="sm" variant="ghost">
                Uploader mode
              </Button>
            </Link>
            <Link href="/studio/structure">
              <Button size="sm" variant="ghost">
                Blog Studio
              </Button>
            </Link>
          </>
        ) : null}
        <div className="flex gap-3 items-center">
          <UserButton afterSignOutUrl="/sign-in" />
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

function PushNotificationToggleButton() {
  const [hasActivePushNotification, setHasActivePushNotification] =
    useState<boolean>();
  useEffect(() => {
    async function getActivePushNotification() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushNotification(!!subscription);
    }
    getActivePushNotification();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unRegisterPushNotification();
      }

      setHasActivePushNotification(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === 'denied') {
        toast.error('Please enable notifications in your settings');
      } else {
        toast.error('Something went wrong');
      }
    }
  }

  if (hasActivePushNotification === undefined) {
    return null;
  }
  return (
    <div>
      {hasActivePushNotification ? (
        <span title="Disable Notifications">
          <BellOff
            onClick={() => setPushNotificationsEnabled(false)}
            className="cursor-pointer"
          />
        </span>
      ) : (
        <span title="Enable Notifications">
          <BellRing
            onClick={() => setPushNotificationsEnabled(true)}
            className="cursor-pointer"
          />
        </span>
      )}
    </div>
  );
}
