import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://kelselyay.com'),
  title: {
    default: 'Kel Sel Yay',
    template: '%s | Kel Sel Yay',
  },
  description:
    'A live map to find missing people after the 2025 Myanmar Earthquake. Friends and families can safely and accurately report victims.',
  keywords: ['Kel Sel Yay', 'Myanmar', 'Earthquake'],
  icons: [
    { rel: 'icon', url: '/favicon.png', sizes: '32x32', type: 'image/png' },
  ],
  openGraph: {
    title: 'Kel Sel Yay - Missing People Map',
    description:
      'Live map to locate missing people after the 2025 Myanmar Earthquake. Reports are secure.',
    url: 'https://kelselyay.com/',
    siteName: 'Kel Sel Yay',
    images: [
      {
        url: '/preview.png',
        width: 650,
        height: 488,
        alt: 'Kel Sel Yay Preview Image',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kel Sel Yay - Missing People Map',
    description:
      'Live map to locate missing people after the 2025 Myanmar Earthquake. Reports are secure.',
    images: [
      'https://kelselyay.com/preview.png', // use your hosted image, not a Google Drive share link
    ],
  },
  alternates: {
    canonical: 'https://kelselyay.com/',
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <!-- Google tag (gtag.js) --> */}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4QEMBKQBTJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4QEMBKQBTJ');
          `}
        </Script>
        <LanguageProvider>
            {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
