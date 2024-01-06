import React from 'react';

export default function FeedbackModalElementRate({
  children,
  selected,
  onChange = () => {},
  value,
}: {
  children: React.ReactElement;
  selected: string;
  onChange: any;
  value: string;
}) {
  const isSelected = selected === value;

  return (
    <label
      className={`inline-block p-2 rounded-full transition duration-300 ease-in-out ${
        isSelected
          ? ' text-white bg-gray-200 dark:bg-white dark:text-black'
          : ' text-gray-800 dark:text-white dark:bg-white'
      } cursor-pointer`}>
      <input
        className="hidden"
        type="radio"
        name="rate"
        value={value}
        onChange={e => onChange(e.target.value)}
        checked={isSelected}
      />
      {children}
    </label>
  );
}
