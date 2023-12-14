import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {ClerkProvider} from '@clerk/nextjs';
import {ToastProvider} from '@/components/providers/toaster-provider';
import {ConfettiProvider} from '@/components/providers/confetti-provider';
import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from '@vercel/speed-insights/next';
const inter = Inter({subsets: ['latin']});
import {ThemeProvider} from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'meyoneducation',
  description: 'Here we provide course for all sort of medical students',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            {children}
            <Analytics />
            <SpeedInsights />
            <ConfettiProvider />
            <ToastProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
