import {isUploader} from '@/lib/uploader';
import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';

const UploaderLayout = ({children}: {children: React.ReactNode}) => {
  const {userId} = auth();

  if (!isUploader(userId)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default UploaderLayout;
