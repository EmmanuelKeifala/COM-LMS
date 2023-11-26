import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {ClerkProvider} from '@clerk/nextjs';
import {ToastProvider} from '@/components/providers/toaster-provider';
import {ConfettiProvider} from '@/components/providers/confetti-provider';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Course System',
  description: 'Here we provide course for all sort of medical students',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <ConfettiProvider />
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
