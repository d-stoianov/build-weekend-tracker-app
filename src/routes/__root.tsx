import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface RouterContext {
    isAuthorized: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: Outlet,
})
