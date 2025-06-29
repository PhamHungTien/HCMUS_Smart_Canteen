import React, { useState } from 'react';

interface Props {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onLogin(username, password);
      }}
    >
      <h2>Đăng nhập</h2>
      <div>
        <input placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default LoginPage;
