'use client';
import {useAuth} from '@clerk/nextjs';
import {redirect} from 'next/navigation';
import {CheckCircle, Clock} from 'lucide-react';
import {useState, useEffect} from 'react';
import axios from 'axios';

import {CoursesList} from '@/components/courses-list';
import {InfoCard} from './_components/info-card';
import ChatButton from '@/components/ChatButton';
import {registerServiceWorker} from '@/lib/utils';
import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from '@/actions/push-service';
import {Spin} from 'antd';

export const revalidate = 3600; // revalidate at most every hour

export default function Dashboard() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [coursesInProgress, setCoursesInProgress] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {userId} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!userId) {
          redirect('/');
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error('Error setting up service worker:', error);
      }
    }
    setUpServiceWorker();
  }, []);

  useEffect(() => {
    async function syncPushNotification() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.log(error);
      }
    }
    syncPushNotification();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <>
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
          </>
        </div>
      )}
      {!loading && (
        <>
          <CoursesList items={[...coursesInProgress, ...completedCourses]} />

          <ChatButton isChat={false} />
        </>
      )}
    </div>
  );
}
