import React from 'react';
import ClientProvider from '@/providers/ClientProvider';
import CreateMeetingPage from './_components/CreateMeetingPage';

type Props = {};

const VideoStreamingPage = (props: Props) => {
  return (
    <ClientProvider>
      <>
        <div>
          <CreateMeetingPage />
        </div>
      </>
    </ClientProvider>
  );
};

export default VideoStreamingPage;
