import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import googleIcon from '@/assets/google-icon.png'
import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { API_URL } from '@/config'
import * as Label from '@radix-ui/react-label'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            await login(email, password)
            router.navigate({ to: '/dashboard' })
        } catch (err: any) {
            setError(err.message || 'Login failed')
        }
    }

    const loginWithGoogle = () => {
        // Redirect to your backend Google OAuth route
        window.location.href = `${API_URL}/auth/google`
    }

    return (
        <div className="flex items-center justify-center h-full bg-background py-8 px-4">
            <div className="w-full max-w-md shadow-2xl bg-card/95 backdrop-blur-sm rounded-xl p-10 border border-border/50">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Please log in to your account
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label.Root
                            htmlFor="email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email
                        </Label.Root>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label.Root
                            htmlFor="password"
                            className="text-sm font-medium text-foreground"
                        >
                            Password
                        </Label.Root>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-destructive text-sm">{error}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full mt-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-90 dark:hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg shadow-primary/20"
                    >
                        Login
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <button
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground font-medium hover:bg-accent hover:text-accent-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2"
                    onClick={loginWithGoogle}
                >
                    <img
                        src={googleIcon}
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Sign in with Google
                </button>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-primary font-semibold hover:underline transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/_auth/login')({
    component: LoginPage,
})
