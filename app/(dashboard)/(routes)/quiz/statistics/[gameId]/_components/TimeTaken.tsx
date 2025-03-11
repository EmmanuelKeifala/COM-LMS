import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hourglass } from 'lucide-react';
import { formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';

type Props = {
  timeEnded: Date;
  timeStarted: Date;
};

const TimeTakenCard = ({ timeEnded, timeStarted }: Props) => {
  // Memoizing the calculated time difference to avoid recalculating on every render
  const timeTaken = useMemo(() => {
    const delta = differenceInSeconds(timeEnded, timeStarted);
    return formatTimeDelta(delta);
  }, [timeEnded, timeStarted]);

  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Time Taken</CardTitle>
        <Hourglass />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          {timeTaken}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;
