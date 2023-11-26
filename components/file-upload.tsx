// 'use client';
import toast from 'react-hot-toast';
import {UploadDropzone} from '@/lib/uploadthing';
import {ourFileRouter} from '@/app/api/uploadthing/core';

interface FileUploadProps {
  onChange: (data?: any) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({onChange, endpoint}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        console.log('UPLOAD COMPLETE', res?.[0]);
        onChange(res?.[0]);
      }}
      onUploadError={(error: Error) => {
        toast.error(`UPLOAD ERROR ${error?.message}`);
      }}
    />
  );
};
