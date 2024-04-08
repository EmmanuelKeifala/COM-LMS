import {client} from '@/sanity/lib/client';
import {urlForImage} from '@/sanity/lib/image';
import {groq} from 'next-sanity';
import Image from 'next/image';
import {PortableText} from '@portabletext/react';
import {RichTextComponent} from '../../_components/RichTextComponent';
import {CommentForm} from '../../_components/CommentForm';
import {auth} from '@clerk/nextjs';
import CommentCard from '../../_components/CommentCard';
import {Rate} from 'antd';
import PostBanner from './_components/PostBanner';

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 1;

export async function generateStaticParams() {
  const query = groq`*[_type == "post"]{
    slug
  }`;
  const slugs: any = await client.fetch(query);

  const slugRoutes = slugs?.map((slug: any) => slug?.slug?.current);

  return slugRoutes?.map((slug: any) => ({
    slug,
  }));
}

async function Post({params: {slug}}: Props) {
  const query = groq`
  *[_type=="post" && slug.current == $slug][0] {
    ...,
    author->,
    categories[]->
  }
  `;
  const post: any = await client.fetch(query, {slug});

  // const query2 = `*[_type=="Comment"]`;
  // const comments = await client.fetch(query2);

  // // Filter comments where post._ref matches post._id
  // const filteredComments = comments.filter(
  //   (comment: {post: {_ref: string}}) => {
  //     return comment.post?._ref === post?._id;
  //   },
  // );

  return (
    <div className="px-10 pb-28 mt-7 space-y-2">
      <PostBanner post={post} />
      <PortableText value={post?.body} components={RichTextComponent} />
    </div>
  );
}

export default Post;
