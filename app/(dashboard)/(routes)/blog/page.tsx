'use client';
import {client} from '@/sanity/lib/client';
import {groq} from 'next-sanity';
import React, {useState, useEffect} from 'react';
import BlogList from './_components/BlogList';

type Props = {};

const query = groq`*[_type=="post"]{
  ...,
  author->,
  categories[]->
}|order(_createdAt desc)`;

const BlogPage = (props: Props) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const fetchedPosts = await client.fetch(query);
    setPosts(fetchedPosts);
  };

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <BlogList posts={posts} />
    </div>
  );
};

export default BlogPage;
