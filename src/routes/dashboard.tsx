import { createFileRoute, Outlet } from '@tanstack/react-router'

const DashboardLayout = () => {
    return (
        <div className="p-6">
            <Outlet />
        </div>
    )
}

export const Route = createFileRoute('/dashboard')({
    component: DashboardLayout,
})
