const { useState, useEffect } = React;

function AdminApp() {
  const [auth, setAuth] = useState(localStorage.getItem('auth') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });
  const [newUser, setNewUser] = useState({ username: '', password: '', fullName: '', staffId: '', phone: '', email: '' });
  const [pwMap, setPwMap] = useState({});
  const [revFrom, setRevFrom] = useState('');
  const [revTo, setRevTo] = useState('');
  const [revenue, setRevenue] = useState(null);
  const [activeTab, setActiveTab] = useState('manage');

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
  }, []);

  useEffect(() => {
    if (auth) {
      const now = new Date();
      setRevTo(now.toISOString().slice(0,10));
      setRevFrom(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0,10));
      refreshData();
    }
  }, [auth]);

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

  function logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    setAuth('');
    window.location.href = '/login.html';
  }

  function refreshData() {
    fetch('/menu').then(r => r.json()).then(setMenu);
    fetch('/orders', { headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json())
      .then(setOrders);
    fetch('/users', { headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json())
      .then(setUsers);
    fetch('/feedback', { headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json())
      .then(setFeedbacks);
    fetchRevenue();
  }

  function fetchRevenue(from = revFrom, to = revTo) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    fetch('/revenue?' + params.toString(), { headers: { Authorization: 'Basic ' + auth } })
      .then(r => r.json())
      .then(data => setRevenue(data.total));
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

  function addUser() {
    if (!newUser.username || !newUser.password || !newUser.fullName || !newUser.staffId || !newUser.phone || !newUser.email) { showToast('Thiếu thông tin'); return; }
    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).then(r => r.json()).then(() => { setNewUser({ username: '', password: '', fullName: '', staffId: '', phone: '', email: '' }); refreshData(); });
  }

  function updateUser(id, updates) {
    fetch(`/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + auth },
      body: JSON.stringify(updates)
    }).then(r => r.json()).then(refreshData);
  }

  function deleteUser(id) {
    fetch(`/users/${id}`, { method: 'DELETE', headers: { Authorization: 'Basic ' + auth } })
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
    <>
      <nav className="top-navbar">
        <div className="top-navbar-inner" style={{display:'flex', alignItems:'center', width:'calc(100% - 60px)'}}>
          <div style={{flex:1, display:'flex', justifyContent:'flex-end', gap:'10px'}}>
            <div className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
              <i className="fa-solid fa-list"></i>
              <span>Quản lý</span>
            </div>
            <div className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <i className="fa-solid fa-gear"></i>
              <span>Cài đặt</span>
            </div>
          </div>
        </div>
      </nav>

      {activeTab === 'settings' && (
        <div style={{maxWidth:400, margin:'80px auto'}} className="card form-card">
          <h3>Cài đặt</h3>
          <button className="btn" onClick={() => window.location.href='/change.html'} style={{marginBottom:12}}>Đổi mật khẩu</button>
          <button className="btn danger-btn" onClick={logout}>Đăng xuất</button>
        </div>
      )}

      {activeTab === 'manage' && (
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
          <tr><th>Mã</th><th>Khách</th><th>Món đã đặt</th><th>Yêu cầu</th><th>Tổng</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.items.map(i => `${i.name} (${i.category}) x${i.qty}`).join(', ')}</td>
              <td>{o.specialRequest}</td>
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

      <h2 style={{ marginTop: '40px' }}>Báo cáo doanh thu</h2>
      <div className="report-inputs">
        <input type="date" value={revFrom} onChange={e => setRevFrom(e.target.value)} />
        <input type="date" value={revTo} onChange={e => setRevTo(e.target.value)} />
        <button className="btn" onClick={() => fetchRevenue()}>Tính</button>
        {revenue !== null && <span style={{ marginLeft: '10px', fontWeight: '600' }}>Tổng: {revenue.toLocaleString()}đ</span>}
      </div>

      <h2 style={{ marginTop: '40px' }}>Đánh giá & Góp ý</h2>
      <table className="admin-table">
        <thead>
          <tr><th>Loại</th><th>Nội dung</th><th>Thời gian</th></tr>
        </thead>
        <tbody>
          {feedbacks.map((f, idx) => (
            <tr key={idx}>
              <td>{f.type === 'rating' ? 'Đánh giá' : 'Góp ý'}</td>
              <td>
                {f.type === 'rating'
                  ? `${menu.find(i => i.id === f.itemId)?.name || ''} - ${f.rating}★ ${f.comment || ''}`
                  : `${f.text} (${f.email})`}
              </td>
              <td>{new Date(f.createdAt).toLocaleString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px' }}>Người dùng</h2>
      <table className="admin-table">
        <thead>
          <tr><th>ID</th><th>Tên đăng nhập</th><th>Họ tên</th><th>Mã số</th><th>Điện thoại</th><th>Email</th><th>Vai trò</th><th>Mật khẩu mới</th><th></th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td><input value={u.fullName} onChange={e => updateUser(u.id, { fullName: e.target.value })} /></td>
              <td><input value={u.staffId} onChange={e => updateUser(u.id, { staffId: e.target.value })} /></td>
              <td><input value={u.phone || ''} onChange={e => updateUser(u.id, { phone: e.target.value })} /></td>
              <td><input value={u.email || ''} onChange={e => updateUser(u.id, { email: e.target.value })} /></td>
              <td>{u.role}</td>
              <td>
                <input type="password" value={pwMap[u.id] || ''} onChange={e => setPwMap({ ...pwMap, [u.id]: e.target.value })} />
              </td>
              <td>
                <button className="btn" onClick={() => { updateUser(u.id, { password: pwMap[u.id] }); setPwMap({ ...pwMap, [u.id]: '' }); }}>Đổi</button>
                <button className="btn" onClick={() => deleteUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>mới</td>
            <td><input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} /></td>
            <td><input value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} /></td>
            <td><input value={newUser.staffId} onChange={e => setNewUser({ ...newUser, staffId: e.target.value })} /></td>
            <td><input value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} /></td>
            <td><input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} /></td>
            <td>user</td>
            <td><input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} /></td>
            <td><button className="btn" onClick={addUser}>Thêm</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(<AdminApp />);

