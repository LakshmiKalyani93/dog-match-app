import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login'
import SearchPage from './pages/SearchPage';

const App: React.FC = () => {

  const [isAuthenticated, setIsAutheticated] = useState(false)

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          !isAuthenticated ? (<Login onLogin={() => setIsAutheticated(true)} />) : (<SearchPage />)
        } />
      </Routes>
    </Router>
  )
}

export default App;
