import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {ClerkProvider} from '@clerk/nextjs';
import {ToastProvider} from '@/components/providers/toaster-provider';
import {ConfettiProvider} from '@/components/providers/confetti-provider';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/react';
import {ThemeProvider} from '@/components/theme-provider';
import GoogleAnalytics from '@bradgarropy/next-google-analytics';

const inter = Inter({subsets: ['latin']});
// Config for pwa
const APP_NAME = 'meyoneducation';
const APP_DEFAULT_TITLE = 'meyoneducation - Online Medical Courses';
const APP_TITLE_TEMPLATE = '%s - meyoneducation';
const APP_DESCRIPTION =
  'Explore a variety of online courses for medical students at meyoneducation. Enhance your medical education with our comprehensive programs.';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://meyoneducation.vercel.app/'),
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: 'https://meyoneducation.vercel.app/',
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
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
          </ThemeProvider>
          <Analytics mode={'production'} />;
          <SpeedInsights />
          <ConfettiProvider />
          <ToastProvider />
        </body>
        <GoogleAnalytics
          measurementId={process.env.GOOGLE_ANALYTICS_ID! || ''}
        />
      </html>
    </ClerkProvider>
  );
}
