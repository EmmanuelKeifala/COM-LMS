'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {BookOpen, BookOpenCheck, CopyCheck} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {quizCreationSchema} from '@/lib/validation';
import LoadingQuestions from '../../_components/LoadingQuestions';

type Input = z.infer<typeof quizCreationSchema>;
type Props = {
  topicParam: string;
};
const QuizCreation = ({topicParam}: Props) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [finished, setFinished] = useState(false);

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 2,
      topic: topicParam,
      type: 'mcq',
    },
  });

  async function onSubmit(input: Input) {
    setShowLoader(true);
    try {
      const response = await axios.post('/api/quiz/game', {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      });
      const {gameId} = response.data;
      setFinished(true);
      setTimeout(() => {
        if (form.getValues('type') === 'mcq') {
          router.push(`/quiz/play/mcq/${gameId}`);
        } else if (form.getValues('type') === 'open_ended') {
          router.push(`/quiz/play/open_ended/${gameId}`);
        } else {
          router.push(`/quiz/play/saq/${gameId}`);
        }
      }, 1000);
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error('Error submitting form:', error);
    } finally {
      setIsPending(false);
      setShowLoader(false);
    }
  }

  form.watch();
  if (showLoader) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-full mx-10 px-10 max-w-md md:max-w-lg lg:max-w-xl">
          <LoadingQuestions finished={finished} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
            <CardDescription>Choose a topic</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a topic" {...field} />
                      </FormControl>
                      <FormDescription>Please enter a topic</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Number of questions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter an amount"
                          {...field}
                          onChange={e =>
                            form.setValue('amount', parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <Button
                    type="button"
                    className="md:w-1/3"
                    variant={
                      form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                    }
                    onClick={() => {
                      form.setValue('type', 'mcq');
                    }}>
                    <CopyCheck className="h-4 w-4 mr-3" />
                    Multiple Choice
                  </Button>
                  <Button
                    type="button"
                    className="md:w-1/3"
                    variant={
                      form.getValues('type') === 'open_ended'
                        ? 'default'
                        : 'secondary'
                    }
                    onClick={() => {
                      form.setValue('type', 'open_ended');
                    }}>
                    <BookOpen className="h-4 w-4 mr-3" />
                    Open Ended
                  </Button>
                  {/* <Button
                    type="button"
                    className="md:w-1/3"
                    variant={
                      form.getValues('type') === 'saq' ? 'default' : 'secondary'
                    }
                    onClick={() => {
                      form.setValue('type', 'saq');
                    }}>
                    <BookOpenCheck className="h-4 w-4 mr-3" />
                    Short Answered
                  </Button> */}
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default QuizCreation;
