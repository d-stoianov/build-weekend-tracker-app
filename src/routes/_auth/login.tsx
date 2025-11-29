import { createFileRoute } from '@tanstack/react-router'
import { AuthButton } from '@/components/AuthButton'

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AuthButton
                type="login"
                onClick={() => console.log('Login clicked')}
            />
            <AuthButton
                type="google"
                onClick={() => console.log('Google login')}
            />
        </div>
    )
}

export const Route = createFileRoute('/_auth/login')({
    component: LoginPage,
})
