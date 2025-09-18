"use client";

import { Provider } from 'react-redux';
import { persistor, store } from '@/app/state/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/state/store';
import { usePathname } from 'next/navigation';
import Header from './header';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  console.log(pathname);
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/shop/");

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {!isAdmin && <Header />}
        {children}
      </PersistGate>
    </Provider>
  );
}

// Sync <html> lang and dir with Redux language
export function LanguageHtml() {
  const lang = useSelector((s: RootState) => s.lang.code);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('lang', lang);
    }
  }, [lang]);
  return null;
}
