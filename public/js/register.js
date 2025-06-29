    document.getElementById('regBtn').addEventListener('click', async () => {
        const fullName=document.getElementById('fullName').value.trim();
        const username=document.getElementById('username').value.trim();
        const code=document.getElementById('code').value.trim();
        const password=document.getElementById('password').value.trim();
        const err=document.getElementById('regErr');
        err.style.display='none';
        if(!fullName || !username || !password || !code){
            err.textContent='Vui lòng nhập đầy đủ thông tin';
            err.style.display='block';
            return;
        }
        try{
            const res=await fetch('/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password,code,fullName})});
            if(res.ok){
                alert('Đăng ký thành công');
                window.location='login.html';
            }else{
                const d=await res.json();
                err.style.display='block';
                err.textContent=d.error||'Lỗi';
            }
        }catch(e){
            err.style.display='block';
            err.textContent='Không thể kết nối tới máy chủ';
        }
    });

}
