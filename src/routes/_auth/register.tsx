import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Register:', { email, password })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100 p-8">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Create Account
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                    >
                        Register
                    </button>
                </form>
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
