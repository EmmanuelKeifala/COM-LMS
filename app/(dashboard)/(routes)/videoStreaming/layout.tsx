import ClientProvider from '@/providers/ClientProvider';
import React from 'react';

const VideoStreamingLayout = ({children}: {children: React.ReactNode}) => {
  return <ClientProvider>{children}</ClientProvider>;
};

export default VideoStreamingLayout;

//436e4f47-16ef-40c5-90ad-576d6a205397
