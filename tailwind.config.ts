import type { Config } from 'tailwindcss'

export default {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                apple: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Display',
                    'system-ui',
                    'sans-serif',
                ],
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Display',
                    'Inter',
                    'system-ui',
                    'sans-serif',
                ],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                'sorare-blue': 'hsl(var(--sorare-blue))',
                'sorare-orange': 'hsl(var(--sorare-orange))',
                'sorare-green': 'hsl(var(--sorare-green))',
                'sorare-purple': 'hsl(var(--sorare-purple))',
                'sorare-teal': 'hsl(var(--sorare-teal))',
                'sorare-red': 'hsl(var(--sorare-red))',
                'button-hover': 'hsl(var(--button-hover))',
                'purple-500': 'hsl(var(--purple-500))',
                'pink-500': 'hsl(var(--pink-500))',
                'blue-500': 'hsl(var(--blue-500))',
                'slate-500': 'hsl(var(--slate-500))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground':
                        'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground':
                        'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
                'sports-field': 'hsl(var(--sports-field))',
                'sports-field-light': 'hsl(var(--sports-field-light))',
                'sports-field-dark': 'hsl(var(--sports-field-dark))',
                'sports-energy': 'hsl(var(--sports-energy))',
                'sports-victory': 'hsl(var(--sports-victory))',
                'sports-stadium': 'hsl(var(--sports-stadium))',
            },
            backgroundImage: {
                'gradient-dynamic': 'var(--gradient-bg)',
                'apple-blue': 'var(--apple-gradient-blue)',
                'apple-gray': 'var(--apple-gradient-gray)',
                'apple-hero': 'var(--apple-gradient-hero)',
            },
            boxShadow: {
                'apple-sm': 'var(--shadow-sm)',
                apple: 'var(--shadow)',
                'apple-md': 'var(--shadow-md)',
                'apple-lg': 'var(--shadow-lg)',
                'apple-xl': 'var(--shadow-xl)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
                'fade-in': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out forwards',
            },
        },
    },
    plugins: [],
} satisfies Config
