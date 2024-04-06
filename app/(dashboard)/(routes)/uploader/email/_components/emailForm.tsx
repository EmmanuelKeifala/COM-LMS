'use client';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Editor} from '@/components/editor';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {Input} from '@/components/ui/input';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useState} from 'react';

const formSchema = z.object({
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters.',
  }),
  messageBody: z.string().min(5, {
    message: 'Message body must be at least 5 characters.',
  }),
  userCategory: z.string().min(5, {
    message: 'select a user category',
  }),
});

export default function EmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      messageBody: '',
      userCategory: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // You can handle the email sending logic here
    try {
      setIsLoading(true);
      await axios.post('https://lms-com-server.onrender.com/api/v1/mail', {
        subject: data.subject,
        messageBody: data.messageBody,
        userCategory: data.userCategory,
      });
      form.reset();
      form.resetField('userCategory');
      toast.success('Emails were sent successfully');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
      form.reset();
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full space-y-8 flex  flex-col  "
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col-reverse mt-2 gap-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userCategory"
            render={({field}) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="noClass">
                      Students without class
                    </SelectItem>
                    <SelectItem value="courseNotCompleted">
                      Students who have not completed their courses
                    </SelectItem>
                    <SelectItem value="noCourse">
                      Students who have not selected any course
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="messageBody"
          render={({field}) => (
            <FormItem>
              <FormLabel>Message Body</FormLabel>
              <FormControl>
                <Editor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-4">
          <Button type="submit" disabled={isLoading}>
            Send Email
          </Button>
          {isLoading && (
            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin />} />
          )}
        </div>
      </form>
    </Form>
  );
}
