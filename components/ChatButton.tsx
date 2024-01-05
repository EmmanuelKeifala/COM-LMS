'use client';
import {useState} from 'react';
import ChatWidget from './Chat-widget';
import {Button} from './ui/button';
import {MessageCircle, XCircle} from 'lucide-react';
import {MdFeedback} from 'react-icons/md';
import FeedbackModal from './Feedback/modal';

interface ChatButtonProps {
  isChat: boolean;
}

export default function ChatButton({isChat}: ChatButtonProps) {
  const [chatBoxOpen, setChatBoxOpen] = useState<boolean>(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

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
      <Button
        onClick={isChat ? toggleChatBox : toggleFeedbackModal}
        className="w-[150px] rounded-full bg-sky-500 flex items-center hover:bg-sky-400"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}>
        {isChat ? (
          chatBoxOpen ? (
            <XCircle size={30} className="mr-2 tex-xl" />
          ) : (
            <MessageCircle className="mr-2 tex-xl" size={30} />
          )
        ) : (
          <MdFeedback size={30} className="mr-2 tex-xl" />
        )}
        {isChat ? 'AI' : 'Feedback'}
      </Button>
      {isChat ? (
        <ChatWidget open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
      ) : (
        <FeedbackModal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          title="Feedback"
          description="Please let us know how we can improve your experience."
        />
      )}
    </>
  );
}
