'use client';

import {Chapter, VideoUrl} from '@prisma/client';
import {useState, useEffect} from 'react';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {cn} from '@/lib/utils';
import {Grip, Pencil, Trash, Video} from 'lucide-react';
import {Badge} from '@/components/ui/badge';

interface ChaptersVideoListProps {
  items: VideoUrl[];
  onReorder: (updateData: {id: string; position: number}[]) => void;
  onDelete: (id: string) => void;
}
export const ChaptersVideoList = ({
  items,
  onReorder,
  onDelete,
}: ChaptersVideoListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}>
                {provided => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-e-200 hover:bg-slate-300 rounded-l-md transition',
                      )}
                      {...provided.dragHandleProps}>
                      <Video className="h-5 w-5" />
                    </div>

                    <span className=" truncate">{chapter.videoUrl}</span>

                    <div className="ml-auto  pr-2 flex items-center gap-x-2 ">
                      <Trash
                        onClick={() => onDelete(chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
