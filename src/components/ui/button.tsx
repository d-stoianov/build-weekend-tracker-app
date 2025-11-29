import * as React from 'react'
import * as Slot from '@radix-ui/react-slot'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'default' | 'ghost' | 'outline' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'default',
            size = 'md',
            asChild = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot.Root : 'button'
        return (
            <Comp
                className={clsx(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-primary text-primary-foreground hover:bg-button-hover':
                            variant === 'default',
                        'hover:bg-accent hover:text-accent-foreground':
                            variant === 'ghost',
                        'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
                            variant === 'outline',
                        'bg-destructive text-destructive-foreground hover:bg-destructive/90':
                            variant === 'destructive',
                        'h-8 px-3 text-sm': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6 text-base': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }
