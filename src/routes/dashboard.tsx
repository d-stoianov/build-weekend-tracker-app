import { createFileRoute, Outlet } from '@tanstack/react-router'

const DashboardLayout = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-foreground">
                Dashboard
            </h1>

            <Outlet />
        </div>
    )
}

export const Route = createFileRoute('/dashboard')({
    component: DashboardLayout,
})
