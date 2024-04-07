'use client';
import {useEffect} from 'react';
import {client} from '@/sanity/lib/client';
import {urlForImage} from '@/sanity/lib/image';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
type Props = {
  posts: Post[];
};
const BlogList = ({posts}: Props) => {
  useEffect(() => {
    const showNotification = (post: any) => {
      const notificationTitle = post.title; // Assuming 'title' is a field in your post document
      const notificationOptions = {
        body: post.description,
        icon: '/logo1.png',
        image: post.mainImage,
      };

      // Check if the browser supports notifications
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification(notificationTitle, notificationOptions);
      } else if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission !== 'denied'
      ) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(notificationTitle, notificationOptions);
          }
        });
      }
    };
    const listenQuery = `*[_type == "post" && defined(publishedAt)] {
  ...,
  author->,
  categories[]->
}`;
    const subscription = client.listen(listenQuery).subscribe((update: any) => {
      const newPost = update.result;
      if (newPost) {
        showNotification(newPost);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <hr className=" mb-10 " />

      <div className="grid grid-cols-1 md:grid-cols-2 px-10 gap-10 gap-y-16 pb-10 ">
        {posts.map(post => (
          <Link
            key={post._id}
            href={`https://meyoneducation.vercel.app/blog/post/${post?.slug?.current}`}>
            <div className="flex flex-col group cursor-pointer ">
              <div className="relative w-full h-80 drop-shadow-xl group-hover:scale-105 transition-transform duration-200">
                <Image
                  className="object-contain object-left lg:object-center "
                  src={urlForImage(post?.mainImage)}
                  alt={post.author.name}
                  fill
                />
                <div className="absolute flex flex-row bottom-0 w-full bg-opacity-20 bg-black backdrop-blur-lg rounded drop-shadow-lg text-white p-5 justify-between">
                  <div>
                    <p className="font-bold">{post.title}</p>
                    <p>
                      {new Date(post._createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2 items-center">
                    {post?.categories?.map(category => (
                      <div
                        key={category.description}
                        className=" border border-sky-700 text-center text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <p>{category.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex-1">
                <p className="underline text-lg font-bold">{post.title}</p>
                <p className="text-gray-500 line-clamp-2">{post.description}</p>
              </div>
              <p className="mt-5 font-bold flex items-center group-hover:underline">
                Read Post <ArrowRight className="mr-2 h-4 w-4" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
