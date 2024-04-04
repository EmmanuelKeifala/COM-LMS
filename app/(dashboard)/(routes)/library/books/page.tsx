import {IconBadge} from '@/components/icon-badge';
import * as libgen from 'libgen-ts';
import {BookOpen} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// import cheerio from 'cheerio';
// import axios from 'axios';

type Props = {
  searchParams: {q: string};
};

const BookCard = async ({searchParams}: Props) => {
  const urlString = await libgen.mirror();
  const options = {
    mirror: urlString,
    query: searchParams.q,
    count: 10,
    sort_by: 'year',
    reverse: true,
  };
  let data = [];
  data = await libgen.search(options);

  if (data.length === 0) {
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
    <div className="w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 mx-3">
      {data.length > 0 ? (
        data.map(async (book: any) => {
          return (
            <div
              className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full"
              key={book.id}>
              <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image
                  fill
                  className="object-cover"
                  alt={book.title}
                  src={`${urlString}/covers/${book.coverurl}`}
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
                  <p className="text-xs text-muted-foreground">
                    Year: {book.year}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Language: {book.language}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    File: {convertFileSize(book.filesize)}
                  </p>
                  {/* <p className="line-clamp-2">
                  <p
                    className="text-xs text-muted-foreground"
                    dangerouslySetInnerHTML={{__html: book.descr}}
                  />
                </p> */}
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
                    href={`https://library.lol/main/${book.md5.toLowerCase()} `}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-center inline-block mt-2 hover:bg-blue-600 transition duration-300 ease-in-out"
                    download>
                    Download
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="w-full flex justify-center flex-col items-center mt-10">
          <p className="text-lg text-muted text-center font-bold">
            NO RESULTS FOUND
          </p>
          <Link
            href="/library"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md text-center inline-block mt-2 hover:bg-blue-600 transition duration-300 ease-in-out">
            Go back
          </Link>
        </div>
      )}
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

// const scrapeWebsite = async (
//   url: string,
//   retries: number = 3,
// ): Promise<string | undefined> => {
//   try {
//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);
//     const downloadDiv = $('#download');
//     const firstH2 = downloadDiv.find('h2').first();
//     const firstH2AHref = firstH2.find('a').attr('href');
//     return firstH2AHref || undefined;
//   } catch (error: any) {
//     console.error('Error scraping website:', error);
//     if (retries > 0 && error.response && error.response.status === 503) {
//       const delay = Math.pow(2, 3 - retries) * 1000;
//       console.log('Retrying after', delay, 'milliseconds...');
//       await new Promise(resolve => setTimeout(resolve, delay));
//       return scrapeWebsite(url, retries - 1);
//     }
//     return undefined;
//   }
// };
