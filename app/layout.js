import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import MobileContactButtons from '@/components/MobileContactButtons';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only preload critical fonts
});

import { cache } from 'react';

const getSettings = cache(async () => {
  await dbConnect();
  return Settings.findOne().lean();
});

export async function generateMetadata() {
  const settings = await getSettings();

  return {
    metadataBase: new URL('https://www.guptafurniturenashik.in'),
    title: {
      default: settings?.siteName || 'Gupta Furniture | Best Furniture Services in Nashik',
      template: settings?.seo?.defaultMetaTitlePattern 
        ? settings.seo.defaultMetaTitlePattern.replace('{page}', '%s') 
        : `%s | ${settings?.siteName || 'Gupta Furniture'}`
    },
    description: settings?.seo?.defaultMetaDescription || 'Professional furniture services in Nashik. Sofa cleaning, modular kitchen, interior design, furniture repair, and more. Expert craftsmanship, affordable prices.',
    keywords: settings?.seo?.globalKeywords?.length > 0 
      ? settings.seo.globalKeywords 
      : ['furniture services nashik', 'sofa cleaning nashik', 'modular kitchen nashik', 'interior design nashik', 'furniture repair nashik', 'gupta furniture'],
    authors: [{ name: settings?.siteName || 'Gupta Furniture & Interior' }],
    creator: settings?.siteName || 'Gupta Furniture & Interior',
    publisher: settings?.siteName || 'Gupta Furniture & Interior',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: 'https://www.guptafurniturenashik.in',
      siteName: settings?.siteName || 'Gupta Furniture',
      title: settings?.siteName || 'Gupta Furniture | Best Furniture Services in Nashik',
      description: settings?.seo?.defaultMetaDescription || 'Professional furniture services in Nashik. Sofa cleaning, modular kitchen, interior design, furniture repair, and more.',
      images: [
        {
          url: settings?.seo?.ogDefaultImage || '/hero.png',
          width: 1200,
          height: 630,
          alt: `${settings?.siteName || 'Gupta Furniture'} - Premium Furniture Services`,
        }
      ],
    },
    twitter: {
      card: settings?.seo?.twitterCardType || 'summary_large_image',
      title: settings?.siteName || 'Gupta Furniture | Best Furniture Services in Nashik',
      description: settings?.seo?.defaultMetaDescription || 'Professional furniture services in Nashik. Sofa cleaning, modular kitchen, interior design, and more.',
      images: [settings?.seo?.ogDefaultImage || '/hero.png'],
      creator: settings?.seo?.twitterHandle || '',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: settings?.googleSearchConsoleCode || 'your-google-verification-code',
    },
    icons: {
      icon: settings?.favicon || '/favicon.ico',
      shortcut: settings?.favicon || '/favicon.ico',
      apple: settings?.favicon || '/apple-touch-icon.png',
    },
  };
}

export default async function RootLayout({ children }) {
  const settingsDoc = await getSettings();
  const settings = settingsDoc ? {
    ...settingsDoc,
    _id: settingsDoc._id.toString(),
    createdAt: settingsDoc.createdAt?.toISOString(),
    updatedAt: settingsDoc.updatedAt?.toISOString(),
  } : null;

  // Default theme colors if not set
  const theme = {
    primary: settings?.theme?.primaryColor || '#ff2575',
    textDark: settings?.theme?.textDark || '#1a1a1a',
    textMedium: settings?.theme?.textMedium || '#4a4a4a',
    textLight: settings?.theme?.textLight || '#6b7280',
    background: settings?.theme?.background || '#ffffff',
    surface: settings?.theme?.surface || '#f9fafb',
    border: settings?.theme?.border || '#e5e7eb',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${theme.primary};
              --primary-hover: ${theme.primary}dd;
              --text-dark: ${theme.textDark};
              --text-medium: ${theme.textMedium};
              --text-light: ${theme.textLight};
              --background: ${theme.background};
              --surface: ${theme.surface};
              --border: ${theme.border};
            }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Google Analytics */}
        {settings?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {settings?.googleTagManagerId && (
          <Script id="google-tag-manager" strategy="lazyOnload">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.googleTagManagerId}');
            `}
          </Script>
        )}

        {/* Google Tag Manager (noscript) */}
        {settings?.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Facebook Pixel */}
        {settings?.facebookPixelId && (
          <Script id="facebook-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registered:', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>

        <ClientLayout settings={settings}>
          {children}
        </ClientLayout>

        {/* Mobile Contact Buttons */}
        <MobileContactButtons 
          phoneNumber={settings?.businessPhone || '+919511641912'}
          whatsappNumber={settings?.whatsappNumber || settings?.businessPhone || '+919511641912'}
        />
      </body>
    </html>
  );
}
