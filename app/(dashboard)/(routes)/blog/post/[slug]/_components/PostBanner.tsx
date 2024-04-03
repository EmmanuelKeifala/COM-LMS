'use client';

import {Rate} from 'antd';
import {PortableText} from 'next-sanity';
import {urlForImage} from '@/sanity/lib/image';
import Image from 'next/image';
import {RichTextComponent} from '../../../_components/RichTextComponent';
import {useState} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {
  post: any;
};

const PostBanner = ({post}: Props) => {
  const [rating, setRating] = useState(
    post.rating.reduce((sum: number, current: number) => sum + current, 0) /
      post.rating.length,
  );

  async function RatingPost(e: any) {
    const response = await axios.post('/api/comments/rating', {
      id: post._id,
      ratingValue: e,
    });
    setRating(response.data.rating);
    toast.success('Thanks for rating');
    try {
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  }
  return (
    <article className="">
      <section className="space-y-2 border-sky-700">
        <div className="relative min-h-56 flex flex-col md:flex-row justify-between ">
          <div className="absolute top-0 w-full h-full opacity-10 blur-sm p-10">
            <Image
              className="object-cover object-center mx-auto"
              src={urlForImage(post?.mainImage)}
              alt={post.title}
              fill
            />
          </div>
          <section className="p-5 bg-slate-200 w-full">
            <div className="flex flex-col md:flex-row justify-between gap-y-5">
              <div>
                <h1 className="text-4xl font-extrabold">{post?.title}</h1>
                <p className="">
                  {new Date(post._createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  className="rounded-full"
                  src={urlForImage(post?.author?.image)}
                  alt={post.author.name}
                  height={40}
                  width={40}
                />
                <div className="w-64">
                  <h3 className="text-lg font-bold">{post?.author?.name}</h3>
                  <div>
                    <PortableText
                      value={post.author.bio}
                      components={RichTextComponent}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <h2 className="italic pt-10">{post?.description}</h2>
              <div className="flex items-center justify-end mt-auto space-x-2">
                <div className="flex flex-col  md:flex-row justify-center items-center space-x-3 gap-3">
                  {post.categories?.map((category: any) => (
                    <p
                      key={category.title}
                      className="bg-gray-800 text-white px-3 rounded-full text-sm font-semibold mt-4 text-center">
                      {category?.title}
                    </p>
                  ))}
                  <Rate
                    allowHalf
                    defaultValue={rating}
                    onChange={e => RatingPost(e)}
                    className="text-sky-700"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* <section className="w-full mt-10 border border-gray-200 shadow-md bg-white rounded-lg">
        <div className="p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-start justify-between">
          <div className="w-full sm:w-2/3 pr-4">
            <CommentCard comments={filteredComments} />
          </div>
          <div className="w-full sm:w-1/3 flex justify-center sm:justify-end mt-4 sm:mt-0">
            <CommentForm postId={post._id} />
          </div>
        </div>
      </section> */}
    </article>
  );
};

export default PostBanner;
