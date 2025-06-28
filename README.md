# HCMUS Smart Canteen

Ứng dụng web đặt món cho căng tin Trường Đại học Khoa học Tự nhiên. Phiên bản này bổ sung trang đăng nhập đơn giản.

## Cài đặt

1. Cài đặt Node.js >= 18.
2. Cài đặt các gói phụ thuộc (Express và Cors):

```bash
npm install
```

## Chạy ứng dụng

Khởi động server Express:

```bash
npm start
```

Server chạy mặc định tại `http://localhost:3001`.

## Cấu trúc

- `public/` chứa giao diện người dùng (HTML, CSS, ảnh).
- `public/login.html` trang đăng nhập trước khi vào hệ thống.
- `backend/` chứa mã nguồn Node.js.
  - `server.js`: điểm khởi đầu của backend.
  - `orders.js`: các hàm thao tác với dữ liệu đơn hàng.
- `data/orders.json`: file lưu trữ tạm thời đơn hàng.

## API

- `POST /orders` – tạo đơn hàng mới.
- `GET /orders` – lấy danh sách đơn hàng.
- `POST /login` – xác thực đơn giản (user mặc định: admin/123456).

## Đóng góp

Mọi đóng góp, ý kiến xin gửi về nhóm phát triển.
