'use client';

import {
  AreaChart,
  BarChart,
  Compass,
  Layout,
  List,
  Newspaper,
} from 'lucide-react';
import {SidebarItem} from './SidebarItem';
import {usePathname} from 'next/navigation';
import {FcFeedback} from 'react-icons/fc';
import {MdDashboard, MdEmail, MdQuiz} from 'react-icons/md';
import {useAuth} from '@clerk/nextjs';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
  {
    icon: MdQuiz,
    label: 'Quiz',
    href: '/quiz',
  },
  {
    icon: Newspaper,
    label: 'Blog',
    href: '/blog',
  },
];
const uploadRoute = [
  {
    icon: List,
    label: 'Courses',
    href: '/uploader/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/uploader/analytics',
  },
  {
    icon: AreaChart,
    label: 'Video Analytics',
    href: '/uploader/videos',
  },
  {
    icon: FcFeedback,
    label: 'Feedbacks',
    href: '/uploader/feedback',
  },
  {
    icon: MdEmail,
    label: 'Emails',
    href: '/uploader/email',
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isUploaderRoute = pathname?.includes('/uploader');
  const {userId} = useAuth();

  // Define the user IDs who can access the /blog route
  const allowedUserIds = [
    'user_2baYYZEdPno56qBM7z2RDMiC9hM',
    'user_2YZm7lOYkOlWQqcmPn1HMaYTWfI',
  ];

  // Check if the current user is allowed to access the /blog route
  const isAllowedUser = allowedUserIds.includes(userId!!);

  const guestRoutesFiltered = guestRoutes.filter(
    route => route.href !== '/blog',
  );

  const routes = isUploaderRoute ? uploadRoute : guestRoutesFiltered;

  // If the user is allowed, add the /blog route to the routes
  if (isAllowedUser) {
    routes.push({
      icon: Newspaper,
      label: 'Blog',
      href: '/blog',
    });
  }

  const filteredRoutes = isAllowedUser
    ? routes
    : routes.filter(route => route.href !== '/quiz');

  return (
    <div className="flex flex-col w-full">
      {filteredRoutes.map((route: any) => (
        <SidebarItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
        />
      ))}
    </div>
  );
};
