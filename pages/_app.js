import '../styles/globals.css';

import withTwindApp from '@twind/next/shim/app';

import twindConfig from '../twind.config';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default withTwindApp(twindConfig, MyApp);
