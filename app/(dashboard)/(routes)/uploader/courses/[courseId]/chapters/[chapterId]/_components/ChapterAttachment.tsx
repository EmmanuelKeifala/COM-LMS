'use client';

import * as z from 'zod';
import axios from 'axios';
import {Pencil, PlusCircle, ImageIcon, File, Loader2, X} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {Attachment, Chapter, ChapterAttachment, Course} from '@prisma/client';
import Image from 'next/image';

import {Button} from '@/components/ui/button';
import {FileUpload} from '@/components/file-upload';

interface ChapterAttachmentFormProps {
  initialData: Chapter & {chapterAttachments: ChapterAttachment[]};
  courseId: string;
  chapterId: string;
}

const chapterAttachmentFormSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1),
});

export const ChapterAttachmentForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async (
    values: z.infer<typeof chapterAttachmentFormSchema>,
  ) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments`,
        values,
      );
      toast.success('Chapter attachment added');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`,
      );
      toast.success('Chapter attachment deleted');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black dark:text-white">
      <div className="font-medium flex items-center justify-between">
        Chapter attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.chapterAttachments?.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.chapterAttachments?.length > 0 && (
            <div className="space-y-2">
              {initialData.chapterAttachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={data => {
              onSubmit({name: data.name, url: data.url});
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything related to this chapter.
          </div>
        </div>
      )}
    </div>
  );
};
