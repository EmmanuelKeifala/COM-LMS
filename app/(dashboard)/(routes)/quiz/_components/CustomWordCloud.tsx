'use client';
import {useTheme} from 'next-themes';
import {useRouter} from 'next/navigation';
import React from 'react';
import D3WordCloud from 'react-d3-cloud';
type Props = {
  formattedTopics: {text: string; value: number}[];
};

const fontSizeMapper = (word: {value: number}) => {
  return Math.log2(word.value) * 5 + 16;
};
const CustomWordCloud = ({formattedTopics}: Props) => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <>
      {formattedTopics.length != 0 && (
        <D3WordCloud
          height={500}
          font="Times"
          fontSize={fontSizeMapper}
          rotate={0}
          padding={10}
          fill={theme.theme === 'dark' ? 'white' : 'black'}
          data={formattedTopics}
          onWordClick={(event, word) => {
            router.push(`/quiz/quizzer?topic=${word.text}`);
          }}
        />
      )}
    </>
  );
};

export default CustomWordCloud;
