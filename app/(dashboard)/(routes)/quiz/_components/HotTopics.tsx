import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import CustomWordCloud from './CustomWordCloud';
import {db} from '@/lib/db';

type Props = {};

const HotTopics = async (props: Props) => {
  const topics = await db.topicCount.findMany({});

  const formattedTopics = topics.map(topic => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription className="">
          Click on a topic to start a quiz on it!!
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {formattedTopics.length != 0 && (
          <CustomWordCloud formattedTopics={formattedTopics} />
        )}
      </CardContent>
    </Card>
  );
};

export default HotTopics;
