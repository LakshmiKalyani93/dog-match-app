import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvier: React.FC<AuthProviderProps> = ({ children }) => {

    const [isAuthenticated, setIsAutheticated] = useState(false)
    const login = () => setIsAutheticated(true)
    const logout = () => setIsAutheticated(false)
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
}