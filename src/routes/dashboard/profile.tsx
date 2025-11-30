import {
    createFileRoute,
    useRouter,
    Link,
    redirect,
} from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Trash2, LogOut } from 'lucide-react'
import * as Label from '@radix-ui/react-label'

const ProfilePage = () => {
    const { user, logout, deleteUser } = useAuth()
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteUser = async () => {
        setIsDeleting(true)
        try {
            await deleteUser()
            setShowDeleteDialog(false)
            router.navigate({ to: '/' })
        } catch (error) {
            console.error('Failed to delete user:', error)
            setIsDeleting(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            router.navigate({ to: '/' })
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Account Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="space-y-6">
                {/* Account Information Card */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Account Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <Label.Root className="text-sm font-medium text-muted-foreground">
                                Email
                            </Label.Root>
                            <p className="text-foreground mt-1">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Actions Card */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Actions
                    </h2>
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Logout
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full justify-start gap-2"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 size={18} />
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? This
                            action cannot be undone and will permanently delete
                            all your data, trackers, and history.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const Route = createFileRoute('/dashboard/profile')({
    component: ProfilePage,
    beforeLoad: ({ context }) => {
        if (!context.isAuthorized) {
            throw redirect({ to: '/login' })
        }
    },
})

