'use client';

import axios from 'axios';
import {useState} from 'react';
import toast from 'react-hot-toast';

import {Button, Popconfirm} from 'antd';
interface CourseUnEnrollButtonProps {
  courseId: string;
  courseName?: string;
}

export const CourseUnEnrollButton = ({
  courseId,
  courseName,
}: CourseUnEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/unenroll`);

      window.location.assign(response.data.url);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if the screen size is small
  const isSmallScreen = window.innerWidth < 768;
  console.log('SMALL SCREEN', isSmallScreen);

  if (!isSmallScreen) {
    return (
      <Popconfirm
        title="Unenroll from this course"
        description={`This action will unenroll you from the ${courseName} course`}
        onConfirm={onClick}
        okType="danger">
        <Button danger>UnEnroll</Button>
      </Popconfirm>
    );
  } else {
    return (
      <Button danger onClick={onClick}>
        UnEnroll
      </Button>
    );
  }
};
