import {NavbarRoutes} from '@/components/NavbarRoutes';
import {Course, Chapter, UserProgress} from '@prisma/client';
import {CourseMobileSidebar} from './CourseMobileSidebar';

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar: React.FC<CourseNavbarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
