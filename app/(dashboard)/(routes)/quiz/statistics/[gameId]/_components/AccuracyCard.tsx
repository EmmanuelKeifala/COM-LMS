'use client';
import React, { memo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

type Props = { accuracy: number };

// Memoize the AccuracyCard component to prevent unnecessary re-renders
const AccuracyCard = memo(({ accuracy }: Props) => {
  // Format accuracy to two decimal places if necessary
  const formattedAccuracy = Math.round(accuracy * 100) / 100;

  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Average Accuracy</CardTitle>
        <Target />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{formattedAccuracy}%</div>
      </CardContent>
    </Card>
  );
});
AccuracyCard.displayName = "AccuracyCard"
// Export the memoized component
export default AccuracyCard;
