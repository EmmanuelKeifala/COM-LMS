'use client';
import {useUser} from '@clerk/nextjs';
import {Call, useStreamVideoClient} from '@stream-io/video-react-sdk';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';

const MyMeetingsPage = () => {
  const {user} = useUser();
  const client = useStreamVideoClient();

  const [calls, setCalls] = useState<Call[]>();

  useEffect(() => {
    async function loadCalls() {
      if (!client || !user?.id) {
        return;
      }

      const {calls} = await client.queryCalls({
        sort: [{field: 'starts_at', direction: -1}],
        filter_conditions: {
          starts_at: {$exists: true},
          $or: [
            {
              created_by_user_id: user.id,
            },
            {members: {$in: [user.id]}},
          ],
        },
      });
      setCalls(calls);
    }

    loadCalls();
  }, [client, user?.id]);
  return (
    <div className="mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-center text-2xl font-bold mb-4">My Meetings</h1>
      {!calls && <Loader2 className="mx-auto animate-spin" />}
      {calls?.length === 0 && <p className="text-center">No meetings found</p>}

      <ul className="space-y-4">
        {calls?.map(call => <MeetingItem key={call.id} call={call} />)}
      </ul>
    </div>
  );
};

export default MyMeetingsPage;

interface MeetingItemProps {
  call: Call;
}
function MeetingItem({call}: MeetingItemProps) {
  const meetingLink = `/videoStreaming/meetings/${call.id}`;

  const isInFuture =
    call.state.startsAt && new Date(call.state.startsAt) > new Date();

  const hasEnded = !!call.state.endedAt;

  return (
    <li className="flex justify-between items-center border-b pb-2">
      <div>
        <Link href={meetingLink} className="text-blue-600 hover:underline">
          Date and Time:{' '}
          <span className="font-semibold">
            {call.state.startsAt?.toLocaleString()}
            {isInFuture && (
              <span className="ml-2 text-sm text-green-500">(Upcoming)</span>
            )}
          </span>
          {hasEnded && (
            <span className="ml-2 text-sm text-red-500">(Ended)</span>
          )}
        </Link>
        <p className="mt-1 text-gray-500 text-sm">
          Meeting Description:{' '}
          <span className="font-semibold">{call.state.custom.description}</span>
        </p>
      </div>
    </li>
  );
}
