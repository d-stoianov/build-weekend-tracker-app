import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/providers/supabase'
import { API_URL } from '@/config'

const AuthCallbackPage = () => {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the session from the URL hash
                const { data, error: authError } = await supabase.auth.getSession()

                if (authError) {
                    throw authError
                }

                if (data.session) {
                    // Create or get user in backend
                    try {
                        const userResponse = await fetch(API_URL + '/user', {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${data.session.access_token}`,
                                'Content-Type': 'application/json',
                            },
                        })

                        // If user doesn't exist, create it
                        if (userResponse.status === 404) {
                            await fetch(API_URL + '/user', {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${data.session.access_token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ email: data.session.user.email }),
                            })
                        }
                    } catch (err) {
                        console.error('Error creating user:', err)
                        // Continue anyway - user might already exist
                    }

                    // Redirect to dashboard
                    router.navigate({ to: '/dashboard' })
                } else {
                    setError('No session found')
                    setTimeout(() => {
                        router.navigate({ to: '/login' })
                    }, 2000)
                }
            } catch (err: any) {
                console.error('Auth callback error:', err)
                setError(err.message || 'Authentication failed')
                setTimeout(() => {
                    router.navigate({ to: '/login' })
                }, 2000)
            }
        }

        handleAuthCallback()
    }, [router])

    return (
        <div className="flex items-center justify-center h-full bg-background py-8 px-4">
            <div className="w-full max-w-md shadow-2xl bg-card/95 backdrop-blur-sm rounded-xl p-10 border border-border/50 text-center">
                {error ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-destructive">
                            Authentication Error
                        </h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <p className="text-sm text-muted-foreground">
                            Redirecting to login...
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold mb-2">Completing sign in...</h2>
                        <p className="text-muted-foreground">
                            Please wait while we finish setting up your account.
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export const Route = createFileRoute('/_auth/callback')({
    component: AuthCallbackPage,
})
