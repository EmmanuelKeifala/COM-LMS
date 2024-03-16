import useStreamCall from '@/hooks/use-stream-call';
import {
  CallControls,
  PaginatedGridLayout,
  SpeakerLayout,
} from '@stream-io/video-react-sdk';
import {useState} from 'react';
import {GripVertical, GripHorizontal, LayoutGrid} from 'lucide-react';
import EndCallButton from '../../../_components/EndCallButton';
import {useRouter} from 'next/navigation';
type CallLayout = 'speaker-vert' | 'speaker-horiz' | 'grid';

export default function FlexibleCallLayout() {
  const [layout, setLayout] = useState<CallLayout>('speaker-vert');
  const router = useRouter();
  const call = useStreamCall();
  return (
    <div className="space-y-3 flex flex-col justify-center items-center">
      <CallLayoutButtons layout={layout} setLayout={setLayout} />
      <CallLayoutView layout={layout} />
      <CallControls
        onLeave={() =>
          router.push(`/videoStreaming/meets/meeting/${call.id}/left`)
        }
      />
      <EndCallButton />
    </div>
  );
}

interface CallLayoutViewProps {
  layout: CallLayout;
}
function CallLayoutView({layout}: CallLayoutViewProps) {
  if (layout === 'speaker-vert') {
    return <SpeakerLayout />;
  }
  if (layout === 'speaker-horiz') {
    return <SpeakerLayout participantsBarPosition="right" />;
  }
  if (layout === 'grid') {
    return <PaginatedGridLayout />;
  }
  return null;
}

interface CallLayoutButtonsProps {
  layout: CallLayout;
  setLayout: (layout: CallLayout) => void;
}

function CallLayoutButtons({layout, setLayout}: CallLayoutButtonsProps) {
  return (
    <div className="mx-auto w-fit space-x-6">
      <button onClick={() => setLayout('speaker-vert')}>
        <GripVertical
          className={layout !== 'speaker-vert' ? 'text-gray-400' : ''}
        />
      </button>
      <button onClick={() => setLayout('speaker-horiz')}>
        <GripHorizontal
          className={layout !== 'speaker-horiz' ? 'text-gray-400' : ''}
        />
      </button>
      <button onClick={() => setLayout('grid')}>
        <LayoutGrid className={layout !== 'grid' ? 'text-gray-400' : ''} />
      </button>
    </div>
  );
}
