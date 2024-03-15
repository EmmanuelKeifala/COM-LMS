'use client';
import useLoadCall from '@/hooks/use-load-call';
import useStreamCall from '@/hooks/use-stream-call';
import {useUser} from '@clerk/nextjs';
import {
  Call,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
  CallControls,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import {Loader2} from 'lucide-react';
import {useState} from 'react';

interface MeetingPageProps {
  id: string;
}
export default function MeetingPage({id}: MeetingPageProps) {
  const {user, isLoaded: userLoaded} = useUser();
  const {call, callLoading} = useLoadCall(id);

  if (!userLoaded || callLoading) {
    return (
      <>
        <Loader2 className="mt-10 mx-auto animate-spin" />
      </>
    );
  }
  if (!call) {
    return <p className="text-center font-bold">Call not found</p>;
  }

  const notAllowedToJoin =
    call.type === 'private-meeting' &&
    (!user || !call.state.members.find(m => m.user.id === user.id));

  if (notAllowedToJoin) {
    return <p className="text-center font-bold">You are not allowed to Join</p>;
  }

  return (
    <StreamCall call={call}>
      <StreamTheme className="space-y-7 mt-10 ">
        <MeetingScreen />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen() {
  const {useCallEndedAt, useCallStartsAt} = useCallStateHooks();

  const callEndedAt = useCallEndedAt();
  const callStartsAt = useCallStartsAt();

  const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date();

  const callHasEnded = !!callEndedAt;

  if (callHasEnded) {
    return <MeetingEndedScreen />;
  }
  if (callIsInFuture) {
    return <UpcomingMeetingsScreen />;
  }

  return <div>Call UI</div>;
}

function UpcomingMeetingsScreen() {
  const call = useStreamCall();

  return (
    <div className="flex flex-col items-center gap-6">
      <p>
        This meeting has not started yet. It will start at{''}
        <span className="font-bold">
          {call.state.startsAt?.toLocaleString()}
        </span>
      </p>

      {call.state.custom.description && (
        <p>
          Description: {''}
          <span className="font-bold">{call.state.custom.description}</span>
        </p>
      )}
    </div>
  );
}
function MeetingEndedScreen() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-bold">This meeting has ended</p>
    </div>
  );
}
