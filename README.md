# HCMUS Smart Canteen

Ứng dụng web đặt món cho căng tin Trường Đại học Khoa học Tự nhiên. Đây là dự án mẫu gồm phần backend (Express) và giao diện frontend dùng React, cho phép khách đặt món và quản lý đơn hàng.

## Cài đặt

1. Cài đặt Node.js >= 18.
2. Tạo thư mục `data/` ở gốc dự án để lưu các file JSON tạm thời.
3. Tạo file `.env` từ mẫu `.env.example` và điều chỉnh thông tin đăng nhập nếu cần. Mặc định tài khoản quản trị là `admin/123456`.
4. Cài đặt các gói phụ thuộc:

```bash
npm install
```

## Chạy ứng dụng

Khởi động server Express:

```bash
npm start
```

Server chạy tại cổng được cấu hình trong `.env` (mặc định `http://localhost:3001`).
Truy cập `http://localhost:3001` để đặt món. Trang đăng nhập quản trị ở `http://localhost:3001/login` và sau khi đăng nhập sẽ truy cập `http://localhost:3001/admin`.

## Tính năng chính

- Đặt món và thanh toán trực tuyến (Momo, VietQR) hoặc khi nhận hàng.
- Trang quản trị cho phép xem đơn hàng, chỉnh sửa menu và xem góp ý từ khách.
- Tất cả dữ liệu được lưu tạm thời dưới dạng file JSON trong thư mục `data/`.

## Cấu trúc

- `public/` chứa giao diện người dùng (HTML, CSS, ảnh).
  - `index.html` (truy cập `/`) trang đặt món chính, nạp mã React từ `app.jsx`.
  - `login.html` (truy cập `/login`) trang đăng nhập.
  - `admin.html` (truy cập `/admin`) trang quản lý đơn hàng, menu và góp ý.
- `backend/` chứa mã nguồn Node.js.
  - `server.js`: điểm khởi đầu của backend.
  - `routes/` chứa các router Express (`auth.js`, `orders.js`, `menu.js`, `feedback.js`).
  - `orders.js`: thao tác với dữ liệu đơn hàng.
  - `menu.js`: lưu trữ danh sách món ăn.
  - `feedback.js`: ghi nhận đánh giá/góp ý từ khách hàng.
  - `data/` chứa các file JSON lưu tạm thời (được bỏ qua trong git).

## API

- `POST /orders` – tạo đơn hàng mới.
- `GET /orders` – lấy danh sách đơn hàng.
- `GET /menu` – lấy danh sách món ăn.
- `POST /menu` – thêm món mới.
- `PUT /menu/:id` – cập nhật món.
- `DELETE /menu/:id` – xóa món.
- `POST /login` – xác thực dựa trên tên đăng nhập/mật khẩu trong file `.env`.
- `POST /feedback` – gửi đánh giá hoặc góp ý.
- `GET /feedback` – lấy danh sách phản hồi của khách hàng.

## Đóng góp

Mọi đóng góp, ý kiến xin gửi về nhóm phát triển.

_Frontend React sử dụng Babel chạy trực tiếp trên trình duyệt nên không cần bước build._
