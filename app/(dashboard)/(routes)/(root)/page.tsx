'use client';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';

// Lazy load components
const CoursesList = dynamic(() => import('@/components/courses-list'));
const InfoCard = dynamic(() => import('./_components/info-card'));
const ChatButton = dynamic(() => import('@/components/ChatButton'));

import { registerServiceWorker } from '@/lib/utils';
import { getCurrentPushSubscription, sendPushSubscriptionToServer } from '@/actions/push-service';

export default function Dashboard() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [coursesInProgress, setCoursesInProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!userId) {
      router.push('/');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://lms-com-server.onrender.com/api/v1/getDashboardCourses', { userId });
      setCompletedCourses(response.data.completedCourses);
      setCoursesInProgress(response.data.coursesInProgress);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Optionally add error state handling here if needed
    } finally {
      setLoading(false);
    }
  }, [userId, router]); // Added router to dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        await registerServiceWorker();
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    setupPushNotifications();
  }, []);

  const memoizedCoursesList = useMemo(() => (
    <CoursesList items={[...coursesInProgress, ...completedCourses]} />
  ), [coursesInProgress, completedCourses]);

  if (!userId) {
    return null; // Or a loading state if preferred
  }

  return (
    <div className="p-6 space-y-4">
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
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
      )}
      {!loading && (
        <>
          {memoizedCoursesList}
          <ChatButton isChat={false} />
        </>
      )}
    </div>
  );
}