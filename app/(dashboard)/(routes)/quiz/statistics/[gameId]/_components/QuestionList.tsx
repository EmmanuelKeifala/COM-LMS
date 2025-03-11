'use client';
import React, { useMemo } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Question } from '@prisma/client';

type Props = {
  questions: Question[] ;
};

const QuestionsList = ({ questions }: Props) => {
  // Memoize question type to avoid checking it in every iteration of map
  const questionType = useMemo(() => questions[0]?.questionType, [questions]);

  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>

          {questionType === 'open_ended' && (
            <TableHead className="w-[10px] text-right">Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(
          (
            { answer, question, userAnswer, percentageCorrect, isCorrect },
            index
          ) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                {question} <br />
                <br />
                <span className="font-semibold">{answer}</span>
              </TableCell>
              {questionType === 'open_ended' ? (
                <TableCell className="font-semibold">{userAnswer}</TableCell>
              ) : (
                <TableCell
                  className={`${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  } font-semibold`}
                >
                  {userAnswer}
                </TableCell>
              )}

              {percentageCorrect && (
                <TableCell className="text-right">{percentageCorrect}</TableCell>
              )}
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
