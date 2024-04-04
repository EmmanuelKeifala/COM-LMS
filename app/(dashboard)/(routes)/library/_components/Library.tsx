'use client';

import {Spin} from 'antd';
import {Star} from 'lucide-react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {TypeAnimation} from 'react-type-animation';

const Library = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    console.log('Search input:', searchInput);
    router.push(`/library/books?q=${searchInput}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className="max-w-4xl w-full flex flex-col items-center p-8">
        <div className="flex flex-row items-center mb-6">
          <Star size={36} color="gold" />
          <p className="ml-2 font-mono text-3xl">
            Start your reading journey today
          </p>
        </div>
        <TypeAnimation
          sequence={['Where every place is an adventure', 3000, '', 1]}
          wrapper="p"
          speed={50}
          style={{
            fontSize: '1.5em',
            display: 'inline-block',
            fontFamily: 'monospace',
          }}
          repeat={Infinity}
          deletionSpeed={90}
        />
        <p className="text-center text-lg my-8 font-mono">
          From classes to contemporary, our bookstore offers a wide selection of
          books to suit every taste and interest. Start exploring our shelves
          today and uncover your next library gem.
        </p>
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="mt-4 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white text-gray-800"
        />
        {!loading ? (
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none">
            Submit
          </button>
        ) : (
          <Spin className="mt-4 px-6 py-2" />
        )}
      </div>
    </div>
  );
};

export default Library;
