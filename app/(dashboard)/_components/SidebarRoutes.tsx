'use client';
import {
  AreaChart,
  BarChart,
  Compass,
  Layout,
  LibraryBigIcon,
  List,
  Newspaper,
} from 'lucide-react';
import {SidebarItem} from './SidebarItem';
import {usePathname} from 'next/navigation';
import {FcFeedback} from 'react-icons/fc';
import {MdEmail, MdQuiz} from 'react-icons/md';
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
  {
    icon: LibraryBigIcon,
    label: 'Library',
    href: '/library',
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

  const allowedUserIds = [
    process.env.ALLOWED_USER_1,
    process.env.ALLOWED_USER_2,
    process.env.ALLOWED_USER_3
  ];

  const isUserAllowed = allowedUserIds.includes(userId!!);

  const routes = isUploaderRoute ? uploadRoute : guestRoutes;

  const filteredRoutes = isUserAllowed
    ? routes
    : routes.filter(
        route => route.href !== '/library' && route.href !== '/blog',
      );
  return (
    <div className="flex flex-col w-full">
      {filteredRoutes.map(route => (
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
