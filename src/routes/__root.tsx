import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { MainNavigation } from '@/components/MainNavigation'

interface RouterContext {
    isAuthorized: boolean
}

const RootComponent = () => {
    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <MainNavigation />
            <div className="flex-1 overflow-auto pt-20">
                <Outlet />
            </div>
        </div>
    )
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootComponent,
})
