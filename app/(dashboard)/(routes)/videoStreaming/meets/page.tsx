import React from 'react';
import CreateMeetingPage from './_components/CreateMeetingPage';

type Props = {};

const VideoStreamingPage = (props: Props) => {
  return (
    <div className="md:pl-56 pt-[80px] h-full dark:bg-black dark:text-white">
      <CreateMeetingPage />
    </div>
  );
};

export default VideoStreamingPage;
