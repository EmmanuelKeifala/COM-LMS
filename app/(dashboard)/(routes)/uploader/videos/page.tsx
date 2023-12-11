import {auth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';

import {DataCard} from '../analytics/_components/data-card';
import {getVideoAnalytics} from '@/actions/get-video-analytics';
import YoutubePlayerComponent from '@/components/YoutubePlayerComponent';
import UrlForm from './_components/UrlForm';

const VideoAnalytics = async () => {
  const {userId} = auth();

  if (!userId) {
    return redirect('/');
  }

  const {totalVideos, ratedVideos} = await getVideoAnalytics(userId);
  const videoArray: any = [];
  ratedVideos.map(ratedVideo => {
    videoArray.push(ratedVideo.video);
  });
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total videos rated" value={totalVideos} />
      </div>
      <YoutubePlayerComponent youtubeUrls={videoArray} />
      {videoArray.map((video: any, index: number) => (
        <UrlForm
          initialData={video}
          key={video.id}
          videoId={video.id}
          rating={ratedVideos[index]?.value}
        />
      ))}
      {/* <Chart data={data} /> */}
    </div>
  );
};

export default VideoAnalytics;
