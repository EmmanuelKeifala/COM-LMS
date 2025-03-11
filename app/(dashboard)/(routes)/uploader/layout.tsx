import {isUploader} from '@/lib/uploader';
import {auth} from '@clerk/nextjs/server';
import {  NextResponse } from "next/server";
const UploaderLayout = async({children}: {children: React.ReactNode}) => {
   const {userId} = await auth();


  if (!isUploader(userId)) {

    return NextResponse.redirect('/');
  }

  return <>{children}</>;
};

export default UploaderLayout;
