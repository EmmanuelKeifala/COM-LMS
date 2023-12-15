'use client';
import {useState} from 'react';
import ChatWidget from './Chat-widget';
import {Button} from './ui/button';
import {MessageCircle, XCircle} from 'lucide-react';

export default function ChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onClick={() => setChatBoxOpen(!chatBoxOpen)}
        className="w-[100px] rounded-full bg-sky-500 flex items-center hover:bg-sky-400"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}>
        {chatBoxOpen ? (
          <XCircle size={30} className="mr-2 tex-xl" />
        ) : (
          <MessageCircle className="mr-2 tex-xl" size={30} />
        )}
        AI
      </Button>
      <ChatWidget open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
