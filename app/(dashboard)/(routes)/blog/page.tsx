import {client} from '@/sanity/lib/client';
import {groq} from 'next-sanity';
import React from 'react';
type Props = {};

const query = groq`*[_type=="post"]{
  ...,
  author->,
  categories[]->
}|order(_createdAt desc)`;

const BlogPage = async (props: Props) => {
  const posts = await client.fetch(query);
  console.log(posts);
  return <div>BlogPage</div>;
};

export default BlogPage;
