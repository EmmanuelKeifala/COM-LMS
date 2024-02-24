'use client';
import {useState} from 'react';
import {Button} from './ui/button';
import {MdFeedback} from 'react-icons/md';
import FeedbackModal from './Feedback/modal';
import {BubbleChat} from 'flowise-embed-react';
import {cn} from '@/lib/utils';
import {usePathname} from 'next/navigation';
interface ChatButtonProps {
  isChat: boolean;
}

export default function ChatButton({isChat}: ChatButtonProps) {
  const pathname = usePathname();
  const [chatBoxOpen, setChatBoxOpen] = useState<boolean>(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

  const isDashboard = pathname === '/';
  const toggleChatBox = () => {
    setChatBoxOpen(!chatBoxOpen);
    setFeedbackModalOpen(false);
  };

  const toggleFeedbackModal = () => {
    setFeedbackModalOpen(!feedbackModalOpen);
    setChatBoxOpen(false);
  };

  return (
    <>
      {!isChat && (
        <Button
          onClick={isChat ? toggleChatBox : toggleFeedbackModal}
          className={cn(
            !isChat &&
              'w-[150px] ml-4 rounded-full bg-sky-500 flex items-center hover:bg-sky-400',
          )}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '70px',
          }}>
          {!isChat && <MdFeedback size={30} className="mr-2 text-xl" />}
          {!isChat && 'Feedback'}
        </Button>
      )}
      {isChat ? (
        <BubbleChat
          chatflowid="83263889-e867-43aa-855f-0812859cd9ba"
          apiHost="https://meyoneducatio-chat-app.hf.space"
        />
      ) : (
        <FeedbackModal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          title="Feedback"
          description="Please let us know how we can improve your experience."
        />
      )}

      {isDashboard && (
         <BubbleChat
          chatflowid="83263889-e867-43aa-855f-0812859cd9ba"
          apiHost="https://meyoneducatio-chat-app.hf.space"
        />
      )}
    </>
  );
}
