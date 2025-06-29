# Smart Canteen

Smart Canteen là dự án mô phỏng hệ thống căng tin thông minh sử dụng React và Node.js. Ứng dụng giúp người dùng đặt món nhanh chóng và hỗ trợ quản trị viên theo dõi thực đơn cũng như doanh thu.

## Đặc điểm nổi bật
- **Trải nghiệm AR (Augmented Reality)**: trên thiết bị di động, khi chạm vào hình ảnh món ăn sẽ mở mô hình 3D dưới dạng AR thông qua `<model-viewer>` (nếu quản trị viên đã tải lên file `.glb`).
- **Quản lý thực đơn**: thêm, sửa, xoá món ăn kèm ảnh và mô hình 3D; phân loại thức ăn, đồ uống.
- **Đặt hàng trực tuyến**: chọn thời gian lấy món, thanh toán qua Momo hoặc VietQR.
- **Đánh giá và góp ý**: gửi nhận xét cho từng món, liên hệ phản hồi với căng tin.
- **Báo cáo doanh thu** và **quản lý tài khoản** dành cho quản trị viên.

## Công nghệ
- **Frontend**: React tải trực tiếp từ CDN, kết hợp JSX qua Babel.
- **Backend**: Node.js 18+ theo chuẩn ES module, lưu dữ liệu bằng JSON nên không cần CSDL riêng.
- **AR**: sử dụng [`<model-viewer>`](https://modelviewer.dev) hỗ trợ WebXR, Scene Viewer và Quick Look.

## Thư mục dự án
- `backend/` – mã nguồn máy chủ và các tiện ích khởi tạo dữ liệu.
- `frontend/` – giao diện React cho người dùng và trang quản trị.
- `data/` – các file JSON tự sinh khi khởi chạy lần đầu.

## Khởi chạy nhanh
Cài đặt Node.js 18 trở lên và chạy:
```bash
node backend/index.js
```
Máy chủ lắng nghe tại http://localhost:3001 và tự tạo dữ liệu mẫu nếu chưa có.
Một số đường dẫn:
- `/login` – đăng nhập hoặc tạo tài khoản
- `/signup` – đăng ký người dùng mới
- `/admin` – giao diện quản trị

Tài khoản quản trị mặc định:
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
- `GET /revenue?from=YYYY-MM-DD&to=YYYY-MM-DD` – báo cáo doanh thu (admin)
- `POST /feedback` – gửi góp ý
- các API quản lý tài khoản: `/change-password`, `/reset-password`, `/users/...`

Dự án cung cấp nền tảng để xây dựng căng tin trực tuyến với các tính năng cơ bản và có thể mở rộng thêm tuỳ nhu cầu.
