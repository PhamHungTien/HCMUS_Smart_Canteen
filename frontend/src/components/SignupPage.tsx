import React, { useState } from 'react';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    alert('Đăng ký thành công');
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        register();
      }}
    >
      <h2>Tạo tài khoản</h2>
      <div>
        <input placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Đăng ký</button>
    </form>
  );
};

export default SignupPage;
