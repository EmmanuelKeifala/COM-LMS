import {Button} from '@/components/ui/button';
import {Switch} from '@/components/ui/switch';
import {Eye, Pencil, Trash} from 'lucide-react';
import React from 'react';

type Props = {};

const BlogTable = (props: Props) => {
  return (
    <div className="rounded-md  border-[0.5px] overflow-y-scroll ">
      <div className="w-[800px] md:w-full ">
        <div className="grid grid-cols-5 border-b p-5 dark:text-gray-500">
          <h1 className="col-span-2">Title</h1>
          <h1>Premium</h1>
          <h1>Publish</h1>
        </div>
        <div className="grid grid-cols-5 mt-2">
          <h1 className="col-span-2">Blog Title</h1>
          <Switch checked={false} />
          <Switch checked={true} />
          <Action />
        </div>
      </div>
    </div>
  );
};

export default BlogTable;

const Action = () => {
  return (
    <div className="flex items-center gap-2 md:flex-wrap ">
      <Button variant="outline" className="flex items-center gap-2">
        <Eye />
        View
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Trash />
        Delete
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Pencil />
        Edit
      </Button>
    </div>
  );
};
