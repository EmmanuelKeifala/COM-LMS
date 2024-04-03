'use client';
import {useEffect, useState} from 'react';
import {differenceInSeconds} from 'date-fns';
import {formatTimeDelta} from '@/lib/utils';
import axios from 'axios';
import {HeartIcon, User2} from 'lucide-react';
import {client} from '@/sanity/lib/client';
import Image from 'next/image';
import {useUser} from '@clerk/nextjs';

interface Comment {
  _id: string;
  userimage?: string;
  username: string;
  content: string;
  likes: string[]; // Modified type to array of string
  _createdAt: Date;
}

const CommentCard: React.FC<{comments: Comment[]}> = ({
  comments: initialComments,
}) => {
  const {user} = useUser();
  const [localLikes, setLocalLikes] = useState<{[key: string]: number}>({});
  const [comments, setComments] = useState<Comment[]>(initialComments);

  useEffect(() => {
    const fetchLikes = async () => {
      const updatedLocalLikes: {[key: string]: number} = {};
      initialComments.forEach(comment => {
        const userLiked = comment.likes.includes(user?.id || '');
        updatedLocalLikes[comment._id] = userLiked ? 1 : 0;
      });

      setLocalLikes(updatedLocalLikes);
    };

    fetchLikes();
    const subscription = client
      .listen<Comment>('*[_type == "Comment"]')
      .subscribe(update => {
        const updatedComment: any = update.result;
        const existingCommentIndex = comments.findIndex(
          comment => comment._id === updatedComment._id,
        );

        if (existingCommentIndex !== -1) {
          setLocalLikes(prevLikes => ({
            ...prevLikes,
            [updatedComment._id]: updatedComment.likes.length,
          }));
        } else {
          setComments(prevComments => [...prevComments, updatedComment]);
        }
      });

    return () => subscription.unsubscribe();
  }, [comments, initialComments, user?.id]);

  const handleLikeClick = async (commentId: string) => {
    try {
      const response = await axios.post(`/api/comments/likes`, {
        id: commentId,
      });

      const updatedComment = response?.data?.comment;

      // Extract the new likes count from the updated comment
      const updatedLikesCount = updatedComment.likes.length;

      // Update local state with the new likes count
      setLocalLikes(prevLikes => ({
        ...prevLikes,
        [commentId]: updatedLikesCount,
      }));
    } catch (error) {
      console.error('Error updating likes count:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {comments?.map((comment: Comment) => (
        <div key={comment._id} className="flex justify-center">
          <div className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-200 w-full flex flex-col justify-between">
            <div className="p-4">
              <div className="flex items-center mb-4 gap-x-3 justify-between">
                {comment.userimage ? (
                  <div className="w-10 h-10 mr-3">
                    <Image
                      src={comment?.userimage}
                      alt={comment.username}
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                  </div>
                ) : (
                  <User2 size={40} className="rounded-full mr-3" />
                )}
                <span className="text-gray-800 font-semibold">
                  @{comment.username}
                </span>
                <p className="text-xs font-semibold text-gray-600 cursor-pointer whitespace-nowrap">
                  {localLikes[comment._id] !== undefined &&
                    localLikes[comment._id] !== 0 &&
                    `${localLikes[comment._id]} ${
                      localLikes[comment._id] === 1 ? 'Like' : 'Likes'
                    }`}
                </p>
              </div>
              <div className="overflow-y-auto max-h-40 mb-4">
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
              <div className="flex-grow">
                <p className="text-xs text-gray-400">
                  {formatTimeDelta(
                    differenceInSeconds(Date.now(), comment._createdAt),
                  )}{' '}
                  ago
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <HeartIcon
                  className={`cursor-pointer  ${
                    localLikes[comment._id] ? 'text-sky-700' : 'text-gray-500'
                  }`}
                  onClick={() => handleLikeClick(comment._id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentCard;
