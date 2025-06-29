# HCMUS Smart Canteen

Ứng dụng web đặt món cho căng tin Trường Đại học Khoa học Tự nhiên (HCMUS). Backend được viết bằng **TypeScript** chạy trên Node.js cùng framework **Express**, còn giao diện dùng **React + TypeScript** biên dịch trực tiếp qua Babel.

## Công cụ và thư viện sử dụng

- **Node.js** (>= 18) với **Express** viết bằng **TypeScript** làm máy chủ HTTP và định nghĩa API.
- **React 18** + **TypeScript** biên dịch qua Babel Standalone ngay trên trình duyệt, không cần bước build.
- **Font Awesome** dùng các biểu tượng cho UI.
- **JSBarcode** tạo mã vạch khi xác nhận đơn hàng.
- Ảnh QR thanh toán Momo/VietQR đặt trong `public/qr/`.
- **Service Worker** đơn giản để cache các tệp tĩnh và cho phép truy cập khi
  mất mạng.

Dữ liệu hiện được lưu trong cơ sở dữ liệu **SQLite** (`data/canteen.db`), giúp truy vấn và mở rộng dễ dàng hơn.

## Cài đặt

1. Cài Node.js phiên bản 18 trở lên.
2. Tạo file `.env` dựa trên `.env.example` và chỉnh lại tài khoản quản trị hoặc cổng nếu muốn.
3. Chạy `npm install` để cài các phụ thuộc (Express, TypeScript, ts-node và trình điều khiển SQLite).
## Chạy ứng dụng

Khởi động máy chủ (dùng ts-node để chạy TypeScript) bằng lệnh:

```bash
npm start
```

Server mặc định lắng nghe tại `http://localhost:3001` (có thể thay đổi trong `.env`). Truy cập các đường dẫn:

- `http://localhost:3001/` – trang đặt món chính (React).
- `http://localhost:3001/login.html` – trang đăng nhập.
- `http://localhost:3001/register.html` – trang đăng ký tài khoản (yêu cầu cả họ tên).
- `http://localhost:3001/admin.html` – trang quản trị (đăng nhập bằng tài khoản admin).

Frontend dùng Babel nên không cần bước build, chỉ cần chạy server để phục vụ các file tĩnh. Server đã cấu hình trả về đúng kiểu MIME cho các file `.tsx` trong thư mục `public/js` để trình duyệt luôn tải được script. Phần menu được tải động từ API `/menu` để quản trị có thể cập nhật dễ dàng.
Thông tin họ tên và mã số người đặt được lấy trực tiếp từ tài khoản sau khi đăng nhập nên không cần nhập lại ở bước thanh toán.

## Cấu trúc thư mục và chức năng từng file

```
HCMUS_Smart_Canteen/
├── backend/            # Mã nguồn Node.js
│   ├── server.ts       # Tạo HTTP server, định nghĩa toàn bộ API và phục vụ file tĩnh
│   ├── db.ts           # Khởi tạo kết nối SQLite và tạo bảng
│   ├── orders.ts       # Lưu đơn hàng vào SQLite
│   ├── menu.ts         # Quản lý danh sách món ăn (seed từ `defaultMenu.json`)
│   ├── feedback.ts     # Lưu góp ý, đánh giá của khách
│   └── users.ts        # Quản lý tài khoản người dùng
├── public/             # Giao diện người dùng và tài nguyên tĩnh
│   ├── index.html      # Trang React chính hiển thị menu và giỏ hàng
│   ├── login.html      # Mẫu đăng nhập, gọi API /login
│   ├── register.html   # Mẫu đăng ký tài khoản, gọi API /users
│   ├── admin.html      # Trang quản trị đơn hàng/menu/feedback/người dùng
│   ├── js/             # Các script cho frontend (app.tsx, login.ts, ...)
│   ├── styles.css      # Tập tin CSS dùng chung
│   ├── img/            # Logo và hình ảnh giao diện
│   ├── menu/           # Hình ảnh các món ăn hiển thị trên trang
│   └── qr/             # Ảnh QR thanh toán Momo và VietQR
├── package.json        # Khai báo dự án Node.js và script `npm start`
├── .env.example        # Mẫu cấu hình môi trường (user, password, PORT)
└── README.md           # Tài liệu này
```

## API cơ bản

- `POST /orders` – tạo đơn hàng.
- `GET /orders` – trả về danh sách đơn hàng.
- `GET /menu` – lấy danh sách món ăn.
- `POST /menu` – thêm món mới (admin).
- `PUT /menu/:id` – cập nhật món ăn theo ID.
- `DELETE /menu/:id` – xóa món ăn.
- `POST /login` – đăng nhập (admin hoặc người dùng).
- `POST /users` – đăng ký tài khoản người dùng (gồm username, mật khẩu, mã số và họ tên).
- `GET /users` – danh sách người dùng (admin).
- `DELETE /users/:name` – xóa tài khoản (admin).
- `POST /feedback` – gửi góp ý.
- `GET /feedback` – xem toàn bộ góp ý (admin).

## Đóng góp

Mọi ý kiến đóng góp xin gửi về nhóm phát triển. Đây là dự án học tập nên rất hoan nghênh phản hồi và đề xuất tính năng.

_Frontend React + TypeScript được Babel biên dịch trực tiếp trên trình duyệt nên chỉ cần chạy `npm start` là có thể thử ngay._
