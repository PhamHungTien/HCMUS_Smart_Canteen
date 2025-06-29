    document.getElementById('loginBtn').addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const err = document.getElementById('loginError');
        err.style.display = 'none';
        if(!username || !password){
            err.textContent = 'Vui lòng nhập đầy đủ thông tin';
            err.style.display = 'block';
            return;
        }
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('loggedIn', 'true');
                if(data.role==='admin'){
                    localStorage.setItem('admin','true');
                    window.location.href='admin.html';
                }else{
                    localStorage.removeItem('admin');
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('code', data.code);
                    localStorage.setItem('fullName', data.fullName);
                    window.location.href='index.html';
                }
            } else {
                const data = await res.json();
                err.style.display = 'block';
                err.textContent = data.error || 'Đăng nhập thất bại';
            }
        } catch (e){
            err.style.display = 'block';
            err.textContent = 'Không thể kết nối tới máy chủ';
        }
    });

}
