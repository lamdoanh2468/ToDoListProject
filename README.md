# Save the README content as a .txt file
readme_content = """
# 📝 To-Do List Web App

Một ứng dụng web đơn giản nhưng tinh tế giúp bạn **quản lý công việc**, sắp xếp thời gian, và không bỏ lỡ bất kỳ deadline nào.

> "Không có task nào là không thể hoàn thành – chỉ là bạn chưa viết nó vào đây mà thôi!" 💡

---

## 🚀 Demo

👉 [Xem bản chạy trực tiếp tại đây (Vercel link)](https://your-vercel-deploy-url.vercel.app) *(thay bằng link thật)*

---

## 🛠 Tính năng nổi bật

✅ Thêm/sửa/xoá công việc  
✅ Gán độ ưu tiên: `Cao`, `Vừa`, `Thấp`  
✅ Cài deadline (ngày + giờ)  
✅ Giao diện tự động đếm ngược thời gian còn lại  
✅ Cảnh báo khi deadline sắp đến hoặc quá hạn  
✅ Tùy chỉnh màu tiêu đề + chọn hình nền cực chill  
✅ Lưu trữ local (LocalStorage), không mất dữ liệu khi tải lại  
✅ Giao diện responsive, đẹp mê hồn 😍

---

## 🧑‍💻 Công nghệ sử dụng

| Công nghệ | Vai trò |
|----------|---------|
| HTML5 | Giao diện khung |
| CSS3 | Thiết kế giao diện, hiệu ứng |
| JavaScript | Logic xử lý, tương tác người dùng |
| LocalStorage | Lưu dữ liệu cục bộ |
| Vercel | Deploy ứng dụng web |

---

## 🗂️ Cấu trúc dự án

TODOLIST/
├── client/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/           # (Nếu có backend sau này)
│   ├── controllers/
│   ├── models/
│   └── routes/
├── dist/             # (Tùy chọn: build output)
└── README.md

---

## 🔧 Cách chạy dự án

1. **Clone project** về máy:

git clone https://github.com/your-username/todolist.git
cd todolist/client

2. **Mở file HTML**:

- Chạy bằng VSCode + Live Server extension
- Hoặc mở `index.html` bằng bất kỳ trình duyệt nào

---

## 🌐 Cách deploy lên Vercel

> Nếu bạn dùng thư mục `client/`, nhớ set `Root Directory` = `client`

1. Tạo tài khoản tại [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Vào Project Settings → General → Root Directory → `client`
4. Bấm “Deploy” và thưởng thức thành quả ✨

---

## 🎯 Định hướng tương lai

- [ ] Đồng bộ hoá với Firebase / Supabase  
- [ ] Tính năng nhắc nhở bằng thông báo đẩy  
- [ ] Giao diện kéo-thả (drag & drop)  
- [ ] Thống kê task đã hoàn thành bằng biểu đồ  
- [ ] Chế độ Dark Mode 🌓  
- [ ] PWA (cài như app di động)  

---

## 📜 Giấy phép

MIT License © [Your Name]

---

## 🫶 Đóng góp

Bạn có ý tưởng gì thú vị? Gửi PR hoặc tạo Issue nhé! Mình luôn hoan nghênh mọi đóng góp 💥
"""

file_path = "/mnt/data/README_TODO.txt"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(readme_content)

file_path
