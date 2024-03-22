'use client';
import {useTheme} from 'next-themes';
import React from 'react';
import D3WordCloud from 'react-d3-cloud';
type Props = {};
const data = [
  {
    text: 'Physics',
    value: 4,
  },
  {
    text: 'Math',
    value: 15,
  },
  {
    text: 'Biology',
    value: 20,
  },
];

const fontSizeMapper = (word: {value: number}) => {
  return Math.log2(word.value) * 5 + 16;
};
const CustomWordCloud = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      <D3WordCloud
        height={500}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === 'dark' ? 'white' : 'black'}
        data={data}
      />
    </>
  );
};

export default CustomWordCloud;
