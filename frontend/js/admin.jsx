const { useState, useEffect } = React;

function AdminApp() {
  const [auth, setAuth] = useState(localStorage.getItem('auth') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });

  useEffect(() => { if (auth) refreshData(); }, [auth]);

  function login(e) {
    e.preventDefault();
    const token = btoa(`${username}:${password}`);
    fetch('/menu', { headers: { Authorization: 'Basic ' + token } })
      .then(res => {
        if (res.status === 200) {
          localStorage.setItem('auth', token);
          setAuth(token);
          showToast('Đăng nhập thành công');
        } else {
          showToast('Sai thông tin đăng nhập');
        }
      });
  }

  function refreshData() {
    fetch('/menu').then(r => r.json()).then(setMenu);
    fetch('/orders', { headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json())
      .then(setOrders);
  }

  function addItem() {
    if (!newItem.name || !newItem.price) { showToast('Thiếu thông tin'); return; }
    fetch('/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + auth },
      body: JSON.stringify({ name: newItem.name, price: parseInt(newItem.price, 10), category: newItem.category || 'Món ăn' })
    }).then(r => r.json()).then(() => {
      setNewItem({ name: '', price: '', category: '' });
      refreshData();
    });
  }

  function updateItem(id, updates) {
    fetch(`/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + auth },
      body: JSON.stringify(updates)
    }).then(r => r.json()).then(refreshData);
  }

  function deleteItem(id) {
    fetch(`/menu/${id}`, { method: 'DELETE', headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json()).then(refreshData);
  }

  function updateOrder(id, status) {
    fetch(`/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + auth },
      body: JSON.stringify({ status })
    }).then(r => r.json()).then(refreshData);
  }

  function deleteOrder(id) {
    fetch(`/orders/${id}`, { method: 'DELETE', headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json()).then(refreshData);
  }

  if (!auth) {
    return (
      <div className="card form-card" style={{ maxWidth: 400, margin: '40px auto' }}>
        <h2>Đăng nhập Admin</h2>
        <form onSubmit={login}>
          <input placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn" type="submit">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý Menu</h2>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Tên</th><th>Giá</th><th>Danh mục</th><th></th></tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td><input value={item.name} onChange={e => updateItem(item.id, { name: e.target.value })} /></td>
              <td><input type="number" value={item.price} onChange={e => updateItem(item.id, { price: parseInt(e.target.value, 10) })} /></td>
              <td><input value={item.category} onChange={e => updateItem(item.id, { category: e.target.value })} /></td>
              <td><button className="btn" onClick={() => deleteItem(item.id)}>Xóa</button></td>
            </tr>
          ))}
          <tr>
            <td>mới</td>
            <td><input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} /></td>
            <td><input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} /></td>
            <td><input value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} /></td>
            <td><button className="btn" onClick={addItem}>Thêm</button></td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>Đơn hàng</h2>
      <table className="admin-table">
        <thead>
          <tr><th>Mã</th><th>Khách</th><th>Tổng</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.total.toLocaleString()}đ</td>
              <td>
                <select value={o.status} onChange={e => updateOrder(o.id, e.target.value)}>
                  <option value="pending">Chờ</option>
                  <option value="done">Hoàn tất</option>
                </select>
              </td>
              <td><button className="btn" onClick={() => deleteOrder(o.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);

