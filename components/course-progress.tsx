import {Progress} from '@/components/ui/progress';
import {cn} from '@/lib/utils';

interface CourseProgressProps {
  value: number;
  size?: 'default' | 'sm';
}

const sizeByVariant = {
  default: 'text-sm',
  sm: 'text-xs',
};

export const CourseProgress = ({value, size}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} />
      <p
        className={cn(
          'font-medium mt-2 text-sky-700',
          sizeByVariant[size || 'default'],
        )}>
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
