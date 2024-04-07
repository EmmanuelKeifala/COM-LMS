'use client';
import {useAuth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';
import {CheckCircle, Clock} from 'lucide-react';
import {useState, useEffect} from 'react';
import axios from 'axios';

import {CoursesList} from '@/components/courses-list';
import {InfoCard} from './_components/info-card';
import ChatButton from '@/components/ChatButton';

export default function Dashboard() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [coursesInProgress, setCoursesInProgress] = useState([]);
  const {userId} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          redirect('/');
          return;
        }

        const response = await axios.post(
          'https://lms-com-server.onrender.com/api/v1/getDashboardCourses',
          {
            userId: userId,
          },
        );

        setCompletedCourses(response.data.completedCourses);
        setCoursesInProgress(response.data.coursesInProgress);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />

      <ChatButton isChat={false} />
    </div>
  );
}
