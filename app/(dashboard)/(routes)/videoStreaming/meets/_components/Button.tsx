import {cn} from '@/lib/utils';

export default function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'flex items-center justify-center gap-2 rounded-full bg-blue-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-gray-200',
        className,
      )}
    />
  );
}

//"w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
