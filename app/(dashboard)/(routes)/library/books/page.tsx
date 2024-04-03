import React from 'react';
import libgen from 'libgen';
import Image from 'next/image';
import Link from 'next/link';

type Book = {
  title: string;
  coverImage: string;
  author: string;
  year: number;
  edition: string;
};

type Props = {
  searchParams: {q: string};
};

const BookCard = async ({searchParams}: Props) => {
  const urlString = await libgen.mirror();
  const options = {
    mirror: urlString,
    query: searchParams.q,
    count: 5,
    sort_by: 'year',
    reverse: true,
  };
  const data = await libgen.search(options);

  return (
    <div className="mr-10 px-10 py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 space-y-4">
      {data?.map((book: any) => (
        <div
          key={book.id}
          className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            <div className="relative">
              <Image
                className="w-full h-48 object-fill"
                src={`${urlString}/covers/${book.coverurl}`}
                alt={book.title}
                width={400}
                height={400}
              />
            </div>
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Author: {book.author}
              </p>
              <p className="text-sm text-gray-600 mb-2">Year: {book.year}</p>
              <p className="text-sm text-gray-600 mb-2">
                Language: {book.language}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Pages: {book.pagesinfile}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Total Pages: {book.topic}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                File: {convertFileSize(book.filesize)}
              </p>
              <p
                className="text-sm text-gray-600 mb-2 line-clamp-5"
                dangerouslySetInnerHTML={{__html: book.descr}}
              />
            </div>
            <div className="p-4">
              <Link
                href={`https://library.lol/main/${book.md5.toLowerCase()}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-center inline-block mt-2 hover:bg-blue-600 transition duration-300 ease-in-out"
                download>
                Download
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCard;

function convertFileSize(sizeInBytes: any) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (sizeInBytes < KB) {
    return sizeInBytes + ' bytes';
  } else if (sizeInBytes < MB) {
    return (sizeInBytes / KB).toFixed(2) + ' KB';
  } else if (sizeInBytes < GB) {
    return (sizeInBytes / MB).toFixed(2) + ' MB';
  } else {
    return (sizeInBytes / GB).toFixed(2) + ' GB';
  }
}

function extractFilePath(inputString: any) {
  // Find the last occurrence of "-"
  const lastIndex = inputString?.lastIndexOf('-');

  // Extract the substring before the last "-"
  const filePath = inputString?.substring(0, lastIndex);

  return filePath;
}
