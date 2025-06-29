# Smart Canteen

Đây là mô hình mẫu cho hệ thống căng tin thông minh với giao diện React và máy chủ Node.js. Dữ liệu được lưu trữ trong SQLite.

## Chức năng chính
- **Người dùng** có thể tạo tài khoản, đăng nhập, xem thực đơn, đặt món và gửi góp ý.
- **Quản trị viên** quản lí các món ăn, theo dõi đơn đặt hàng và xem phản hồi của người dùng.

## Công nghệ sử dụng
- Frontend: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) khởi tạo bằng [Vite](https://vitejs.dev/).
- Backend: [Node.js](https://nodejs.org/) với [Express](https://expressjs.com/) viết bằng TypeScript.
- Cơ sở dữ liệu: [SQLite](https://sqlite.org/index.html) lưu tại `backend/data/db.sqlite`.

## Cấu trúc thư mục
- `frontend/` – mã nguồn giao diện người dùng.
- `backend/` – mã nguồn server và các API.
- `img/`, `menu/`, `qr/` – tài nguyên tĩnh phục vụ demo.

## Hướng dẫn cài đặt
1. Cài đặt các phụ thuộc cho từng phần:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Chạy API:
   ```bash
   cd backend && npm run dev
   ```
3. Mở một terminal khác và chạy giao diện:
   ```bash
   cd frontend && npm run start
   ```

Ứng dụng mặc định chạy tại http://localhost:5173 trong khi API chạy ở http://localhost:3001. File cơ sở dữ liệu sẽ được tạo tự động khi server khởi động lần đầu.

Dự án ở mức tối giản để bạn có thể mở rộng thêm chức năng quản lý thực đơn, đặt món hay báo cáo doanh thu tùy nhu cầu.
