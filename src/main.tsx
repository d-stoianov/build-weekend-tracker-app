import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { AuthProvider, useAuth } from '@/providers/AuthProvider'

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root') as HTMLElement)

const router = createRouter({
    routeTree,
    context: {
        isAuthorized: false,
    },
})

const AppWithRouterProvider = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                Loading...
            </div>
        )
    }

    return (
        <RouterProvider
            context={{
                isAuthorized: user !== null && user !== undefined,
            }}
            notFoundMode={'root'}
            router={router}
        />
    )
}

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppWithRouterProvider />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
)
