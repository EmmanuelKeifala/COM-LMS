'use client';

import * as z from 'zod';
import axios from 'axios';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Loader2, PlusCircle} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {Chapter, ChapterQuiz, Course, VideoUrl} from '@prisma/client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {Input} from '@/components/ui/input';
import {ChaptersVideoList} from './ChaptersVideoList';
import {ChapterQuizList} from './ChapterQuizList';

interface ChapterQuizUrlProps {
  initialData: Chapter & {quizUrls: ChapterQuiz[]};
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const ChapterQuizUrl = ({
  initialData,
  courseId,
  chapterId,
}: ChapterQuizUrlProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleCreating = () => {
    setIsCreating(current => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz`,
        values,
      );
      toast.success('quizz added');
      toggleCreating();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz/${id}`,
      );
      toast.success('Chapter video deleted');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black dark:text-white">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapter Quiz
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a quiz
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="url"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="enter the google form url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.quizUrls.length && 'text-slate-500 italic',
          )}>
          {!initialData.quizUrls.length && 'No quizzes'}
          <ChapterQuizList
            onDelete={onDelete}
            items={initialData.quizUrls || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the quizzes
        </p>
      )}
    </div>
  );
};
