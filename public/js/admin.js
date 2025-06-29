if(!localStorage.getItem('loggedIn')) window.location='login.html';

function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.tab-button').forEach(b=>b.classList.remove('active'));
  const btn=document.querySelector(`.tab-button[data-tab="${id}"]`);
  if(btn) btn.classList.add('active');
  if(id==='orders') loadOrders();
  if(id==='menu') loadMenu();
  if(id==='feedback') loadFeedback();
  if(id==='users') loadUsers();
}

async function loadOrders(){
  const res = await fetch('orders');
  const data = await res.json();
  const div=document.getElementById('orders');
  div.innerHTML='<div class="card admin-section"><h3>Đơn hàng</h3>'+renderTable(data)+'</div>';
}

function renderTable(items){
  if(!items.length) return '<p>Không có dữ liệu</p>';
  const keys=Object.keys(items[0]);
  let html='<table class="styled-table"><thead><tr>'+keys.map(k=>`<th>${k}</th>`).join('')+'</tr></thead><tbody>';
  html+=items.map(it=>'<tr>'+keys.map(k=>`<td>${it[k]}</td>`).join('')+'</tr>').join('');
  html+='</tbody></table>';
  return html;
}

async function loadMenu(){
  const res=await fetch('menu');
  const menu=await res.json();
  const list=document.getElementById('menuList');
  list.innerHTML=renderMenuTable(menu);
}

function renderMenuTable(menu){
  if(!menu.length) return '<p>Chưa có món</p>';
  let html='<table class="styled-table"><thead><tr><th>Tên</th><th>Loại</th><th>Giá</th><th>Ảnh</th><th>Sao</th><th></th></tr></thead><tbody>';
  html+=menu.map(m=>`<tr><td>${m.name}</td><td>${m.category}</td><td>${m.price.toLocaleString()}</td><td><img src="${m.image}" class="thumb"/></td><td>${m.rating}</td><td><button class="btn" onclick="delMenuItem(${m.id})">Xóa</button></td></tr>`).join('');
  html+='</tbody></table>';
  return html;
}

async function addMenuItem(){
  const item={
    name:document.getElementById('itemName').value,
    category:document.getElementById('itemCategory').value,
    price:parseInt(document.getElementById('itemPrice').value||0),
    image:document.getElementById('itemImage').value,
    rating:parseInt(document.getElementById('itemRating').value||0)
  };
  if(item.image && !item.image.startsWith('http') && !item.image.startsWith('menu/')){
    item.image = 'menu/' + item.image.replace(/^\/+/, '');
  }
  await fetch('menu',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(item)});
  loadMenu();
}

async function delMenuItem(id){
  await fetch('menu/'+id,{method:'DELETE'});
  loadMenu();
}

async function loadFeedback(){
  const res=await fetch('feedback');
  const data=await res.json();
  const div=document.getElementById('feedback');
  div.innerHTML='<div class="card admin-section"><h3>Góp ý</h3>'+renderTable(data)+'</div>';
}

async function loadUsers(){
  const res=await fetch('users');
  const list=await res.json();
  const div=document.getElementById('users');
  div.innerHTML='<div class="card admin-section"><h3>Người dùng</h3>'+renderUserTable(list)+'</div>';
}

function renderUserTable(users){
  if(!users.length) return '<p>Không có người dùng</p>';
  let html='<table class="styled-table"><thead><tr><th>Username</th><th>Họ tên</th><th>Mã số</th><th></th></tr></thead><tbody>';
  html+=users.map(u=>`<tr><td>${u.username}</td><td>${u.fullName||''}</td><td>${u.code||''}</td><td><button class="btn" onclick="delUser('${u.username}')">Xóa</button></td></tr>`).join('');
  html+='</tbody></table>';
  return html;
}

async function delUser(name){
  await fetch('users/'+name,{method:'DELETE'});
  loadUsers();
}

showTab('orders');

}
