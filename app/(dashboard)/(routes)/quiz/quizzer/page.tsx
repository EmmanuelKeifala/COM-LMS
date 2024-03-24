import React from 'react';
import QuizCreation from './_components/QuizCreation';
import {Metadata} from 'next';

type Props = {
  searchParams: {
    topic?: string;
  };
};
export const metadata: Metadata = {
  title: 'Quiz | Quizzer',
};

const page = ({searchParams}: Props) => {
  return <QuizCreation topicParam={searchParams.topic ?? ""} />;
};

export default page;
