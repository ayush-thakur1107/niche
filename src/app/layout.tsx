import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ClientAppWrapper } from '@/components/navigation/ClientAppWrapper';

export const metadata: Metadata = {
  title: 'Ayush Thakur — Personal Digital Universe & Life Atlas',
  description:
    'A private, visual, extensible map of one person’s knowledge, curiosity, taste, skills, ideas, experiences, creations, and evolution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientAppWrapper>{children}</ClientAppWrapper>
      </body>
    </html>
  );
}
