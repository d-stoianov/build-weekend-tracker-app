import React from 'react'

import googleIcon from '@/assets/google-icon.png'

interface AuthButtonProps {
    type?: 'login' | 'register' | 'google'
    onClick?: () => void
}

export const AuthButton: React.FC<AuthButtonProps> = ({
    type = 'login',
    onClick,
}) => {
    const baseStyle = 'btn w-full max-w-xs mb-4'

    switch (type) {
        case 'register':
            return (
                <button
                    className={`${baseStyle} btn-primary`}
                    onClick={onClick}
                >
                    Register
                </button>
            )
        case 'google':
            return (
                <button
                    className={`${baseStyle} btn-outline`}
                    onClick={onClick}
                >
                    <img
                        src={googleIcon}
                        alt="Google"
                        className="w-5 h-5 mr-2 inline"
                    />
                    Sign in with Google
                </button>
            )
        default:
            return (
                <button
                    className={`${baseStyle} btn-secondary`}
                    onClick={onClick}
                >
                    Login
                </button>
            )
    }
}
