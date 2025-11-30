import { API_URL } from '@/config'
import { supabase } from '@/providers/supabase'

async function getAuthHeaders(): Promise<HeadersInit> {
    // Get the current session
    let { data, error } = await supabase.auth.getSession()

    // If session is expired or missing, try to refresh it
    if (error || !data.session) {
        const refreshResult = await supabase.auth.refreshSession()
        if (refreshResult.data.session) {
            data = refreshResult.data
        }
    } else if (data.session) {
        // Check if token is about to expire (within 5 minutes)
        const expiresAt = data.session.expires_at
        if (expiresAt) {
            const expiresIn = expiresAt - Math.floor(Date.now() / 1000)
            // Refresh if token expires in less than 5 minutes
            if (expiresIn < 300) {
                const refreshResult = await supabase.auth.refreshSession()
                if (refreshResult.data.session) {
                    data = refreshResult.data
                }
            }
        }
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (data.session?.access_token) {
        headers['Authorization'] = `Bearer ${data.session.access_token}`
    }

    return headers
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = await getAuthHeaders()

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`,
        }))
        throw new Error(error.message || 'API request failed')
    }

    // Handle empty responses (e.g., DELETE requests that return 204 No Content)
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
        // If there's no content or it's not JSON, return undefined (cast to T)
        return undefined as T
    }

    // Check if response has content
    const text = await response.text()
    if (!text) {
        return undefined as T
    }

    try {
        return JSON.parse(text)
    } catch {
        // If parsing fails, return undefined
        return undefined as T
    }
}

export const api = {
    get: <T>(endpoint: string): Promise<T> => {
        return apiRequest<T>(endpoint, { method: 'GET' })
    },

    post: <T>(endpoint: string, data?: unknown): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        })
    },

    put: <T>(endpoint: string, data?: unknown): Promise<T> => {
        return apiRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        })
    },

    delete: <T>(endpoint: string): Promise<T> => {
        return apiRequest<T>(endpoint, { method: 'DELETE' })
    },
}
