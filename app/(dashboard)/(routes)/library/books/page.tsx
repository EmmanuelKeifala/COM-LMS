'use client';

import {useEffect, useState} from 'react';
import axios from 'axios';
import {IconBadge} from '@/components/icon-badge';
import {BookOpen} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Spin} from 'antd';

type Book = {
  downloadUrl: string;
  id: string;
  title: string;
  author: string;
  year: number;
  language: string;
  filesize: number;
  pagesinfile?: number;
  coverurl: string;
};

type Props = {
  searchParams: {q: string};
};

const BookCard = ({searchParams}: Props) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.post(
          'https://lms-com-server.onrender.com/api/v1/getBooks',
          {
            query: searchParams.q,
          },
        );
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center mt-10">
        <Spin />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        <p className="text-lg text-muted text-center font-bold">
          NO RESULTS FOUND
        </p>
        <Link
          href="/library"
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-center inline-block mt-2 hover:bg-blue-600 transition duration-300 ease-in-out">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mx-3 mt-3 mb-3">
      {books.map(book => (
        <div
          className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full"
          key={book.id}>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image
              fill
              className="object-cover"
              alt={book.title}
              src={book.coverurl}
            />
          </div>
          <div className="flex flex-col pt-2">
            <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
              {book.title}
            </div>
            <div className="w-full flex flex-col justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Author: {book.author}
              </p>
              <p className="text-xs text-muted-foreground">Year: {book.year}</p>
              <p className="text-xs text-muted-foreground">
                Language: {book.language}
              </p>
              <p className="text-xs text-muted-foreground">
                File: {book.filesize}
              </p>
            </div>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
              {book.pagesinfile && (
                <div className="flex items-center gap-x-1 text-slate-500">
                  <IconBadge size="sm" icon={BookOpen} />
                  <span>
                    {book.pagesinfile > 0 ? book.pagesinfile : ''}{' '}
                    {book.pagesinfile > 0
                      ? book.pagesinfile === 1
                        ? 'Chapter'
                        : 'Chapters'
                      : 'unknown'}
                  </span>
                </div>
              )}
            </div>
            <div className="w-full flex flex-row justify-between ">
              <Link
                href={book.downloadUrl}
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
