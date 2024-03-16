'use client';
import {getUserIds} from '@/actions/get-token';
import {useUser} from '@clerk/nextjs';
import {
  Call,
  MemberRequest,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import {Copy, Link2Icon, Loader2} from 'lucide-react';
import React, {useState} from 'react';
import toast from 'react-hot-toast';
import Button from './Button';
import Link from 'next/link';

const CreateMeetingPage = () => {
  const [descriptionInput, setDescriptionInput] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const {user} = useUser();
  const [participantInput, setParticipantInput] = useState('');
  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();

  if (!user || !client) {
    return <Loader2 className="fixed inset-0 mx-auto animate-spin" />;
  }

  async function createMeeting() {
    if (!client || !user) {
      return;
    }

    try {
      const id = crypto.randomUUID();
      const callType = participantInput ? 'meyoneducation' : 'default';
      const call = client.call(callType, id);
      const memberEmails = participantInput
        .split(',')
        .map(email => email.trim());
      const memberIds = await getUserIds(memberEmails);

      const members: MemberRequest[] = memberIds
        .map(id => ({
          user_id: id,
          role: 'call_member',
        }))
        .concat({
          user_id: user.id,
          role: 'call_member',
        })
        .filter((v, i, a) => a.findIndex(v2 => v2.user_id === v.user_id) === i);

      const starts_at = new Date(startTimeInput || Date.now()).toISOString();
      await call.getOrCreate({
        data: {
          members,
          custom: {description: descriptionInput},
          starts_at,
        },
      });

      setCall(call);
    } catch (error) {
      console.log('[VIDEO ERROR]', error);
      toast.error('Something went wrong');
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 md:ml-40">
      <div className="w-full md:w-2/4 bg-white rounded-lg shadow-lg p-6 md:mr-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create a New Meeting
        </h2>
        <div className="space-y-4">
          <DescriptionInput
            value={descriptionInput}
            onChange={setDescriptionInput}
          />
          <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
          <ParticipantsInput
            value={participantInput}
            onChange={setParticipantInput}
          />
          <Button onClick={createMeeting} className="w-full">
            Create Meeting
          </Button>
        </div>
        {call && <MeetingLink call={call} />}
      </div>
    </div>
  );
};

export default CreateMeetingPage;

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

function DescriptionInput({value, onChange}: DescriptionInputProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <div className="font-medium">Meeting Info:</div>
      <label htmlFor="description" className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={active}
          onChange={e => {
            setActive(e.target.checked);
            onChange('');
          }}
        />
        Add description
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Description</span>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 p-3 resize-none focus:outline-none focus:border-blue-500"
          />
        </label>
      )}
    </div>
  );
}

interface StartTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

function StartTimeInput({value, onChange}: StartTimeInputProps) {
  const [active, setActive] = useState(false);
  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="flex flex-col space-y-2">
      <div className="font-medium">Meeting Start Time:</div>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange('');
          }}
        />
        Start meeting immediately
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={active}
          onChange={() => {
            setActive(true);
            onChange(dateTimeLocalNow);
          }}
        />
        Start meeting at date/time
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Start time</span>
          <input
            type="datetime-local"
            value={value}
            onChange={e => onChange(e.target.value)}
            min={dateTimeLocalNow}
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
          />
        </label>
      )}
    </div>
  );
}

interface ParticipantsInputProps {
  value: string;
  onChange: (value: string) => void;
}

function ParticipantsInput({value, onChange}: ParticipantsInputProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <div className="font-medium">Participants:</div>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={!active}
          onChange={() => {
            setActive(false);
            onChange('');
          }}
        />
        Anyone with link can join
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" checked={active} onChange={() => setActive(true)} />
        Private meeting
      </label>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Participant Emails</span>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 resize-none focus:outline-none focus:border-blue-500"
            placeholder="Enter emails separated by commas"
            style={{minHeight: '50px'}}
          />
        </label>
      )}
    </div>
  );
}

interface MeetingLinkProps {
  call: Call;
}

function MeetingLink({call}: MeetingLinkProps) {
  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}videoStreaming/meets/meeting/${call.id}`;

  return (
    <div className="text-center flex flex-row items-center gap-3 justify-center mt-5">
      <span className="flex items-center">
        <p className="mr-1">Invitation Link</p>
        <Link2Icon size={26} className="text-gray-600" />
      </span>
      <Link
        href={meetingLink}
        target="_blank"
        className="font-medium text-blue-500 hover:underline">
        {meetingLink}
      </Link>
      <button
        title="Copy invitation link"
        onClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast.success('Copied to clipboard!');
        }}
        className="text-gray-600 hover:text-blue-500 focus:outline-none">
        <Copy size={26} />
      </button>
      <a
        href={getMailToLink(
          meetingLink,
          call.state.startsAt,
          call.state.custom.description,
        )}
        target="_black"
        className="text-blue-500 hover:underline">
        Send email invitation
      </a>
    </div>
  );
}

function getMailToLink(
  meetingLink: string,
  startsAt?: Date,
  description?: string,
) {
  const startDateFormatted = startsAt
    ? startsAt.toLocaleString('en-us', {dateStyle: 'full', timeStyle: 'short'})
    : undefined;

  const subject =
    'Join my meeting' + (startDateFormatted ? ` at ${startDateFormatted}` : '');
  const body =
    `Join my meeting at ${meetingLink}` +
    (startDateFormatted
      ? `\n\nThe meeting starts at ${startDateFormatted}.`
      : '') +
    (description ? `\n\nDescription: ${description}` : '');

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
