import {urlForImage} from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import {any} from 'zod';

export const RichTextComponent = {
  types: {
    image: ({value}: any) => {
      return (
        <div className="object-contain my-4 mx-auto py-10 text-center">
          <Image src={urlForImage(value)} alt="Blog Image" />
        </div>
      );
    },
  },
  listItem: {
    bullet: ({children}: any) => (
      <li className="ml-10 py-5 list-disc space-y-5">{children}</li>
    ),
    number: ({children}: any) => (
      <ol className="mt-lg list-decimal">{children}</ol>
    ),
  },
  block: {
    h1: ({children}: any) => (
      <h1 className="text-5xl py-10 font-bold">{children}</h1>
    ),
    h2: ({children}: any) => (
      <h2 className="text-4xl py-10 font-bold">{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className="text-3xl py-10 font-bold">{children}</h3>
    ),
    h4: ({children}: any) => (
      <h4 className="text-2xl py-10 font-bold">{children}</h4>
    ),
    blockquote: ({children}: any) => (
      <blockquote className="border-l-sky-700 border-l-4 pl-5 py-5 my-5">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({value, children}: any) => {
      const rel = !value?.href?.startsWith('/')
        ? 'noreferrer noopener'
        : undefined;
      return (
        <Link
          href={value?.href}
          rel={rel}
          className="underline decoration-sky-700 hover:decoration-black">
          {children}
        </Link>
      );
    },
    strong: ({children}: any) => <b>{children}</b>,
    em: ({children}: any) => (
      <em className=" font-semibold italic">{children}</em>
    ),
  },
};
