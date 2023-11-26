import React from 'react';

interface YoutubePlayerProps {
  youtubeUrl: string | null;
}

const YoutubePlayerComponent: React.FC<YoutubePlayerProps> = ({youtubeUrl}) => {
  if (!youtubeUrl) {
    // Render some fallback content or an empty state
    return <p>No video URL available</p>;
  }

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
