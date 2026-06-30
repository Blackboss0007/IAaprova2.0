import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Page =
  | 'login' | 'register' | 'onboarding'
  | 'dashboard' | 'mentor' | 'cronograma' | 'simulados'
  | 'pomodoro' | 'mapa-aprovacao' | 'perfil' | 'configuracoes'
  | 'sala-de-guerra' | 'templates' | 'diagnostico';

interface RouterCtx { page: Page; navigate: (p: Page) => void; }
const RouterContext = createContext<RouterCtx | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('login');
  return (
    <RouterContext.Provider value={{ page, navigate: setPage }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter outside RouterProvider');
  return ctx;
}
