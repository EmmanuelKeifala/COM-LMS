'use client';
import {
  Call,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
  CallControls,
} from '@stream-io/video-react-sdk';
import {Loader2} from 'lucide-react';
import {useState} from 'react';

interface MeetingPageProps {
  id: string;
}
export default function MeetingPage({id}: MeetingPageProps) {
  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();

  if (!client) {
    return (
      <>
        <Loader2 className="mt-10 mx-auto animate-spin" />
      </>
    );
  }
  if (!call) {
    return (
      <button
        onClick={async () => {
          const call = client.call('default', id);
          await call.join();
          setCall(call);
        }}>
        Join Meeting
      </button>
    );
  }
  return (
    <StreamCall call={call}>
      <StreamTheme className="space-y-7 mt-10 ">
        <SpeakerLayout />
        <CallControls />
      </StreamTheme>
    </StreamCall>
  );
}
