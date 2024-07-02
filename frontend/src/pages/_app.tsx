/* eslint-disable @next/next/no-sync-scripts */
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import Head from 'next/head';

import { PersistGate } from 'redux-persist/integration/react';

//Own files.
import { persistor, store } from '@/redux/store';
import MessageSnackbar from '@/components/MessageSnackbar';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <MessageSnackbar />
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <meta charSet='utf-8' />
          <title>Study Planner</title>
          <meta name='viewport' content='width=device-width, inital-scale=1'/>
          <link 
            href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css'
            rel='stylesheet' 
            integrity='sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD'
            crossOrigin='anonymous'
          ></link>
          <script 
            src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js' 
            integrity='sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN' 
            crossOrigin='anonymous'
          ></script>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
