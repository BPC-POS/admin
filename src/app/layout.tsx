import type { Metadata } from 'next';
import './globals.css';
import { Poppins, Roboto, Montserrat } from 'next/font/google';
import ServiceWorkerRegistration from '@/components/admin/notify/ServiceWorkerRegistration';
import FirebaseMessagingListener from '@/components/admin/notify/FirebaseMessagingListener';
import { NotificationProvider } from '@/context/NotificationContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'My Coffee App',
  description: 'My Coffee App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.className} ${roboto.className} ${montserrat.className}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:wght@400;600;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NotificationProvider>
          <FirebaseMessagingListener />
          {children}
          <ServiceWorkerRegistration />
        </NotificationProvider>
      </body>
    </html>
  );
}