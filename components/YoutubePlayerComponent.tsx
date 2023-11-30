'use client';
import {cn} from '@/lib/utils';
import React, {useState, useEffect} from 'react';

interface YoutubePlayerProps {
  youtubeUrls: any[];
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = ({
  youtubeUrls,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index);
  };
  return (
    <>
      {youtubeUrls.length > 0 ? (
        <div className="w-full aspect-video mt-2">
          <iframe
            id="youtubePlayer"
            src={`${youtubeUrls[currentVideoIndex].videoUrl}?rel=0`}
            className="flex items-center justify-center h-full w-full bg-slate-200 rounded-md"
            allow="autoplay"
            allowFullScreen
            loading="lazy"></iframe>
          <div className="w-full m-4 flex flex-row justify-end items-end gap-x-2 ml-[-5px]">
            {youtubeUrls.map((video, index) => (
              <button
                key={index}
                onClick={() => handleVideoChange(index)}
                className={cn(
                  'p-2 bg-gray-800 text-white rounded hover:bg-slate-700',
                  currentVideoIndex === index && 'bg-slate-600',
                )}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center text-3xl font-medium border rounded-md border-slate-200 p-3 shadow-sm">
          No video link
        </div>
      )}
    </>
  );
};

export default YoutubePlayerComponent;
