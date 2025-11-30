import { useRouter, Link } from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

export const MainNavigation = () => {
    const { logout, user } = useAuth()
    const router = useRouter()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    <Link
                        to="/"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <span className="text-2xl font-bold text-foreground">
                            Notifyer Me
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {user && (
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <Button variant="ghost" size="lg">
                                        {user.email || 'User'}
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        className="min-w-[200px] bg-card rounded-lg shadow-lg p-2 z-50 border border-border"
                                        sideOffset={5}
                                    >
                                        <DropdownMenu.Item className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer outline-none">
                                            Account Settings
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Separator className="h-px bg-border my-1" />
                                        <DropdownMenu.Item
                                            className="px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer outline-none"
                                            onClick={async () => {
                                                await logout()
                                                router.navigate({ to: '/' })
                                            }}
                                        >
                                            Logout
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
