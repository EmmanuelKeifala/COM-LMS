import useStreamCall from '@/hooks/use-stream-call';
import {useCallStateHooks} from '@stream-io/video-react-sdk';

export default function EndCallButton() {
  const call = useStreamCall();
  const {useLocalParticipant} = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const participantIsChannelOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!participantIsChannelOwner) {
    return null;
  }

  return (
    <button
      onClick={call.endCall}
      className="mx-auto font-medium text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500">
      End Call for Everyone
    </button>
  );
}
