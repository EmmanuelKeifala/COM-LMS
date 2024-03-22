import {useSession} from '@clerk/nextjs';
import React from 'react';
import QuizCreation from './_components/QuizCreation';

type Props = {};
export const metadara = {
  title: 'Quiz | Quizzer',
};
const page = (props: Props) => {
  return <QuizCreation />;
};

export default page;
