'use client';

import {Category} from '@prisma/client';
import {
  FcEngineering,
  
} from 'react-icons/fc';

import {TbMathFunction, TbMicroscope} from 'react-icons/tb';
import {SlChemistry, SlSpeech} from 'react-icons/sl';

import {IconType} from 'react-icons';

import {CategoryItem} from './category-item';

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category['name'], IconType> = {
  Chemistry: SlChemistry,
  Physics: FcEngineering,
  Math: TbMathFunction,
  Biology: TbMicroscope,
  'Communication Skills': SlSpeech,
};

export const Categories = ({items}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map(item => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
