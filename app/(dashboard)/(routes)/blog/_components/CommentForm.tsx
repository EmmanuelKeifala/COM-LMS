'use client';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Textarea} from '@/components/ui/textarea';
import {useUser} from '@clerk/nextjs';
import toast from 'react-hot-toast';
import axios from 'axios';
import {Spin} from 'antd';
import {useState} from 'react';

const FormSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: 'Content must be at least 10 characters.',
    })
    .max(160, {
      message: 'Content must not be longer than 160 characters.',
    }),
  //   username: z.string(),
});

type Props = {
  postId: string;
};

export function CommentForm({postId}: Props) {
  const {user} = useUser();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const sanityData = {
      content: data.content,
      username: user?.username,
      id: postId,
      userimage: user?.profileImageUrl,
    };
    setIsLoading(true);
    try {
      await axios.post('/api/comments', sanityData);
      toast.success('Comment Posted');
      form.reset();
      form.resetField('content');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({field}) => (
            <FormItem className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Your Comment</label>
              <FormControl>
                <Textarea
                  placeholder="You can write your comment here"
                  className="px-3 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:border-blue-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLoading ? (
          <Button
            type="submit"
            disabled={!user?.username}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Submit
          </Button>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Spin />
          </div>
        )}
      </form>
    </Form>
  );
}
