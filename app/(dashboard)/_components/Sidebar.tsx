import {Logo} from './Logo';
import {SidebarRoutes} from './SidebarRoutes';

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark:bg-black dark:text-white">
      <div className="p-6 w-full flex items-center justify-center">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
