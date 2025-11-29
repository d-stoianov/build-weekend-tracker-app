import {
    createFileRoute,
    Link,
    Outlet,
    useRouter,
} from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'

const DashboardLayout = () => {
    const { logout, user } = useAuth()
    const router = useRouter()

    return (
        <div className="min-h-screen bg-base-200">
            <div className="navbar bg-primary text-primary-content shadow-xl">
                <div className="flex-1">
                    <Link
                        to={'/'}
                        className="p-3 text-2xl font-bold normal-case hover:opacity-80 transition-opacity"
                    >
                        Let Me Know 😉
                    </Link>
                </div>
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn ">
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-sm">
                                    {user?.email || 'User'}
                                </span>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-neutral"
                        >
                            <li>
                                <a>Account Settings</a>
                            </li>
                            <li>
                                <a
                                    onClick={async () => {
                                        await logout()
                                        router.navigate({ to: '/' })
                                    }}
                                    className="text-error"
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h1 className="text-3xl font-extrabold mb-8 text-neutral">
                    Dashboard
                </h1>

                <Outlet />
            </div>
        </div>
    )
}

export const Route = createFileRoute('/dashboard')({
    component: DashboardLayout,
})
