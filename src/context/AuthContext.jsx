import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'employee_dashboard_session'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem(SESSION_KEY)
        if (stored) {
            try {
                setUser(JSON.parse(stored))
            } catch {
                localStorage.removeItem(SESSION_KEY)
            }
        }
        setLoading(false)
    }, [])

    function login(username, password) {
        if (
            username === import.meta.env.VITE_AUTH_USERNAME &&
            password === import.meta.env.VITE_AUTH_PASSWORD
        ) {
            const session = { username, authenticatedAt: Date.now() }
            setUser(session)
            localStorage.setItem(SESSION_KEY, JSON.stringify(session))
            return true
        }
        return false
    }

    function logout() {
        setUser(null)
        localStorage.removeItem(SESSION_KEY)
    }

    if (loading) return null

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
