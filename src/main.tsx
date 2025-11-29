import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { UserStatus } from '@/types/user'

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root') as HTMLElement)

const router = createRouter({
    routeTree,
    context: {
        isAuthorized: false,
    },
})

const AppWithRouterProvider = () => {
    const [userStatus, setUserStatus] = useState<UserStatus>('initializing')

    useEffect(() => {
        // Simulate async fetch (e.g., check auth token)
        const timer = setTimeout(() => {
            setUserStatus('anonymous')
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (userStatus === 'initializing') {
        return (
            <div className="w-full h-full flex justify-center items-center">
                Loading...
            </div>
        )
    }

    return (
        <RouterProvider
            context={{
                isAuthorized: userStatus === 'loggedIn',
            }}
            notFoundMode={'root'}
            router={router}
        />
    )
}

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppWithRouterProvider />
        </QueryClientProvider>
    </StrictMode>
)
