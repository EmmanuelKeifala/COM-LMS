import {cn} from '@/lib/utils';
import Link from 'next/link';
import {buttonClassname} from '../../../_components/Button';

interface PageProps {
  params: {id: string};
}

export default function Page({params: {id}}: PageProps) {
  <div className="flex flex-col items-center gap-3 mt-30">
    <p className="font-bold">You left the meeting.</p>
    <Link
      href={`/videoStreaming/meets/meeting/${id}`}
      className={cn(buttonClassname, 'bg-gray-500 hover:bg-gray-600')}>
      Rejoin
    </Link>
  </div>;
}
