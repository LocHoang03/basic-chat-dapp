## Thực hiện tải download dự án từ link github và chạy dự án

Download dự án github theo link đã gửi từ gmail và giải nén

Thực hiện mở dự án bằng VSCode (Lưu ý mở file có chứa các thư mục của dự án ví
dụ: src, package.json...)

```bash
Thực hiện mở terminal trong VSCode
Chạy câu lệnh: npm install (khuyến nghị cài nodejs version 18+)
Sau khi câu lệnh trên chạy xong chạy câu lệnh: npm run dev (chạy môi trường dev)
Mở google vào đường link: http://localhost:3000/ (thực hiện test chức năng trong bên này)

```

## Các chức năng cơ bản có trong dự án

1. Tạo tài khoản (nhập tên người dùng - địa chỉ metamark đã liên kết không cần
   nhập)
2. Thêm bạn bè để chat
3. Chat với bạn bè đã thêm trước đó
4. Sửa/Xóa tin nhắn đã gửi (Chức năng xuất hiện khi hover vào tin nhắn đã gửi)
   Lưu ý: Với những tin nhắn gửi quá 5 phút ẩn chức năng sửa tin nhắn

## Lưu ý với metamark

Thực hiện chuyển sang mạng ETH Sepolia testnet để thực hiện test được chính xác
