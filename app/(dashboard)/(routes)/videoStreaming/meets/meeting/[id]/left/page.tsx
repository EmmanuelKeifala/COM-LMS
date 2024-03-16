import Link from 'next/link';
import {buttonClassname} from '../../../_components/Button';

interface PageProps {
  params: {id: string};
}

export default function Page({params: {id}}: PageProps) {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center md:pl-56 pt-[80px] h-full dark:bg-black dark:text-white">
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold mb-4">You have left the meeting.</p>
        <Link href={`/videoStreaming/meets/meeting/${id}`}>
          <span
            className={`${buttonClassname} bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300`}>
            Rejoin Meeting
          </span>
        </Link>
      </div>
    </div>
  );
}
