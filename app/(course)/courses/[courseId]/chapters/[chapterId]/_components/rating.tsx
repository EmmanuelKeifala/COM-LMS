'use client';
import React, {useEffect, useState} from 'react';
import {Rate} from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {useAuth} from '@clerk/nextjs';

interface RatingProps {
  chapterId?: string;
  courseId?: string;
  videoId?: string;
}

const Rating = ({chapterId, courseId, videoId}: RatingProps) => {
  const router = useRouter();
  const [rating, setRating] = useState<number | 0>(0);
  const {userId} = useAuth();

  useEffect(() => {
    const fetchVideoRating = async () => {
      try {
        const response = await fetch(
          `/api/courses/${courseId}/chapters/${chapterId}/videoRating`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch video rating');
        }

        const videoRatings = await response.json();
        const filteredRatings = videoRatings.filter(
          (rating: {videoId: string}) => rating.videoId === videoId,
        );

        const averageRating =
          filteredRatings.length === 0
            ? 0
            : filteredRatings.reduce(
                (sum: any, rating: {value: any}) =>
                  (sum + rating.value) / filteredRatings.length,
                0,
              );
        setRating(averageRating);
      } catch (error) {
        console.error('Error fetching video rating:', error);
      }
    };

    fetchVideoRating();
  }, [chapterId, courseId, videoId]);

  const handleChange = async (value: number) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/videoRating`,
        {value, videoId, userId},
      );

      toast.success('Video rated');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="">
      <Rate
        count={5}
        value={Math.round(rating)}
        allowClear={false}
        allowHalf
        onChange={value => handleChange(value)}
      />
      <p className="font-medium text-sm">
        {!rating ? 'no rattings yet' : `Video rating ${Math.round(rating)}/5`}
      </p>
    </div>
  );
};

export default Rating;
