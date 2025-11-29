import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

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
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100 p-8">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        name={'email'}
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        name={'password'}
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                    >
                        Register
                    </button>
                </form>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/_auth/register')({
    component: RegisterPage,
})
