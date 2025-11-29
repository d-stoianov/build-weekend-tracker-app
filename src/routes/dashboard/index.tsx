import { createFileRoute, redirect } from '@tanstack/react-router'

function RouteComponent() {
    return <div>Hello from authorized route</div>
}

export const Route = createFileRoute('/dashboard/')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        if (!context.isAuthorized) {
            throw redirect({ to: '/login' })
        }
    },
})
