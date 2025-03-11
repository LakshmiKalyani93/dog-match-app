import React, { useState } from 'react'
import { login } from '../../api/api'
import './Login.css'

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(name, email)
            onLogin()
            setError(null)
        } catch (error) {
            setError('Login Failed, Please check your name and email.')
            console.log('Login Failed: ', error)
        }
    }
    return (
        <div className='login-container'>
        <form onSubmit={handleSubmit} className='login-form'>
        <input type='text' placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <button type='submit'>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        </div>
        )
}

export default Login