import { Skeleton } from "antd";

export const CourseMobileSidebarSkeleton: React.FC = () => {
  return (
    <div className="flex items-center">
      <Skeleton className="h-10 w-10 rounded-md" />
    </div>
  );
};