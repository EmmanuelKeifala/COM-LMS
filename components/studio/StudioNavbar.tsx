import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';

const StudioNavbar = (props: any) => {
  return (
    <div>
      <div className="flex items-center justify-between p-5">
        <Link href="/blog" className="text-sky-700 flex items-center">
          <ArrowLeft className="h-6 w-6 text-sky-700 mr-2" />
          Go to the website
        </Link>
      </div>
      <>{props.renderDefault(props)}</>
    </div>
  );
};

export default StudioNavbar;
