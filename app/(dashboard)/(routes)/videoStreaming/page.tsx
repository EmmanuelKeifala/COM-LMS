import React from 'react';
import Navbar from './_components/Navbar';
import ClientProvider from '@/providers/ClientProvider';

type Props = {};

const VideoStreamingPage = (props: Props) => {
  return (
    <ClientProvider>
      <div>
        <Navbar />
      </div>
    </ClientProvider>
  );
};

export default VideoStreamingPage;
