import {client} from '@/sanity/lib/client';
import {groq} from 'next-sanity';
import React from 'react';
import BlogList from './_components/BlogList';
type Props = {};

const query = groq`*[_type=="post"]{
  ...,
  author->,
  categories[]->
}|order(_createdAt desc)`;

const BlogPage = async (props: Props) => {
  const posts = await client.fetch(query);
  return (
    <div>
      <BlogList posts={posts} />
    </div>
  );
};

export default BlogPage;
