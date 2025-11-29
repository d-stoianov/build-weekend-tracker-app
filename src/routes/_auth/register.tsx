import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import * as Label from '@radix-ui/react-label'

const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const { register } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        try {
            await register(email, password)
            // Redirect to dashboard or login page after successful registration
            router.navigate({ to: '/dashboard' })
        } catch (err: any) {
            setError(err.message || 'Registration failed')
        }
    }

    return (
        <div className="flex items-center justify-center h-full bg-background py-8 px-4">
            <div className="w-full max-w-md shadow-2xl bg-card/95 backdrop-blur-sm rounded-xl p-10 border border-border/50">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign up to get started
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
                            name={'email'}
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
                            name={'password'}
                            type="password"
                            placeholder="Create a password"
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
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary font-semibold hover:underline transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/_auth/register')({
    component: RegisterPage,
})
