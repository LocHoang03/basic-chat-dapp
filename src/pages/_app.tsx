import { ChatProvider } from '@/contexts/contract';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import LayoutApp from './layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noLayoutRoutes = ['/create-account'];
  const isNoLayoutRoute = noLayoutRoutes.includes(router.pathname);

  return (
    <ChatProvider>
      {isNoLayoutRoute ? (
        <Component {...pageProps} />
      ) : (
        <LayoutApp>
          <Component {...pageProps} />
        </LayoutApp>
      )}
    </ChatProvider>
  );
}
