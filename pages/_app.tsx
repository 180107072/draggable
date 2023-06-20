import {DefaultSeo} from "#/core/components/SEO/default";
import {TransformBridgeProvider} from "#/core/context/transform-bridge-context";
import {Layout, Wrapper} from "#/core/layout";
import "#/styles/globals.scss";
import type {AppProps} from "next/app";
import Head from "next/head";

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo />
      <TransformBridgeProvider>
        <Wrapper />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TransformBridgeProvider>
    </>
  );
}
