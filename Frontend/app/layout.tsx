import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yappers',
  description: 'AI study companion for planning, focus, and support.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
