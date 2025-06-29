import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      alert('Sai thông tin đăng nhập');
    }
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<LoginPage onLogin={login} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {user.role === 'admin' ? (
          <Route path="/*" element={<AdminDashboard />} />
        ) : (
          <Route path="/*" element={<UserDashboard username={user.username} />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
