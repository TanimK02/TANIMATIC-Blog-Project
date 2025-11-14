import React, { useState } from 'react'
import { useAuth } from '../components/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        if (!username || !password) {
            setError('Please enter username and password')
            return
        }
        setSubmitting(true)
        const ok = await login({ username, password })
        setSubmitting(false)
        if (ok) navigate('/')
        else setError('Invalid credentials')
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit} className="stack">
                {error && <div className="meta" style={{ color: 'crimson' }}>{error}</div>}
                <label>
                    <div className="meta">Username</div>
                    <input className="input" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    <div className="meta">Password</div>
                    <input className="input" type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button className="btn primary" type='submit' disabled={submitting}>{submitting ? 'Logging in…' : 'Login'}</button>
            </form>
        </div>
    )
}
