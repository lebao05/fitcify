
# 🎵 Fitcify - Music Streaming Platform

**Phiên bản:** 1.1  
**Ngày cập nhật:** 19/07/2025  
**Nhóm phát triển:** Fitcify Team  

Fitcify là một **ứng dụng web streaming nhạc** dành cho desktop, lấy cảm hứng từ Spotify, cung cấp trải nghiệm nghe nhạc cá nhân hóa, playlist thông minh, AI gợi ý bài hát dựa trên tâm trạng và thói quen nghe nhạc.  
Ứng dụng hỗ trợ **người nghe** tìm kiếm & phát nhạc, **nghệ sĩ** tải lên và quản lý nội dung, cùng **hệ thống thanh toán Premium/Family** bảo mật.

---

## 📖 Mục lục
- [Giới thiệu](#giới-thiệu)
- [Tính năng chi tiết](#tính-năng-chi-tiết)
  - [Dành cho Listener](#listener)
  - [Dành cho Artist](#artist)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Kiến trúc phần mềm](#kiến-trúc-phần-mềm)
- [Giao diện người dùng](#giao-diện-người-dùng)
- [Kế hoạch kiểm thử](#kế-hoạch-kiểm-thử)
- [Bảng Use Case](#bảng-use-case)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Đóng góp](#đóng-góp)
- [Bản quyền](#bản-quyền)

---

## 🎯 Giới thiệu
Fitcify được thiết kế để:
- Cung cấp **trải nghiệm nghe nhạc liền mạch** trên desktop (Windows, macOS, Linux).
- **Cá nhân hóa nội dung** bằng AI dựa trên lịch sử và tâm trạng của người dùng.
- **Tạo điều kiện cho nghệ sĩ độc lập** dễ dàng tải lên, quản lý và quảng bá âm nhạc của họ.
- Đảm bảo **bảo mật & tuân thủ** các quy định bảo vệ dữ liệu người dùng.

---

## ✨ Tính năng chi tiết

### **Listener**
1. **Xác thực & Quản lý tài khoản**
   - Đăng ký/Đăng nhập bằng Email & Mật khẩu, OTP, Google, Facebook.
   - Quên mật khẩu với OTP.
   - Cập nhật hồ sơ và thông tin cá nhân.
2. **Nghe & Tìm kiếm nhạc**
   - Tìm kiếm theo bài hát, album, playlist, nghệ sĩ, hồ sơ người dùng.
   - Bộ lọc nội dung và gợi ý tìm kiếm thông minh.
3. **Playlist**
   - Tạo, chỉnh sửa, xóa playlist.
   - Thêm/Xóa bài hát trong playlist.
4. **Trình phát nhạc**
   - Phát/dừng, tua bài, phát lại, chế độ shuffle, quản lý liked songs.
5. **Gợi ý bài hát bằng AI**
   - Gợi ý dựa trên tâm trạng (người dùng chọn hoặc AI nhận diện).
6. **Gói Premium**
   - Đăng ký gói Premium hoặc Family, thanh toán qua PayOS.

### **Artist**
1. **Tải lên bài hát**
   - Quy trình xác minh nghệ sĩ.
   - Upload bài hát kèm metadata (tên, album, ảnh bìa).
2. **Quản lý nội dung**
   - Chỉnh sửa thông tin bài hát, album, playlist.
   - Xóa nội dung không còn hợp lệ.
3. **Hồ sơ nghệ sĩ**
   - Quản lý avatar, mô tả, danh sách bài hát/album.
   - Xem thống kê lượt nghe và người theo dõi.

---

## 💻 Yêu cầu hệ thống

### **Phần cứng**
- CPU: Intel i5+
- RAM: 8 GB+
- SSD: 256 GB+
- Mạng: ≥ 10 Mbps

### **Phần mềm**
- **Trình duyệt**: Chrome, Firefox, Edge (hỗ trợ HTML5)
- **Backend**: Node.js 18.x LTS, MongoDB 6.x
- **Frontend**: React.js + Redux
- **Media Storage**: Cloudinary

---

## 🏗 Kiến trúc phần mềm
- **Frontend**: React.js (component hóa theo module Authentication, User, Music Player, Playlist, Artist, Payment).
- **Backend**: Node.js + Express (REST API, JWT auth, xử lý logic nghiệp vụ).
- **Database**: MongoDB (lưu trữ user, playlist, bài hát, album, giao dịch).
- **Cloud Storage**: Cloudinary (media).
- **Triển khai**: Chạy trên web, tối ưu desktop.
- **Version Control**: Git + GitHub.

**Cấu trúc thư mục:**
```
backend/   # API backend
frontend/  # UI frontend
```

---

## 🎨 Giao diện người dùng
- **Trang chủ**: Trending Songs, Popular Artists, Popular Albums.
- **Authentication**: Login, Sign up, Forgot password (OTP + OAuth).
- **Search**: Bộ lọc Songs, Albums, Playlists, Artists, Profiles.
- **Quản lý nhạc**: Upload, chỉnh sửa, xóa.
- **Playlist Management**: Tạo/sửa/xóa playlist.
- **Artist Profile**: Hiển thị avatar, mô tả, nội dung phát hành.

---

## 🧪 Kế hoạch kiểm thử
- **Chức năng**: Like song, Player, Upload, Playlist, Search, Payment, Follow/Unfollow.
- **Phi chức năng**: Hiệu năng, bảo mật, usability, tương thích trình duyệt.
- **Môi trường**: Windows 10 (32/64 bit), macOS Yosemite; Chrome, Firefox, Edge.
- **Công cụ**: Google Sheets (test case), Google Docs (test plan), GitHub (code), Google Meet (trao đổi nhóm).

---

## 📊 Bảng Use Case
| Mã | Tên Use Case | Mô tả ngắn |
|----|--------------|------------|
| AU1.1 | Log In | Đăng nhập qua Email/Password hoặc OAuth |
| AU1.2 | Log Out | Đăng xuất, xóa token |
| AU1.3 | Forgot Password | Reset mật khẩu qua email/OTP |
| AU1.4 | Sign Up | Đăng ký tài khoản mới |
| L1.1 | Follow/Unfollow | Theo dõi hoặc bỏ theo dõi nghệ sĩ |
| L1.2 | Like Song | Thích/bỏ thích bài hát |
| L2.1 | View & Update Profile | Xem & chỉnh sửa hồ sơ |
| L2.2 | Edit Personal Info | Cập nhật email, giới tính, ngày sinh |
| L3 | Register & Pay Premium | Đăng ký gói Premium/Family qua PayOS |
| L4.1 | Search Content | Tìm kiếm nhạc, album, playlist, nghệ sĩ, profile |
| L4.3 | AI Recommendations | Gợi ý nhạc dựa trên tâm trạng và lịch sử nghe |
| L5.1-L5.3 | Playlist CRUD | Tạo, sửa, xóa playlist |
| AR3.1-AR3.3 | Song CRUD | Upload, chỉnh sửa, xóa bài hát |

---

## ⚙ Cài đặt & Chạy dự án
```bash
# Clone repo
git clone https://github.com/<username>/fitcify.git
cd fitcify

# Cài backend
cd backend
npm install

# Cài frontend
cd ../frontend
npm install

# Chạy backend
cd ../backend
npm start

# Chạy frontend
cd ../frontend
npm start
```
Truy cập: `http://localhost:3000`

---

## 🤝 Đóng góp
1. Fork repo
2. Tạo branch mới (`git checkout -b feature/tinh-nang`)
3. Commit thay đổi (`git commit -m "Mô tả thay đổi"`)
4. Push (`git push origin feature/tinh-nang`)
5. Tạo Pull Request

---

## 📜 Bản quyền
© 2025 Fitcify Team.  
Phát triển cho mục đích học tập & nghiên cứu. Không sử dụng thương mại nếu chưa được phép.
