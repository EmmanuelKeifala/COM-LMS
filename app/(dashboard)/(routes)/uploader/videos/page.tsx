import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { LineChart, Film, Star, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getVideoAnalytics } from '@/actions/get-video-analytics';
import YoutubePlayerComponent from '@/components/YoutubePlayerComponent';
import UrlForm from './_components/UrlForm';

const VideoAnalytics = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }

  const { totalVideos, ratedVideosNotReviewed } = await getVideoAnalytics(userId);

  const videoGroups = ratedVideosNotReviewed?.reduce((acc: any, ratedVideo: any) => {
    const videoId = ratedVideo.video.id;
    if (!acc[videoId]) {
      acc[videoId] = { videos: [], totalRating: 0 };
    }
    acc[videoId].videos.push(ratedVideo);
    acc[videoId].totalRating += ratedVideo?.value || 0;
    return acc;
  }, {});

  const videoArray = Object.entries(videoGroups || {}).map(([_, group]: [string, any]) => ({
    ...group.videos[0].video,
    rating: group.totalRating / group.videos.length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Video Analytics Dashboard
          </h1>
          <p className="text-gray-500">
            Track and manage your video ratings and performance metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Film className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalVideos}</div>
              <p className="text-xs text-gray-500 mt-1">
                Videos awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-500">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {(videoArray.reduce((acc, vid) => acc + vid.rating, 0) / videoArray.length || 0).toFixed(1)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Across all videos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Video Player Section */}
        <Card className="bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Video Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <YoutubePlayerComponent youtubeUrls={videoArray} />
          </CardContent>
        </Card>

        {/* Video Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Video Reviews
          </h2>
          <div className="grid gap-6">
            {videoArray.map((video: any) => (
              <Card key={video.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <UrlForm
                    initialData={video}
                    videoId={video.id}
                    rating={video.rating}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalytics;