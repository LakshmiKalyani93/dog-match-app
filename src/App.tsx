import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login'
import SearchPage from './pages/SearchPage';

const App: React.FC = () => {

  const [isAuthenticated, setIsAutheticated] = useState(false)

  const handleLogin = () => {
    setIsAutheticated(true)
  }

  const handleLogout = () => {
    setIsAutheticated(false)
  }

  return (
    <Router>
      <Routes>
        <Route path='/login' element={
          isAuthenticated ? (<Navigate to='/search-dogs' />) : (<Login onLogin={handleLogin} />)
        } />
        <Route path='/search-dogs' element={
          isAuthenticated ? (<SearchPage onLogout={handleLogout} />) : (<Navigate to='/login' />)
        } />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  )
}

export default App;
