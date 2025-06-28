# HCMUS Smart Canteen

Ứng dụng web đặt món cho căng tin Trường Đại học Khoa học Tự nhiên. Phiên bản này bổ sung trang đăng nhập đơn giản.

## Cài đặt

1. Cài đặt Node.js >= 18.
2. Tạo file `.env` từ mẫu `.env.example` và điều chỉnh thông tin đăng nhập nếu cần.
3. Cài đặt các gói phụ thuộc:

```bash
npm install
```

## Chạy ứng dụng

Khởi động server Express:

```bash
npm start
```

Server chạy tại cổng được cấu hình trong `.env` (mặc định `http://localhost:3001`).

## Cấu trúc

- `public/` chứa giao diện người dùng (HTML, CSS, ảnh).
- `public/login.html` trang đăng nhập trước khi vào hệ thống.
- `backend/` chứa mã nguồn Node.js.
  - `server.js`: điểm khởi đầu của backend.
  - `routes/` chứa các router Express (`auth.js`, `orders.js`).
  - `orders.js`: các hàm thao tác với dữ liệu đơn hàng.
  - `data/orders.json`: file lưu trữ tạm thời đơn hàng (được bỏ qua trong git).

## API

- `POST /orders` – tạo đơn hàng mới.
- `GET /orders` – lấy danh sách đơn hàng.
- `POST /login` – xác thực dựa trên tên đăng nhập/mật khẩu trong file `.env`.

## Đóng góp

Mọi đóng góp, ý kiến xin gửi về nhóm phát triển.
