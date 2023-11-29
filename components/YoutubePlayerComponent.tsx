'use client';
import React, {useState, useEffect} from 'react';

interface YoutubePlayerProps {
  youtubeUrls: any[];
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = ({
  youtubeUrls,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(true);

  const handleNextVideo = () => {
    setCurrentVideoIndex(prevIndex => (prevIndex + 1) % youtubeUrls.length);
    resetHideTimer();
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : youtubeUrls.length - 1,
    );
    resetHideTimer();
  };

  const hideButtons = () => {
    setShowButtons(false);
  };

  const showButtonsOnHover = () => {
    setShowButtons(true);
    resetHideTimer();
  };

  const resetHideTimer = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideButtons, 3000);
  };

  let hideTimer: NodeJS.Timeout;

  useEffect(() => {
    // Initial setup for the hide timer
    resetHideTimer();

    // Clear the timer when the component is unmounted
    return () => clearTimeout(hideTimer);
  }, []);

  return (
    <>
      {youtubeUrls.length > 0 ? (
        <div
          className="relative aspect-video mt-2"
          onMouseEnter={showButtonsOnHover}
          onMouseLeave={hideButtons}>
          <iframe
            id="youtubePlayer"
            src={`${youtubeUrls[currentVideoIndex].videoUrl}?rel=0`}
            className="flex items-center justify-center h-full w-full bg-slate-200 rounded-md"
            allow="autoplay"
            allowFullScreen
            loading="lazy"></iframe>
          {showButtons && (
            <div className="absolute top-0 right-0 m-4 flex items-center  gap-x-2">
              {currentVideoIndex > 0 && (
                <button
                  onClick={handlePreviousVideo}
                  className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 focus:outline-none">
                  Back
                </button>
              )}
              {currentVideoIndex < youtubeUrls.length - 1 && (
                <button
                  onClick={handleNextVideo}
                  className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 focus:outline-none">
                  Next
                </button>
              )}
            </div>
          )}
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
