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
  VideoPreview,
  DeviceSettings,
  CallingState,
} from '@stream-io/video-react-sdk';
import {Loader2} from 'lucide-react';
import {useState, useEffect} from 'react';
import PermissionPrompts from './_components/PermissionPrompts';
import Button from '../../_components/Button';
import AudioVolumeIndicator from './_components/AudioVolumeIndicator';
import FlexibleCallLayout from './_components/FlexibleCallLayout';

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
  const call = useStreamCall();
  const {useCallEndedAt, useCallStartsAt} = useCallStateHooks();
  const [setupComplete, setSetupComplete] = useState(false);

  async function handleSetupComplete() {
    call.join();
    setSetupComplete(true);
  }
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

  const description = call.state.custom.description;

  return (
    <div className="space-y-6">
      {description && (
        <p className="text-center">
          Meeting descritpion: <span className="font-bold">{description}</span>
        </p>
      )}
      {setupComplete ? (
        <CallUI />
      ) : (
        // <SpeakerLayout />
        <SetupUI onSetupComplete={handleSetupComplete} />
      )}
    </div>
  );
}
interface SetupUIProps {
  onSetupComplete: () => void;
}

function SetupUI({onSetupComplete}: SetupUIProps) {
  const call = useStreamCall();

  const {useMicrophoneState, useCameraState} = useCallStateHooks();

  const micState = useMicrophoneState();
  const camState = useCameraState();
  const [micCamDisabled, setMicCamDisabled] = useState(false);

  useEffect(() => {
    if (micCamDisabled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      // call.camera.enable();
      call.microphone.enable();
    }
  }, [micCamDisabled, call]);

  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompts />;
  }
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold ">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center gap-4">
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          checked={micCamDisabled}
          onChange={e => setMicCamDisabled(e.target.checked)}
        />
        Join with mic and camera off
      </label>
      <Button onClick={onSetupComplete}>Join Meeting</Button>
    </div>
  );
}

function CallUI() {
  const {useCallCallingState} = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return <FlexibleCallLayout />;
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
