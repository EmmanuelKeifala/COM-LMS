import {client} from '@/sanity/lib/client';
import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const {id} = await req.json();
    const {userId} = auth();

    // Fetch the comment and its current likes array
    const comment = await client.fetch(
      '*[_type == "Comment" && _id == $id][0]',
      {id},
    );
    const likesArray = comment.likes || [];

    // Check if the user's ID is already in the likes array
    const index = likesArray.indexOf(userId);

    let updatedLikes;

    if (index !== -1) {
      // If user's ID is in the array, remove it
      likesArray.splice(index, 1);
      updatedLikes = likesArray;
    } else {
      // If user's ID is not in the array, add it
      updatedLikes = [...likesArray, userId];
    }

    // Update the comment with the updated likes array
    await client.patch(id).set({likes: updatedLikes}).commit();

    // Return the updated comment
    const updatedComment = await client.fetch(
      '*[_type == "Comment" && _id == $id][0]',
      {id},
    );
    return NextResponse.json({comment: updatedComment});
  } catch (error) {
    console.error('Error updating likes:', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
