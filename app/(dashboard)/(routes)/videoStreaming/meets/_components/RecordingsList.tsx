import useLoadRecordings from '@/hooks/use-load-recordings';
import useStreamCall from '@/hooks/use-stream-call';
import {useUser} from '@clerk/nextjs';
import {Loader2} from 'lucide-react';
import Link from 'next/link';

export default function RecordingList() {
  const call = useStreamCall();
  const {recordings, recordingsLoading} = useLoadRecordings(call);
  const {user, isLoaded: userLoaded} = useUser();

  if (userLoaded && !user) {
    return (
      <p className="text-center text-red-600">
        You must be logged in to view recordings.
      </p>
    );
  }

  if (recordingsLoading) return <Loader2 className="mx-auto animate-spin" />;

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Recording List</h2>

      {recordings.length === 0 && (
        <p className="text-center text-gray-600">
          No recordings found for this meeting.
        </p>
      )}

      <ul className="list-inside list-disc text-center">
        {recordings
          .sort((a, b) => b.end_time.localeCompare(a.end_time))
          .map(recording => (
            <li key={recording.url} className="mt-2">
              <Link
                href={recording.url}
                target="_blank"
                className="text-blue-600 hover:underline">
                {new Date(recording.end_time).toLocaleString()}
              </Link>
            </li>
          ))}
      </ul>

      <p className="mt-4 text-sm text-gray-500">
        Note: It may take up to a minute for new recordings to appear. You can
        also refresh the page.
      </p>
    </div>
  );
}
