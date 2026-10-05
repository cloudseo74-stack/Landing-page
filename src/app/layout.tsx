import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'Taxi Service in Ranchi | Ganpati Travel Solutions',
  description: 'Book local taxis, airport transfers, outstation cabs and sightseeing travel with Ganpati Travel Solutions in Ranchi. Call or enquire directly on WhatsApp.',
  icons: { icon: '/images/logo.png' },
  openGraph: { title: 'Your Ride, Your Way. | Ganpati Travel Solutions', description: 'Local, airport, outstation and sightseeing taxi enquiries in Ranchi.', ...(siteUrl ? { images: [{ url: '/images/hero-taxi.webp', width: 1536, height: 1024 }] } : {}) },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={manrope.variable}>{children}</body></html>;
}
