# HCMUS Smart Canteen

Ứng dụng web đặt món cho căng tin Trường Đại học Khoa học Tự nhiên. Đây là dự án mẫu gồm phần backend (Express) và giao diện frontend dùng React, cho phép khách đặt món và quản lý đơn hàng.

## Cài đặt

1. Cài đặt Node.js >= 18.
2. Tạo file `.env` từ mẫu `.env.example` và điều chỉnh thông tin đăng nhập nếu cần. Mặc định tài khoản quản trị là `admin/admin@123`.
3. Cài đặt các gói phụ thuộc (cần `sqlite3`):

```bash
npm install
```

## Chạy ứng dụng

Khởi động server Express:

```bash
npm start
```

Server chạy tại cổng được cấu hình trong `.env` (mặc định `http://localhost:3001`).
Truy cập `http://localhost:3001` để đặt món. Trang đăng ký ở `http://localhost:3001/register.html` và đăng nhập ở `http://localhost:3001/login.html`. Sau khi đăng nhập bằng tài khoản quản trị bạn sẽ vào `http://localhost:3001/admin.html`.

## Tính năng chính

- Đặt món và thanh toán trực tuyến (Momo, VietQR) hoặc khi nhận hàng.
- Trang quản trị cho phép xem đơn hàng, chỉnh sửa menu và xem góp ý từ khách.
- Dữ liệu được lưu trong file SQLite tại thư mục `data/`.
- Người dùng có thể đăng ký tài khoản và đăng nhập.
- Mỗi tài khoản lưu thêm mã số sinh viên hoặc cán bộ.
- Quản trị viên có thể quản lý danh sách người dùng.

## Cấu trúc

- `public/` chứa giao diện người dùng (HTML, CSS, ảnh).
  - `index.html` (truy cập `/`) trang đặt món chính, nạp mã React từ `app.jsx`.
  - `login.html` (truy cập `/login.html`) trang đăng nhập.
  - `register.html` (truy cập `/register.html`) trang tạo tài khoản người dùng.
  - `admin.html` (truy cập `/admin.html`) trang quản lý đơn hàng, menu, góp ý và người dùng.
- `backend/` chứa mã nguồn Node.js.
  - `server.js`: điểm khởi đầu của backend.
  - `routes/` chứa các router Express (`auth.js`, `orders.js`, `menu.js`, `feedback.js`).
  - `orders.js`: thao tác với dữ liệu đơn hàng.
  - `menu.js`: lưu trữ danh sách món ăn.
  - `feedback.js`: ghi nhận đánh giá/góp ý từ khách hàng.
  - `data/` chứa cơ sở dữ liệu SQLite (được bỏ qua trong git).

## API

- `POST /orders` – tạo đơn hàng mới.
- `GET /orders` – lấy danh sách đơn hàng.
- `GET /menu` – lấy danh sách món ăn.
- `POST /menu` – thêm món mới.
- `PUT /menu/:id` – cập nhật món.
- `DELETE /menu/:id` – xóa món.
- `POST /login` – xác thực dựa trên tên đăng nhập/mật khẩu (admin trong `.env` hoặc người dùng trong database).
- `POST /users` – đăng ký người dùng mới (cần `username`, `password`, `code`).
- `GET /users` – lấy danh sách người dùng (dành cho admin).
- `POST /feedback` – gửi đánh giá hoặc góp ý.
- `GET /feedback` – lấy danh sách phản hồi của khách hàng.

## Đóng góp

Mọi đóng góp, ý kiến xin gửi về nhóm phát triển.

_Frontend React sử dụng Babel chạy trực tiếp trên trình duyệt nên không cần bước build._
