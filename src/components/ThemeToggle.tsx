import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // Check localStorage first, then HTML class, then default to dark
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (savedTheme) {
            return savedTheme
        }
        const root = document.documentElement
        return root.classList.contains('dark') ? 'dark' : 'light'
    })

    // Load theme from localStorage on mount and apply it
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        const root = document.documentElement
        
        if (savedTheme) {
            if (savedTheme === 'dark') {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
            setTheme(savedTheme)
        } else {
            // If no saved theme, check current HTML class
            const currentTheme = root.classList.contains('dark') ? 'dark' : 'light'
            setTheme(currentTheme)
            localStorage.setItem('theme', currentTheme)
        }
    }, [])

    const toggleTheme = () => {
        const root = document.documentElement
        const newTheme = theme === 'light' ? 'dark' : 'light'
        
        if (newTheme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        
        setTheme(newTheme)
        // Store preference in localStorage
        localStorage.setItem('theme', newTheme)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </Button>
    )
}

