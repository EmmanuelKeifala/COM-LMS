'use client';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import Rating from '@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/rating';
import { Skeleton } from 'antd';

interface YoutubeVideo {
  id: string;
  videoUrl: string;
}

interface YoutubePlayerProps {
  youtubeUrls: YoutubeVideo[];
  chapterId?: string;
  courseId?: string;
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = memo(
  ({ youtubeUrls, chapterId, courseId }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentVideoId, setCurrentVideoId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Set the initial video ID when the component mounts or youtubeUrls changes
    useEffect(() => {
      if (youtubeUrls.length > 0) {
        setCurrentVideoId(youtubeUrls[0].id);
      }
    }, [youtubeUrls]);

    // Handle video change
    const handleVideoChange = useCallback((index: number, videoId: string) => {
      setIsLoading(true);
      setCurrentVideoId(videoId);
      setCurrentVideoIndex(index);
    }, []);

    // Handle iframe load event
    const handleIframeLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    // Render the video player
    const renderVideoPlayer = () => {
      if (youtubeUrls.length === 0) {
        return (
          <div className="flex items-center justify-center text-3xl font-medium border rounded-md border-slate-200 p-3 shadow-sm">
            No video link
          </div>
        );
      }

      return (
        <div className="w-full aspect-video mt-2 dark:bg-black">
          <div className="relative w-full h-full">
            {/* Loading skeleton */}
            {isLoading && (
              <div className="absolute inset-0 z-10">
                <Skeleton.Input active block className="w-full h-full" />
              </div>
            )}

            {/* YouTube iframe */}
            <iframe
              id="youtubePlayer"
              src={`${youtubeUrls[currentVideoIndex].videoUrl}?rel=0`}
              className={cn(
                'absolute inset-0 w-full h-full bg-slate-200 rounded-md'
              )}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              onLoad={handleIframeLoad}
              aria-label={`YouTube video player for video ${currentVideoIndex + 1}`}
            />
          </div>

          {/* Video controls and rating */}
          <div className="bg-slate-100 dark:bg-gray-500 w-full m-4 flex flex-row-reverse justify-between gap-x-2 ml-[-5px] border p-3 items-center rounded-lg">
            {/* Video navigation buttons */}
            <div className="flex gap-x-2 flex-wrap">
              {youtubeUrls.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoChange(index, video.id)}
                  className={cn(
                    'p-2 bg-gray-800 text-white mt-2 rounded hover:bg-slate-700 transition-colors',
                    currentVideoIndex === index && 'bg-slate-600'
                  )}
                  aria-label={`Switch to video ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Rating component */}
            <Rating
              chapterId={chapterId}
              courseId={courseId}
              videoId={currentVideoId}
            />
          </div>
        </div>
      );
    };

    return <>{renderVideoPlayer()}</>;
  }
);
YoutubePlayerComponent.displayName = "YoutubePlayerComponent"
export default YoutubePlayerComponent;