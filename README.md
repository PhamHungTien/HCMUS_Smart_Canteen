# Smart Canteen

Smart Canteen là hệ thống mô phỏng căng tin trực tuyến sử dụng React cho giao diện và Node.js cho máy chủ. Toàn bộ dữ liệu được lưu ở các file JSON nên rất dễ triển khai và thử nghiệm. 

## Chức năng chi tiết

### Đăng ký và đăng nhập
- Người dùng có thể tạo tài khoản mới tại `/signup` và đăng nhập tại `/login`.
- Hỗ trợ quên mật khẩu và đổi mật khẩu sau khi đăng nhập.

### Đặt món trực tuyến
- Xem thực đơn, thêm món vào giỏ hàng và chọn thời gian lấy món.
- Hệ thống chỉ nhận tối đa **5 đơn** trong mỗi khung **15 phút** để tránh quá tải lúc nhận hàng. Nếu khung giờ đã đầy, người dùng sẽ được thông báo chọn thời gian khác.
- Thanh toán bằng Momo hoặc VietQR ngay trên giao diện web.

### Đánh giá và góp ý
- Người dùng có thể đánh giá từng món ăn bằng số sao và nhận xét.
- Mục “Góp ý” cho phép gửi ý kiến hoặc liên hệ với căng tin.

### Cài đặt tài khoản
- Thay đổi thông tin cá nhân, bật/tắt chế độ tối và chọn ngôn ngữ Việt/Anh.

### Chức năng quản trị
- **Quản lý thực đơn**: thêm, sửa, xoá món ăn, tải lên hình ảnh và mô hình 3D để hiển thị ở chế độ AR.
- **Quản lý đơn hàng**: xem danh sách đơn, cập nhật trạng thái hoặc huỷ đơn.
- **Báo cáo doanh thu**: thống kê doanh thu theo khoảng thời gian tuỳ chọn.
- **Quản lý người dùng**: xem và chỉnh sửa thông tin tài khoản.

## Công nghệ sử dụng
- **Frontend**: React qua CDN và Babel cho JSX.
- **Backend**: Node.js 18+ chuẩn ES module, lưu dữ liệu ở thư mục `data/`.
- **AR**: [`<model-viewer>`](https://modelviewer.dev) cho phép xem mô hình 3D trên thiết bị di động.

## Cấu trúc thư mục
- `backend/` – mã nguồn máy chủ và script khởi tạo dữ liệu.
- `frontend/` – giao diện React cho người dùng và trang quản trị.
- `data/` – các file JSON được tạo tự động khi chạy lần đầu.

## Khởi chạy
Cài Node.js 18 trở lên rồi chạy:
```bash
node backend/index.js
```
Máy chủ chạy tại `http://localhost:3001`. Tài khoản quản trị mặc định:
```
user: admin
pass: admin@123
```

## API chính
- `GET /menu` – lấy thực đơn
- `POST /menu` – thêm món (admin)
- `PUT /menu/:id`, `DELETE /menu/:id` – chỉnh sửa hoặc xoá món (admin)
- `POST /orders` – tạo đơn mới (yêu cầu đăng nhập)
- `GET /orders` – danh sách đơn hàng (admin)
- `GET /revenue?from=YYYY-MM-DD&to=YYYY-MM-DD` – doanh thu theo khoảng thời gian (admin)
- `POST /feedback` – gửi góp ý
- các API quản lý tài khoản: `/change-password`, `/reset-password`, `/users/...`

Smart Canteen là nền tảng mẫu để xây dựng căng tin thông minh. Bạn có thể mở rộng thêm tính năng hoặc tích hợp với hệ thống có sẵn tuỳ nhu cầu.

## Giải thuật và quy trình hoạt động

### 1. Khởi tạo dữ liệu
- Khi server chạy lần đầu, hàm `initData()` tạo thư mục `data/` và các file JSON nếu chưa tồn tại.
- Tài khoản quản trị mặc định (`admin/admin@123`) được thêm vào `users.json` nếu không có sẵn.
- Menu mẫu lấy từ `backend/data/defaultMenu.js` sẽ ghi vào `menu.json` lần đầu tiên.

### 2. Xác thực người dùng
- Các API yêu cầu đăng nhập dùng `Basic` authentication.
- Hàm `authenticate()` đọc header `Authorization`, giải mã Base64 để lấy `username:password` và so sánh với dữ liệu trong `users.json`.
- Nếu khớp, thông tin người dùng được trả về và tiếp tục xử lý; ngược lại gửi lỗi `401 Unauthorized`.

### 3. Đặt món và giới hạn thời gian
- Mỗi đơn hàng có trường `time` do người dùng chọn.
- Hàm `slotKey()` chuyển thời gian thành khoá theo từng **15 phút** (ví dụ `10:00`, `10:15`, ...).
- Server đếm số đơn cùng khoá đã lưu trong `orders.json`. Nếu đạt **5 đơn**, API trả lỗi "Khung giờ này đã đủ lượt đặt" để yêu cầu khách chọn giờ khác.
- Khi còn chỗ, đơn hàng được thêm vào file với trạng thái `pending` kèm thời gian tạo.

### 4. Tính doanh thu
- API `/revenue` nhận tham số `from` và `to` để lọc các đơn trong `orders.json` theo ngày tháng.
- Doanh thu bằng tổng `total` của các đơn thoả điều kiện.

### 5. Lưu góp ý và quản trị
- Góp ý từ người dùng lưu vào `feedback.json` với `createdAt` để quản trị viên xem lại.
- Các thao tác chỉnh sửa menu, đơn hàng hay tài khoản cập nhật trực tiếp vào các file JSON tương ứng thông qua các API `POST`, `PUT`, `DELETE`.

Tất cả quá trình đọc/ghi dữ liệu đều dùng hàm bất đồng bộ (`async/await`) trên hệ thống file, phù hợp để triển khai demo mà không cần cơ sở dữ liệu phức tạp.
