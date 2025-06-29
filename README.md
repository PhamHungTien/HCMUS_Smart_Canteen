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
- `backend/` – mã nguồn API Node và máy chủ tĩnh (tiện ích nằm trong `backend/lib`, dữ liệu mẫu ở `backend/data`).
- `frontend/` – giao diện React và các tài nguyên (`img/`, `menu/`, `qr/`, `js/`, `styles.css`, `admin.html`).
- `data/` – nơi lưu các file JSON tạo ra khi chạy server.

## Hướng dẫn chạy nhanh
Chỉ cần Node.js 18 trở lên, chạy:
```bash
node backend/index.js
```
Server sẽ khởi động tại http://localhost:3001, tự tạo các file dữ liệu JSON nếu chưa tồn tại và phục vụ giao diện web.
Mở trình duyệt tới địa chỉ trên để xem trang chủ.
Bạn có thể đăng ký người dùng mới qua `/signup` (cần `username`, `password`, `fullName`, `staffId`) hoặc đăng nhập qua `/login`.
Tài khoản quản trị mặc định:
```
user: admin
pass: admin@123
```

### API mới

- `GET /menu` – lấy danh sách món ăn.
- `POST /menu` – thêm món (cần header `Authorization: Basic base64(admin:pass)`).
- `PUT /menu/:id` và `DELETE /menu/:id` – chỉnh sửa hoặc xoá món (cần quyền admin).
- `POST /feedback` – gửi đánh giá hoặc góp ý.
- `GET /feedback` – lấy danh sách góp ý (admin).
- `POST /change-password` – đổi mật khẩu (yêu cầu Basic Auth và `newPassword`).
- `GET /users` – lấy danh sách tài khoản (admin).
- `PUT /users/:id` – cập nhật thông tin hoặc đổi mật khẩu (admin).
- `DELETE /users/:id` – xoá tài khoản (admin).

### Quản lý đơn hàng
- `GET /orders` – lấy danh sách đơn hàng (cần quyền admin).
- `POST /orders` – người dùng tạo đơn mới.
- `PUT /orders/:id` – cập nhật trạng thái đơn (admin).
- `DELETE /orders/:id` – xoá đơn (admin).

### Giao diện quản trị
Mở `admin.html` để đăng nhập và quản lý thực đơn, đơn hàng và tài khoản người dùng trực tiếp trên trình duyệt. Sau khi đăng nhập, các thao tác thêm/xoá/sửa sẽ gửi yêu cầu tới các API trên.

Dự án đã bao gồm đầy đủ các tính năng cơ bản như quản lý tài khoản, thực đơn và đơn hàng. Bạn có thể tiếp tục mở rộng thêm các chức năng nâng cao (ví dụ báo cáo doanh thu) tùy ý.

