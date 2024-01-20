'use client';

import {Course} from '@prisma/client';
import {ColumnDef} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';

import {Button} from '@/components/ui/button';

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'actualName',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Actual Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'abbreviation',
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Abbreviation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
