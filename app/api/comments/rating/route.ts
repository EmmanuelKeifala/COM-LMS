import {client} from '@/sanity/lib/client';
import {NextResponse} from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const {ratingValue, id} = body;

    if (!ratingValue && id)
      return new NextResponse('Invalid Request', {status: 400});

    const ratings = await client.fetch('*[_type == "post" && _id == $id][0]', {
      id,
    });

    const ratingArray = ratings.rating || [];

    let updatedRatings = [...ratingArray, ratingValue];

    const rating =
      updatedRatings.reduce((sum, current) => sum + current, 0) /
      updatedRatings.length;

    await client.patch(id).set({rating: updatedRatings}).commit();

    return NextResponse.json({
      rating,
    });
  } catch (error) {
    console.log('[RATING_POST', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
