import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Header from '../components/Header'
import { queryClient } from '../lib/query-client'

export const Route = createRootRoute({
  notFoundComponent: () => {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Strona nie znaleziona</h2>
          <p className="text-muted-foreground">
            Przepraszamy, ale strona której szukasz nie istnieje.
          </p>
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    );
  },

  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}
