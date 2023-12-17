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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleChange = async (value: number) => {
    try {
      // Send rating to the server
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/videoRating`,
        {value, videoId, userId},
      );

      // Update the local state immediately
      const newRating = await getUpdatedRating();
      setRating(newRating);

      toast.success('Video rated');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const getUpdatedRating = async () => {
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
        throw new Error('Failed to fetch updated video rating');
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

      return averageRating;
    } catch (error) {
      console.error('Error fetching updated video rating:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchVideoRating();
  }, [chapterId, courseId, fetchVideoRating, videoId]);

  return (
    <div className="">
      <Rate
        count={5}
        value={rating}
        allowClear={false}
        allowHalf
        onChange={value => handleChange(value)}
      />
      <p className="font-medium text-sm">
        {!rating ? 'no ratings yet' : `Video rating ${rating}/5`}
      </p>
    </div>
  );
};

export default Rating;
