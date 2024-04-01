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

const CommentCard: React.FC<{comments: Comment[]}> = ({comments}) => {
  const {user} = useUser();
  const [localLikes, setLocalLikes] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchLikes = async () => {
      const updatedLocalLikes: {[key: string]: number} = {};

      for (const comment of comments) {
        try {
          // Check if the user's ID is included in the comment's likes array
          const userLiked = comment.likes.includes(user?.id || '');

          // Set the local likes state accordingly
          updatedLocalLikes[comment._id] = userLiked ? 1 : 0;
        } catch (error) {
          console.error('Error fetching likes:', error);
        }
      }

      setLocalLikes(updatedLocalLikes);
    };

    fetchLikes();

    // Subscribe to real-time updates
    const subscription = client
      .listen<Comment>('*[_type == "Comment" && _id in $commentIds]', {
        commentIds: comments.map(comment => comment._id),
      })
      .subscribe(update => {
        // Handle update
        const updatedComment: any = update.result;

        // Update local state based on the update
        setLocalLikes(prevLikes => {
          const newLikes = {...prevLikes};
          newLikes[updatedComment._id] = updatedComment.likes.length;
          return newLikes;
        });
      });

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, [comments, user?.id]);

  const handleLikeClick = async (commentId: string) => {
    try {
      const response = await axios.post(`/api/comments/likes`, {
        id: commentId,
      });

      const updatedLikesCount = response?.data?.likes?.length || 0;

      setLocalLikes(prevLikes => ({
        ...prevLikes,
        [commentId]: updatedLikesCount,
      }));
    } catch (error) {
      console.error('Error updating likes count:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {comments?.map((comment: Comment) => (
        <div key={comment._id} className="flex justify-center">
          <div className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-200 w-full flex flex-col justify-between">
            <div className="p-4">
              {/* Display Like Count */}
              {localLikes[comment._id] !== undefined &&
                localLikes[comment._id] !== 0 && (
                  <p className="text-xs text-gray-400 mb-2">
                    {localLikes[comment._id]}{' '}
                    {localLikes[comment._id] === 1 ? 'Like' : 'Likes'}
                  </p>
                )}

              <div className="flex items-center mb-4">
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
                  className={`cursor-pointer ${
                    localLikes[comment._id] ? 'text-red-500' : 'text-gray-500'
                  }`}
                  onClick={() => handleLikeClick(comment._id)}
                />
                {/* <p className="text-xs font-semibold text-gray-600 cursor-pointer">
                  {localLikes[comment._id] !== undefined &&
                    localLikes[comment._id] !== 0 && (
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer">
                        {localLikes[comment._id]}{' '}
                        {localLikes[comment._id] === 1 ? 'Like' : 'Likes'}
                      </p>
                    )}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentCard;
