'use client';
import Rating from '@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/rating';
import {cn} from '@/lib/utils';
import React, {useEffect, useState} from 'react';

interface YoutubePlayerProps {
  youtubeUrls: any[];
  chapterId?: string;
  courseId?: string;
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = ({
  youtubeUrls,
  chapterId,
  courseId,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');

  useEffect(() => {
    if (youtubeUrls.length > 0) {
      setCurrentVideoId(youtubeUrls[0].id);
    }
  }, [youtubeUrls]);

  const handleVideoChange = (index: number, videoId: string) => {
    setCurrentVideoId(videoId);
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
          <div className="bg-slate-100 w-full m-4 flex flex-row-reverse justify-between gap-x-2 ml-[-5px] border p-3 items-center rounded-lg">
            <div className="flex gap-x-2 flex-wrap">
              {youtubeUrls.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleVideoChange(index, video.id)}
                  className={cn(
                    'p-2 bg-gray-800 text-white mt-2 rounded hover:bg-slate-700',
                    currentVideoIndex === index && 'bg-slate-600',
                  )}>
                  {index + 1}
                </button>
              ))}
            </div>
            <Rating
              chapterId={chapterId}
              courseId={courseId}
              videoId={currentVideoId}
            />
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
