import {Card} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {CheckCircle2, XCircle} from 'lucide-react';
import React from 'react';

type Props = {
  correctAnswers: number;
  wrongAnswers: number;
};

const MCQCounter = ({correctAnswers, wrongAnswers}: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <CheckCircle2 color="green" size={30} />
      <span className="mx-2 text-2xl text-[green]">{correctAnswers || 0}</span>
      <Separator orientation="vertical" />

      <span className="mx-3 text-2xl text-[red]">{wrongAnswers || 0}</span>
      <XCircle color="red" size={30} />
    </Card>
  );
};

export default MCQCounter;
