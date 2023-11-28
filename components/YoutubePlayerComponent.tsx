'use client';
import React, {useEffect} from 'react';

interface YoutubePlayerProps {
  youtubeUrl: any;
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = ({youtubeUrl}) => {
  return (
    <>
      {youtubeUrl.includes('https') ? (
        <iframe
          src={`${youtubeUrl}?rel=0`}
          className="flex items-center justify-center h-full w-full bg-slate-200 rounded-md relative aspect-video mt-2"
          allow="autoplay"
          allowFullScreen
          loading="lazy"></iframe>
      ) : (
        <div className="flex items-center justify-center text-3xl font-medium border  rounded-md border-slate-200 p-3 shadow-sm">
          No video link
        </div>
      )}
    </>
  );
};

export default YoutubePlayerComponent;
