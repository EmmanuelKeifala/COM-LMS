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

  const videoGroups: {[videoId: string]: {videos: any[]; totalRating: number}} =
    {};

  ratedVideos.forEach(ratedVideo => {
    const videoId = ratedVideo.video.id;

    if (videoGroups[videoId]) {
      videoGroups[videoId].videos.push(ratedVideo);
      videoGroups[videoId].totalRating += ratedVideo?.value!;
    } else {
      videoGroups[videoId] = {
        videos: [ratedVideo],
        totalRating: ratedVideo?.value!,
      };
    }
  });
  const videoArray: any[] = [];

  Object.values(videoGroups).forEach(videoGroup => {
    const averageRating = videoGroup.totalRating / videoGroup.videos.length;
    const firstVideo = videoGroup.videos[0].video;
    videoArray.push({
      ...firstVideo,
      rating: averageRating,
    });
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
          rating={video.rating}
        />
      ))}
    </div>
  );
};

export default VideoAnalytics;
