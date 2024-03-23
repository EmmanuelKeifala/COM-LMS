import React from 'react';
import QuizCreation from './_components/QuizCreation';
import {Metadata} from 'next';

type Props = {};
export const metadata: Metadata = {
  title: 'Quiz | Quizzer',
};

const page = (props: Props) => {
  return <QuizCreation />;
};

export default page;
