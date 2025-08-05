import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { LazyMotion, domAnimation } from "framer-motion";
import type { Session } from "next-auth";
import Head from "next/head";
import "@/styles/globals.css";

type AppPropsWithAuth = AppProps & {
  pageProps: {
    session?: Session;
  };
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <>
      {/* Global SEO & Performance */}
      <Head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />

        {/* Preconnect for critical resources */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Performance meta */}
        <meta name="format-detection" content="telephone=no" />
      </Head>

      <SessionProvider session={session}>
        <LazyMotion features={domAnimation}>
          <Component {...pageProps} />
        </LazyMotion>
      </SessionProvider>
    </>
  );
}
