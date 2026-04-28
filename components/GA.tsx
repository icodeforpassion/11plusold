'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GTAG_ID || process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GA() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || !pathname) return;
    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    window.gtag?.('config', GA_ID, {
      page_path: pagePath
    });
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname + window.location.search,
          });
        `}
      </Script>
    </>
  );
}
