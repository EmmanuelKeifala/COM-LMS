import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import {google} from 'googleapis';
import clerk from '@clerk/clerk-sdk-node';

export async function GET(req: Request) {
  try {
    const {userId} = auth();

    // this returns an array of OauthAccessToken objects I'm just getting the first one
    const [OauthAccessToken] = await clerk.users.getUserOauthAccessToken(
      userId || '',
      'oauth_google',
    );

    // this is the token I need to use to make requests to the gmail api
    // destructuring it here for clarity you can also just use OauthAccessToken.token below
    const {token} = OauthAccessToken;
    if (!token) {
      return new NextResponse('Unauthorized NO TOKEN', {status: 401});
    }

    // this is the gmail api client, you can use this to make
    // any request to the gmail api you can use any other
    // google.whatever api you need. Here is we make use of
    // the token we got from clerk passed in the headers
    const gmail = google.gmail({
      version: 'v1',
      headers: {Authorization: `Bearer ${token}`},
    });
    const res = await gmail.users.labels.list({
      userId: 'me',
    });
    console.log(res.data.labels);
    return NextResponse.json(res.data.labels);
  } catch (error) {
    console.log('[GMAIL ERROR]', error);
    return new NextResponse('Internal error', {status: 500});
  }
}
