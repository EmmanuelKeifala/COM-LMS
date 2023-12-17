'use client';

import * as z from 'zod';
import axios from 'axios';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Pencil} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {VideoUrl} from '@prisma/client';
import {cn} from '@/lib/utils';

interface UrlFormProps {
  initialData: VideoUrl;
  videoId?: string;
  rating: any;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: 'Title is required',
  }),
});

const UrlForm = ({initialData, videoId, rating}: UrlFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });
  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const upValues: any = {...values, videoId};
    try {
      await axios.patch(`/api/courses`, upValues);
      toast.success('video updated');
      toggleEdit();
      router.refresh();
    } catch (error: any) {
      console.log('ERROR', error);
      toast.error(error?.response.data.message!);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video Url{' '}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Url
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className="text-sm mt-2 truncate">{initialData.videoUrl}</p>
          <span
            className={cn(
              'font-bold text-sm',
              rating! < 3.5 ? ' text-red-500' : 'text-green-500',
            )}>
            rating: {Math.round(rating!)}
          </span>
        </>
      )}
      {isEditing && (
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
                    <Input disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default UrlForm;
