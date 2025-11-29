import { createFileRoute } from '@tanstack/react-router'

const LoginPage = () => {
    return <div className={'text-4xl'}>Please login</div>
}

export const Route = createFileRoute('/_auth/login')({
    component: LoginPage,
})
