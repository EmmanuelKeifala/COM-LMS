'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

// Dynamically import icons to reduce initial bundle size
const Layout = dynamic(() => import('lucide-react').then(mod => mod.Layout));
const Compass = dynamic(() => import('lucide-react').then(mod => mod.Compass));
const Newspaper = dynamic(() => import('lucide-react').then(mod => mod.Newspaper));
const LibraryBigIcon = dynamic(() => import('lucide-react').then(mod => mod.LibraryBigIcon));
const List = dynamic(() => import('lucide-react').then(mod => mod.List));
const BarChart = dynamic(() => import('lucide-react').then(mod => mod.BarChart));
const AreaChart = dynamic(() => import('lucide-react').then(mod => mod.AreaChart));
const MdQuiz = dynamic(() => import('react-icons/md').then(mod => mod.MdQuiz));
const FcFeedback = dynamic(() => import('react-icons/fc').then(mod => mod.FcFeedback));
const MdEmail = dynamic(() => import('react-icons/md').then(mod => mod.MdEmail));

// Dynamically import SidebarItem to reduce initial bundle size
const SidebarItem = dynamic(() => import('./SidebarItem'));

// Define guest and upload routes as constants outside the component
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
  const { userId } = useAuth();

  // Check if the current route is an uploader route
  const isUploaderRoute = pathname?.includes('/uploader');

  // Define allowed user IDs
  const allowedUserIds = [
    process.env.NEXT_PUBLIC_ALLOWED_USER_1,
    process.env.NEXT_PUBLIC_ALLOWED_USER_2,
    process.env.NEXT_PUBLIC_ALLOWED_USER_3,
  ];

  // Check if the current user is allowed
  const isUserAllowed = allowedUserIds.includes(userId || '');

  // Determine which routes to display based on the current route and user permissions
  const routes = isUploaderRoute ? uploadRoute : guestRoutes;
  const filteredRoutes = isUserAllowed
    ? routes
    : routes.filter(route => route.href !== '/library' && route.href !== '/blog');

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