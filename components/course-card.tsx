import Image from 'next/image';
import Link from 'next/link';
import {BookOpen, Lock} from 'lucide-react';

import {IconBadge} from '@/components/icon-badge';
import {CourseProgress} from '@/components/course-progress';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
  level: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
  level,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="text-xs text-muted-foreground">{category}</p>
            <p className="text-xs text-muted-foreground">{level}</p>
          </div>

          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
              </span>
            </div>
          </div>
          {progress! >= 0 ? (
            <CourseProgress size="sm" value={progress!} />
          ) : (
            <div className="w-full flex flex-row justify-between ">
              <p className="text-sm text-muted-foreground">
                Not enrolled in this course
              </p>
              <Lock size={15} className="font-bold" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard
