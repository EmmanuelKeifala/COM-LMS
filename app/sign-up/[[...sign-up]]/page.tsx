import {SignUp} from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: {
              fontSize: 14,
              textTransform: 'none',
              backgroundColor: '#87ceeb',
              '&:hover, &:focus, &:active': {
                backgroundColor: '#50cffd',
              },
            },
          },
        }}
      />
    </main>
  );
}
