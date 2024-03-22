'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
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

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 2,
      topic: '',
      type: 'mcq',
    },
  });
  function onSubmit(input: Input) {
    alert(JSON.stringify(input, null, 2));
  }

  form.watch();
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pr-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="flex justify-between gap-3">
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues('type') === 'mcq' ? 'default' : 'secondary'
                  }
                  onClick={() => {
                    form.setValue('type', 'mcq');
                  }}>
                  <CopyCheck className="h-4 w-4 mr-3" />
                  Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 "
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
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues('type') === 'saq' ? 'default' : 'secondary'
                  }
                  onClick={() => {
                    form.setValue('type', 'saq');
                  }}>
                  <BookOpenCheck className="h-4 w-4 mr-3" />
                  Short Answered
                </Button>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, {message: 'Topic must be at least four(4) characters long'}),
  type: z.enum(['mcq', 'open_ended', 'saq']),
  amount: z.number().min(1).max(20),
});
