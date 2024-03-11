'use client';
import {useUser} from '@clerk/nextjs';
import {Call, useStreamVideoClient} from '@stream-io/video-react-sdk';
import {Loader2} from 'lucide-react';
import React, {useState} from 'react';
import toast from 'react-hot-toast';

type Props = {};

const CreateMeetingPage = (props: Props) => {
  const [descriptionInput, setDescriptionInput] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const {user} = useUser();
  const [participantInput, setParticipantInput] = useState('');
  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();
  if (!user || !client) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  async function createMeeting() {
    if (!client || !user) {
      return;
    }
    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      await call.getOrCreate({
        data: {
          custom: {description: descriptionInput},
        },
      });
      setCall(call);
    } catch (error) {
      console.log('[VIDEO ERROR]', error);
      toast.error('Something went wrong');
    }
  }
  return (
    <div className="flex flex-col mt-10 items-center space-y-6">
      <div className="w-90 mx-auto space-y-6 rounded-md bg-slate-100 p-5">
        <h2 className="text-xl font-bold text-center">Create a new meeting</h2>
        <DescriptionInput
          value={descriptionInput}
          onChange={setDescriptionInput}
        />
        <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
        <ParticipantsInput
          value={participantInput}
          onChange={setParticipantInput}
        />

        <button onClick={createMeeting} className="w-full">
          Create Meeting
        </button>
      </div>
      {call && <MeetingLink call={call} />}
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
            className="w-full rounded-md border-gray-300 p-2 resize-none"
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

  console.log(dateTimeLocalNow);
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
            className="w-full rounded-md border-gray-300 p-2"
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
            className="w-full rounded-md border border-gray-300 p-2 resize-none"
            placeholder="Enter emails separated by commas"
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
  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}meeting/${call.id}`;
  return <div className="text-center">{meetingLink}</div>;
}
