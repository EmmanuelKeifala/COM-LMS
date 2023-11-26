'use client';
import React, {useEffect} from 'react';
import YouTubePlayer from 'youtube-player';

interface YoutubePlayerProps {
  youtubeUrl: string;
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = ({youtubeUrl}) => {
  return (
    <iframe
      src={`${youtubeUrl}`}
      className="flex items-center justify-center h-full w-full bg-slate-200 rounded-md relative aspect-video mt-2"
      allow="autoplay"
      allowFullScreen
      loading="lazy"></iframe>
  );
};

export default YoutubePlayerComponent;
