import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { supabase } from '@/providers/supabase'
import { API_URL } from '@/config'

interface UserProfile {
    id: string
    email: string
}

interface AuthContextType {
    user: UserProfile | null
    loading: boolean
    login: (email: string, password: string) => Promise<UserProfile | null>
    register: (email: string, password: string) => Promise<UserProfile | null>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
                const userResponse = await fetch(API_URL + '/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${data.session.access_token}`,
                        'Content-Type': 'application/json',
                    },
                })

                const userData = await userResponse.json()

                console.log('userData', userData)
                setUser({
                    id: data.session.user.id,
                    email: data.session.user.email!,
                })
            }
            setLoading(false)
        }

        getUser()

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
                    if (session?.user) {
                        setUser({ id: session.user.id, email: session.user.email! })
                    } else {
                        setUser(null)
                    }
                } else if (session?.user) {
                    setUser({ id: session.user.id, email: session.user.email! })
                } else {
                    setUser(null)
                }
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        if (data && data.user && data.session) {
            const userResponse = await fetch(API_URL + '/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.session.access_token}`,
                    'Content-Type': 'application/json',
                },
            })

            const userData = await userResponse.json()

            console.log(userData)

            setUser({ id: data.user.id, email: data.user.email! })
            return { id: data.user.id, email: data.user.email! }
        }
        return null
    }

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data && data.user && data.session) {
            setUser({ id: data.user.id, email: data.user.email! })

            const userResponse = await fetch(API_URL + '/user', {
                method: 'POST', // or PUT if updating
                headers: {
                    Authorization: `Bearer ${data.session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const userData = await userResponse.json()

            console.log(userData)

            return { id: data.user.id, email: data.user.email! }
        }

        return null
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
