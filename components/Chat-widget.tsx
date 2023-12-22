'use client';
import {useChat} from 'ai/react';
import {cn} from '@/lib/utils';
import {Input} from 'antd';
import {Button} from './ui/button';
import React, {useRef, useEffect} from 'react';
import {Spin} from 'antd';
import {Message} from 'ai';
import {useUser} from '@clerk/nextjs';
import {Bot, Send, Trash, XCircleIcon} from 'lucide-react';
import Image from 'next/image';

const {TextArea} = Input;

interface ChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

const ChatWidget = ({open, onClose}: ChatWidgetProps) => {
  const {
    messages,
    input,
    handleInputChange,
    setMessages,
    error,
    isLoading,
    handleSubmit,
  } = useChat();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      className={cn(
        'bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36',
        open ? 'fixed' : 'hidden',
      )}>
      <div className=" flex h-[600px] flex-col rounded-md bg-gray-200 shadow-xl">
        <Button
          onClick={onClose}
          className="self-end p-2 text-sky-500 bg-transparent w-[1020px]:hidden mt-1 mr-1 hover:bg-transparent">
          <XCircleIcon size={30} className="mr-2 tex-xl" />
        </Button>
        <div className="h-full mt-3 px-3 overflow-y-auto " ref={scrollRef}>
          {messages.map(message => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {error && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: 'Something went wrong, please try again',
                id: 'error',
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              Ask the AI questions about your notes
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="clear chat"
            variant={'outline'}
            size="icon"
            className=" shrink-0"
            type="button"
            disabled={isLoading}
            onClick={() => setMessages([])}>
            <Trash />
          </Button>
          <TextArea
            // showCount
            rows={1.5}
            name="question"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question"
            className=" outline-none"
            ref={inputRef}
            disabled={isLoading}
            onPressEnter={() => handleSubmit}
            autoSize={{
              minRows: 1.5,
              maxRows: 2,
            }}
          />
          <Button type="submit" className="bg-sky-500">
            {isLoading ? <Spin /> : <Send />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;

function ChatMessage({message: {role, content}}: {message: Message}) {
  const {user} = useUser();
  const isAiMessage = role === 'assistant';
  return (
    <div
      className={cn(
        'mb-3 flex items-center',
        isAiMessage ? 'justify-start ms-5' : 'justify-end ms-5',
      )}>
      {isAiMessage && <Bot className="mr-2 shrink-0" />}

      <div className="relative flex flex-row">
        <p
          className={cn(
            'whitespace-pre-line rounded-md border px-3 py-2',
            isAiMessage
              ? 'bg-gray-200 border-gray-50 '
              : 'bg-sky-500 text-white',
          )}
          dangerouslySetInnerHTML={{__html: content.replace(/"/g, ' ')}}
        />
      </div>

      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="user_image"
          width={100}
          height={100}
          className="ml-2 rounded-full w-10 h-10 object-cover"
        />
      )}
    </div>
  );
}
