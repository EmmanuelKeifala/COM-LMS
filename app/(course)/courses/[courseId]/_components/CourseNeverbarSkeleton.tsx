import { Skeleton } from "antd";
import { CourseMobileSidebarSkeleton } from "./CourseMobileSkeleton";

export const CourseNavbarSkeleton: React.FC = () => {
  return (
    <div className="w-full p-4 border-b h-full flex items-center bg-white shadow-sm dark:bg-black dark:text-white">
      {/* Skeleton for CourseMobileSidebar */}
      <CourseMobileSidebarSkeleton />

      {/* Skeleton for NavbarRoutes */}
      <div className="flex items-center gap-x-4 ml-auto">
        <Skeleton className="h-10 w-24 rounded-md" /> {/* Placeholder for a route */}
        <Skeleton className="h-10 w-24 rounded-md" /> {/* Placeholder for another route */}
      </div>
    </div>
  );
};