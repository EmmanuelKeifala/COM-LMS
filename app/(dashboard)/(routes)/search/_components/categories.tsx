'use client';

import {Category, Level} from '@prisma/client';
import {FcEngineering} from 'react-icons/fc';

import {TbMathFunction, TbMicroscope} from 'react-icons/tb';
import {SlChemistry, SlSpeech} from 'react-icons/sl';
import {
  GiSkeleton,
  GiStethoscope,
  GiChemicalDrop,
  GiHerbsBundle,
  GiMedicines,
  GiHospitalCross,
  GiFirstAidKit,
  GiMedicinePills,
  GiPillDrop,
} from 'react-icons/gi';
import {MdOutlineLocalPharmacy} from 'react-icons/md';
import {GoLaw} from 'react-icons/go';

import {IconType} from 'react-icons';

import {CategoryItem} from './category-item';

interface CategoriesProps {
  items: Category[] & Level[];
}

const iconMap: Record<Category['name'], IconType> = {
  Chemistry: SlChemistry,
  Physics: FcEngineering,
  Math: TbMathFunction,
  Biology: TbMicroscope,
  'Communication Skills': SlSpeech,
  Anatomy: GiSkeleton,
  Physiology: GiStethoscope,
  Biochemistry: GiChemicalDrop,
  'Pharmaceutical Chemistry': MdOutlineLocalPharmacy,
  Pharmacognosy: GiHerbsBundle,
  'Into. to Pharmacy': GiMedicines,
  'Clinical Pharmacy': GiHospitalCross,
  'Pharmacy Jurisprudence': GoLaw,
  'First Aid': GiFirstAidKit,
  'Pharmaceutics general  & technology': GiPillDrop,
  'Pharmaceutics microbiology': GiMedicinePills,
  'Community Medicine': GiMedicines,
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
