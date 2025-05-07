import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import Projects from './components/projects';
import ProjectDetails from './components/ProjectDetails';
import NotFound from './components/NotFound';
import CreateProjectPage from "./components/createProject";
import UpdateProject from "./components/updateProject";
import StudentRegister from "./components/StudentRegister";

const API_URL = 'http://localhost:8055';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/users/me?fields=*,role.id,role.name`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed');
          return res.json();
        })
        .then(data => {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        });
    }
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.data.access_token);
      localStorage.setItem('access_token', data.data.access_token);
      return true;
    } catch (err) {
      alert('Login failed');
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return (
    <Routes>
      <Route path="/register" element={<StudentRegister onLogin={handleLogin} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/" element={token ? <Projects user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/projects" element={token ? <Projects user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/projects/:id" element={token ? <ProjectDetails token={token} /> : <Navigate to="/login" />} />
      <Route path="/projects/:id/update" element={token ? <UpdateProject token={token} /> : <Navigate to="/login" />} />
      <Route path="/create" element={token ? <CreateProjectPage token={token} /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
