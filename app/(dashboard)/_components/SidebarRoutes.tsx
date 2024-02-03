'use client';

import {AreaChart, BarChart, Compass, Layout, List} from 'lucide-react';
import {SidebarItem} from './SidebarItem';
import {usePathname} from 'next/navigation';
import {FcFeedback} from 'react-icons/fc';
import {MdEmail} from 'react-icons/md';


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

  const routes = isUploaderRoute ? uploadRoute : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map(route => (
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
