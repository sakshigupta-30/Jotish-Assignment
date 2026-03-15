import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { isAuthenticated, login } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    if (isAuthenticated) return <Navigate to="/list" replace />

    function handleSubmit(e) {
        e.preventDefault()
        setError('')
        const success = login(username, password)
        if (success) {
            navigate('/list')
        } else {
            setError('Invalid credentials. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Sign in</h1>
                <p className="text-sm text-[#6b7280] mb-8">Enter your credentials to continue</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[#374151] mb-1.5">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoFocus
                            autoComplete="username"
                            className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-md bg-white outline-none transition-colors focus:border-[#4a6cf7] focus:ring-1 focus:ring-[#4a6cf7]"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-md bg-white outline-none transition-colors focus:border-[#4a6cf7] focus:ring-1 focus:ring-[#4a6cf7]"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-[#dc2626]">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-md transition-colors hover:bg-[#333] active:bg-[#111] cursor-pointer"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}
