import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import googleIcon from '@/assets/google-icon.png'
import React, { useState } from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login:', { email, password })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100 p-8">
                <p className="text-xl text-center mb-6 text-blue-700">
                    Please log in to your account
                </p>
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
                        Login
                    </button>
                </form>
                <button className={`btn btn-outline`} onClick={() => {}}>
                    <img
                        src={googleIcon}
                        alt="Google"
                        className="w-5 h-5 mr-2 inline"
                    />
                    Sign in with Google
                </button>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account yet?{' '}
                    <Link
                        to="/register"
                        className="text-primary font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/_auth/login')({
    component: LoginPage,
})
