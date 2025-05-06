// import "./App.css";
// import { Route, Routes } from "react-router-dom";
// import Home from "./components/home";
// import AboutUs from "./components/about";
// import AuthProfile from "./components/authProfile";
// import Dashboard from "./components/dashboard";

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route exact path="/" element={<Home />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/auth" element={<AuthProfile />} />
//         <Route path="/projects" element={<Dashboard />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import Projects from './components/projects';
import ProjectDetails from './components/ProjectDetails';
import NotFound from './components/NotFound';
import CreateProjectPage from "./components/createProject";

const API_URL = 'http://localhost:8055';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('access_token');
        });
    }
  }, [token]);

  // const handleLogin = async (email, password) => {
  //   try {
  //     const res = await fetch(`${API_URL}/auth/login`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password })
  //     });

  //     if (!res.ok) throw new Error('Login failed');
  //     const data = await res.json();
  //     setToken(data.data.access_token);
  //     localStorage.setItem('access_token', data.data.access_token);
  //   } catch (err) {
  //     alert('Login failed');
  //   }
  // };

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
      return true; // ✅ success
    } catch (err) {
      alert('Login failed');
      return false; // ✅ failure
    }
  };


  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    // <Router>
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/projects" element={token ? <Projects user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/projects/:id" element={token ? <ProjectDetails token={token} /> : <Navigate to="/login" />} />
      <Route path="/create" element={token ? <CreateProjectPage token={token} /> : <Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    // </Router>
  );
}

export default App;