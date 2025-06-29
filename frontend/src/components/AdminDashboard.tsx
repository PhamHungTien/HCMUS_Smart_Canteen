import React, { useEffect, useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [menu, setMenu] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(setMenu);
  }, []);

  return (
    <div>
      <h2>Quản lí thực đơn</h2>
      <ul>
        {menu.map(item => (
          <li key={item.id}>{item.name} - {item.price}đ</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
