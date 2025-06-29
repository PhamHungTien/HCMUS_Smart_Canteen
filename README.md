# Smart Canteen

Đây là mô hình mẫu cho hệ thống căng tin thông minh với giao diện React và máy chủ Node.js.
Server nay được viết theo chuẩn ES module của Node 18+, không cần cài gói phụ thuộc.
Chỉ cần Node đã cài đặt là có thể khởi chạy trực tiếp.

## Chức năng chính
- **Người dùng** có thể tạo tài khoản, đăng nhập, xem thực đơn, đặt món và gửi góp ý.
- **Quản trị viên** quản lí các món ăn, theo dõi đơn đặt hàng và xem phản hồi của người dùng.

## Công nghệ sử dụng
- Frontend: [React](https://react.dev/) tải trực tiếp qua CDN.
- Backend: [Node.js](https://nodejs.org/) thuần, lưu trữ dữ liệu ở các file JSON.

## Cấu trúc thư mục
- `server/` – mã nguồn API Node.
- `data/` – nơi lưu các file JSON tạo ra khi chạy server.
- `img/`, `menu/`, `qr/` – tài nguyên tĩnh phục vụ demo.

## Hướng dẫn chạy nhanh
Chỉ cần Node.js 18 trở lên, chạy:
```bash
node server/index.js
```

Server sẽ khởi động tại http://localhost:3001 và tự tạo các file dữ liệu JSON nếu chưa tồn tại.
Bạn có thể đăng ký người dùng mới qua `/signup` hoặc đăng nhập qua `/login`.
Tài khoản quản trị mặc định:
```
user: admin
pass: admin@123
```

Dự án ở mức tối giản để bạn có thể mở rộng thêm chức năng quản lý thực đơn, đặt món hay báo cáo doanh thu tùy nhu cầu.
