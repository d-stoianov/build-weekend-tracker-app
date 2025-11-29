import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface RouterContext {
    isAuthorized: boolean
}

const RootLayout = () => (
    <>
        <Outlet />
    </>
)

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
})
