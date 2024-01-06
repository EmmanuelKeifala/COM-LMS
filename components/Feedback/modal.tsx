'use client';
import React, {useState, useEffect} from 'react';
import FeedbackModalElementRate from './modal-element-rate';
import {EmojiMeh, EmojiNice, EmojiSad} from './emojis';
import {useUser} from '@clerk/nextjs';
import Image from 'next/image';
import {MailIcon, MessageCircleIcon, Send, User, XCircle} from 'lucide-react';
import {Select, Spin} from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import {LoadingOutlined} from '@ant-design/icons';

interface FeedbackModalProps extends ChatWidgetProps {
  title?: null | string | React.ReactElement;
  description?: null | string | React.ReactElement;
}

export default function FeedbackModal({
  title,
  description,
  open,
  onClose,
}: FeedbackModalProps) {
  const {user} = useUser();
  const [formData, setFormData] = useState({
    email: user?.primaryEmailAddress?.toString() || '',
    message: '',
    name: user?.fullName || '',
    rate: '',
    feedbackType: 'other' as any,
  });
  const [isSending, setIsSending] = useState(false);
  const onSend = async () => {
    try {
      setIsSending(true);
      const response = await axios.post('/api/courses/feedback', {
        formData: formData,
      });
      toast.success('Feedback sent successfully');
      onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSending(false);
    }
  };
  useEffect(() => {
    // Update form data when the user object changes
    setFormData(prevData => ({
      ...prevData,
      email: user?.primaryEmailAddress?.toString() || '',
      name: user?.fullName || '',
    }));
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleChange = (value: {value: string; label: React.ReactNode}) => {
    setFormData(prevData => ({
      ...prevData,
      ['feedbackType']: value.value,
    }));
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <div
      className={`${
        open
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-all duration-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white dark:bg-gray-600 p-6 rounded-md shadow-lg`}>
      {(title || description) && (
        <header className="bg-sky-500 dark:bg-sky-700 text-white p-4 rounded-t-md">
          <div className="flex items-center justify-between">
            {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
            <button
              type="button"
              className=" text-white py-2 px-4 rounded-md block w-[40px] text-center sm:hidden"
              onClick={handleClose}>
              <XCircle size={25} />
            </button>
          </div>

          <span className="mb-2">
            Hi <b>{user?.firstName}</b> 👋
          </span>
          {description && <p>{description}</p>}
        </header>
      )}

      <form
        className="mt-4"
        onSubmit={e => {
          e.preventDefault();
          onSend();
        }}>
        <div className="relative w-full mb-4">
          <MailIcon
            size={25}
            className="text-sky-500 absolute top-0 right-0 mt-2 mr-2"
          />
          <input
            className="input-field border border-gray-300 pl-2 pr-10 py-2 rounded w-full"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            required
            onChange={e => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="relative w-full mb-4">
          <User
            size={25}
            className="text-sky-500 absolute top-0 right-0 mt-2 mr-2"
          />
          <input
            className="input-field border border-gray-300 pl-2 pr-10 py-2 rounded w-full"
            type="text"
            name="name"
            placeholder="name"
            value={formData.name}
            required
            onChange={e => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm">Choose feedback type</p>
          <Select
            labelInValue
            defaultValue={{value: 'other', label: 'Other'}}
            style={{width: 120}}
            onChange={handleChange}
            options={[
              {
                value: 'other',
                label: 'Other',
              },
              {
                value: 'report error',
                label: 'Report Error',
              },
              {
                value: 'request feature',
                label: 'Request Feature',
              },
              {
                value: 'suggestion',
                label: 'Suggestion',
              },
            ]}
          />
        </div>

        <div className="relative w-full mb-4">
          <MessageCircleIcon
            size={25}
            className="text-sky-500 absolute top-0 right-0 mt-2 mr-2"
          />
          <textarea
            className="resize-none input-field border border-gray-300 pl-2 pr-10 py-2 rounded w-full"
            name="message"
            placeholder="Feedback"
            rows={3}
            required
            value={formData.message}
            onChange={e => handleInputChange('message', e.target.value)}
          />
        </div>

        <div className="flex items-center flex-row mb-4 justify-between">
          <div className="flex items-center gap-4  ">
            <FeedbackModalElementRate
              value="bad"
              selected={formData.rate}
              onChange={(value: any) => handleInputChange('rate', value)}>
              <EmojiSad
                className={`text-2xl ${
                  formData.rate === 'bad' ? 'text-red-500' : 'text-gray-600'
                }`}
              />
            </FeedbackModalElementRate>
            <FeedbackModalElementRate
              value="meh"
              selected={formData.rate}
              onChange={(value: any) => handleInputChange('rate', value)}>
              <EmojiMeh
                className={`text-2xl ${
                  formData.rate === 'meh' ? 'text-yellow-500' : 'text-gray-600'
                }`}
              />
            </FeedbackModalElementRate>
            <FeedbackModalElementRate
              value="nice"
              selected={formData.rate}
              onChange={(value: any) => handleInputChange('rate', value)}>
              <EmojiNice
                className={`text-2xl ${
                  formData.rate === 'nice' ? 'text-green-500' : 'text-gray-600'
                }`}
              />
            </FeedbackModalElementRate>
          </div>
          {user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt="user_image"
              width={100}
              height={100}
              className="ml-2 rounded-full w-10 h-10 object-cover"
            />
          )}
        </div>

        <div>
          <button
            className="w-full bg-sky-500 dark:bg-sky-700 py-2 text-white text-xl rounded-md shadow-lg "
            type="submit"
            disabled={isSending}>
            {isSending ? (
              <Spin
                indicator={<LoadingOutlined style={{fontSize: 24}} spin />}
              />
            ) : (
              <div className="flex items-center gap-3 justify-center">
                Send
                <Send size={22} />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

interface ChatWidgetProps {
  open: boolean;
  onClose: () => void;
}
