'use client';

import * as z from 'zod';
import axios from 'axios';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Loader2, PlusCircle} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {Chapter, Course, VideoUrl} from '@prisma/client';

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

// import {ChaptersList} from './ChaptersList';

interface VideoFormProps {
  initialData: Chapter & {videoUrls: VideoUrl[]};
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const VideoForm = ({
  initialData,
  courseId,
  chapterId,
}: VideoFormProps) => {
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
      title: '',
    },
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/videos`,
        values,
      );
      toast.success('videos added');
      toggleCreating();
      router.refresh();
    } catch (error: any) {
      console.log('[ERROR]', error);
      toast.error(error?.response.data.message!);
    }
  };

  const onReorder = async (updateData: {id: string; position: number}[]) => {
    try {
      setIsUpdating(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/reorder`,
        {
          list: updateData,
        },
      );
      toast.success('videos reordered');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/videos/${id}`,
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
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapter Videos
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
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
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'past links'"
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
            !initialData.videoUrls.length && 'text-slate-500 italic',
          )}>
          {!initialData.videoUrls.length && 'No videos'}
          <ChaptersVideoList
            onDelete={onDelete}
            onReorder={onReorder}
            items={initialData.videoUrls || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the vidoes
        </p>
      )}
    </div>
  );
};
