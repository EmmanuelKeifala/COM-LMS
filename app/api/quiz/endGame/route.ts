import {db} from '@/lib/db';
import {NextResponse} from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const {gameId} = body;
    const game = await db.game.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      return NextResponse.json(
        {
          message: 'Game not found',
        },
        {
          status: 404,
        },
      );
    }
    await db.game.update({
      where: {
        id: gameId,
      },
      data: {
        timeEned: new Date(),
      },
    });
    return NextResponse.json({
      message: 'Game ended',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {status: 500},
    );
  }
}
