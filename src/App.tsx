import SignUp from './pages/signup'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import HomePage from './pages/homepage';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <Routes>
      <Route element={<SignUp token={token} setToken={setToken} />} path="/signup" />
      <Route element={<Login token={token} setToken={setToken} />} path="/login" />
      <Route element={<HomePage token={token} setToken={setToken} />} path="/" />
    </Routes>
  )
}

export default App
