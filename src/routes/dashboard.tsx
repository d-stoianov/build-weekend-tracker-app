import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'

const DashboardLayout = () => {
    const { logout, user } = useAuth()
    const router = useRouter()

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <p>Logged in as {user?.email}</p>
            </div>
            <button
                onClick={async () => {
                    await logout()
                    router.navigate({ to: '/' })
                }}
                className={'btn'}
            >
                logout
            </button>
        </div>
    )
}

export const Route = createFileRoute('/dashboard')({
    component: DashboardLayout,
})
