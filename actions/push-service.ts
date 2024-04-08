import {getReadyServiceWorker} from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker();
  return sw.pushManager.getSubscription();
}

export async function registerPushNotifications() {
  if (!('PushManager' in window)) {
    throw new Error('Service workers are not supported in this browser.');
  }

  const existingSubscription = await getCurrentPushSubscription();
  if (existingSubscription) {
    throw new Error('Exisiting push notification found');
  }
  const sw = await getReadyServiceWorker();
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_PUSH_SERVER_KEY,
  });

  await sendPushSubscriptionToServer(subscription);
}

export async function unRegisterPushNotification() {
  const existingSubscription = await getCurrentPushSubscription();
  if (!existingSubscription) {
    throw new Error('No push notification found');
  }
  await deletePushNotificationFromServer(existingSubscription);
  await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription | null,
) {
  try {
    await axios.post('/api/notifications/register', {
      subscription,
    });
    toast.success('Push subscription sent to server');
  } catch (error) {
    toast.error('Error sending push subscription to server');
  }
}

export async function deletePushNotificationFromServer(
  subscription: PushSubscription,
) {
  try {
    await axios.delete('/api/notifications/register', {
      data: subscription,
    });
    toast.success('Push subscription deleted');
  } catch (error) {
    console.error('Error sending push subscription to server: ', error);
    toast.error('Error sending push subscription to server');
  }
}
