import {Html, Head, Main, NextScript} from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </Head>

      <body>
        <Script src="/sw.js" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
