import { createFileRoute, redirect } from '@tanstack/react-router'

const LandingPage = () => {
    return <div className={'font-4xl'}>You are logged in</div>
}

export const Route = createFileRoute('/')({
    beforeLoad: ({ context }) => {
        if (!context.isAuthorized) {
            throw redirect({ to: '/login' })
        }
    },
    component: LandingPage,
})
