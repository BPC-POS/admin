// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';

const poppins = localFont({
  src: [
    {
      path: '../../public/fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
     {
      path: '../../public/fonts/Poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
      {
      path: '../../public/fonts/Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap'
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
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  );
}