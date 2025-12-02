# 📚 Hệ thống Ôn thi Chứng chỉ Nghiệp vụ Đấu thầu

Ứng dụng web ôn tập và thi thử trực tuyến cho chứng chỉ nghiệp vụ chuyên môn về đấu thầu.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Tính năng

### 🎯 Hai chế độ học tập

#### 1. **Chế độ Ôn luyện**
- 📖 Làm cả 340 câu hỏi
- ✅ Xem đáp án đúng/sai ngay lập tức
- 💾 Lưu tiến trình tự động
- 🔄 Có thể quay lại làm bất kỳ lúc nào

#### 2. **Chế độ Thi thử**
- 🎲 70 câu hỏi ngẫu nhiên từ 340 câu
- ⏱️ Đếm ngược 30 phút
- 📊 Kết quả chi tiết sau khi nộp bài
- ✔️ Đạt/Không đạt (≥ 50% để qua)
- 📝 Xem lại các câu trả lời sai

## 🚀 Bắt đầu nhanh

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Không cần cài đặt Node.js hay bất kỳ dependencies nào

### Cài đặt

**Bước 1: Tải project**
```bash
# Clone repository (nếu có)
git clone https://github.com/your-username/quiz-app.git
cd quiz-app

# Hoặc giải nén file ZIP đã tải về
```

**Bước 2: Tạo file questions.json**

Tạo thư mục `js/data/` và file `questions.json` với cấu trúc:

```json
{
  "title": "BỘ ĐỀ ÔN THI CHỨNG CHỈ NGHIỆP VỤ CHUYÊN MÔN VỀ ĐẤU THẦU",
  "totalQuestions": 340,
  "questions": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi...",
      "options": {
        "A": "Đáp án A",
        "B": "Đáp án B",
        "C": "Đáp án C",
        "D": "Đáp án D"
      },
      "correctAnswer": "A"
    },
    {
      "id": 2,
      "question": "Câu hỏi tiếp theo...",
      "options": {
        "A": "Đáp án A",
        "B": "Đáp án B",
        "C": "Đáp án C",
        "D": "Đáp án D"
      },
      "correctAnswer": "B"
    }
    // ... 340 câu hỏi
  ]
}
```

**Bước 3: Chạy ứng dụng**

Mở file `index.html` bằng trình duyệt:
- Double-click vào file `index.html`
- Hoặc kéo thả file vào trình duyệt
- Hoặc dùng Live Server (VSCode extension)

## 📁 Cấu trúc thư mục

```
quiz-app/
│
├── index.html              # Trang chủ
├── practice.html           # Trang ôn luyện
├── exam.html              # Trang thi thử
├── README.md              # File hướng dẫn này
│
├── css/                   # Thư mục CSS
│   ├── style.css         # CSS chung
│   ├── practice.css      # CSS cho ôn luyện
│   └── exam.css          # CSS cho thi thử
│
└── js/                    # Thư mục JavaScript
    ├── practice.js       # Logic ôn luyện
    ├── exam.js           # Logic thi thử
    │
    ├── utils/            # Thư mục tiện ích
    │   ├── shuffle.js   # Random câu hỏi
    │   ├── storage.js   # LocalStorage helper
    │   ├── timer.js     # Quản lý timer
    │   └── calculator.js # Tính điểm
    │
    └── data/             # Thư mục dữ liệu
        └── questions.json # 340 câu hỏi (TỰ TẠO)
```

## 🎮 Hướng dẫn sử dụng

### Trang chủ
1. Mở `index.html`
2. Chọn chế độ:
   - **Ôn luyện**: Học và xem đáp án ngay
   - **Thi thử**: Làm bài thi 30 phút

### Chế độ Ôn luyện
- Click vào đáp án A/B/C/D để chọn
- Màu **xanh** = đáp án đúng ✅
- Màu **đỏ** = đáp án sai bạn chọn ❌
- Dùng nút "Câu trước" / "Câu sau" để di chuyển
- Click số câu bên phải để nhảy đến câu đó
- Tiến trình được lưu tự động

**Phím tắt:**
- `←` / `→` : Chuyển câu trước/sau
- `1-4` : Chọn đáp án A-D

### Chế độ Thi thử
- 70 câu được chọn ngẫu nhiên
- Timer đếm ngược 30 phút
- Chọn đáp án (có thể đổi trước khi nộp)
- Click "Nộp bài" khi hoàn thành
- Xem kết quả và các câu sai

**Phím tắt:**
- `←` / `→` : Chuyển câu
- `1-4` : Chọn đáp án
- `Ctrl + Enter` : Nộp bài

**Lưu ý:**
- ⚠️ Cảnh báo khi còn 5 phút
- ⏰ Tự động nộp bài khi hết giờ
- 🔒 Cảnh báo khi đóng tab

## 🔧 Tùy chỉnh

### Thay đổi số câu thi thử
Mở file `js/exam.js`, tìm dòng:
```javascript
examQuestions = getRandomQuestions(allQuestions, 70);
```
Đổi `70` thành số khác (VD: 50, 100...)

### Thay đổi thời gian thi
Mở file `js/exam.js`, tìm dòng:
```javascript
let timeLeft = 30 * 60; // 30 phút
```
Đổi `30` thành số phút mong muốn

### Thay đổi điểm đạt
Mở file `js/exam.js`, tìm:
```javascript
const passed = percentage >= 50;
```
Đổi `50` thành phần trăm mong muốn

### Thay đổi màu sắc
Mở file `css/style.css`, tìm `:root` và thay đổi các biến:
```css
:root {
    --primary: #3b82f6;     /* Màu chính */
    --success: #10b981;     /* Màu đúng */
    --error: #ef4444;       /* Màu sai */
    /* ... */
}
```



## 💾 LocalStorage

Ứng dụng sử dụng LocalStorage để lưu:
- Tiến trình ôn luyện
- Thống kê người dùng

Để xóa dữ liệu:
1. Mở Developer Console (F12)
2. Gõ: `localStorage.clear()`
3. Reload trang

Hoặc vào Settings → Privacy → Clear Browsing Data

## 🐛 Xử lý lỗi

### Lỗi: "Không thể tải câu hỏi"
- ✅ Kiểm tra file `js/data/questions.json` có tồn tại
- ✅ Kiểm tra định dạng JSON đúng
- ✅ Mở Developer Console (F12) để xem lỗi chi tiết

### Lỗi: CSS không load
- ✅ Kiểm tra đường dẫn file CSS
- ✅ Clear cache trình duyệt (Ctrl + Shift + R)

### Lỗi: JavaScript không chạy
- ✅ Kiểm tra console có lỗi
- ✅ Đảm bảo đúng thứ tự import scripts

### Câu hỏi hiển thị "N/A"
- ✅ Kiểm tra format của `options` trong JSON
- ✅ Đảm bảo có đủ A, B, C, D

## 📊 Tính năng nâng cao

### Debug Functions

Mở Console (F12) và sử dụng:

**Trong trang ôn luyện:**
```javascript
showProgressStats()  // Xem thống kê tiến trình
resetProgress()      // Reset tiến trình
```

**Trong trang thi thử:**
```javascript
console.log(examQuestions)  // Xem câu hỏi
console.log(userAnswers)    // Xem câu trả lời
console.log(timeLeft)       // Xem thời gian còn lại
```

## 🤝 Đóng góp

Contributions, issues và feature requests đều được chào đón!

1. Fork project
2. Tạo branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tác giả

- **Your Name** - [GitHub Profile](https://github.com/your-Onyxcapiti)

## 🙏 Lời cảm ơn

- Font icons từ Emoji
- CSS Variables cho theming
- LocalStorage API


**⭐ Nếu project hữu ích, hãy cho 1 star trên GitHub!**

---

## 🔄 Changelog

### Version 1.0.0 (2024-12-02)
- ✅ Chế độ ôn luyện 340 câu
- ✅ Chế độ thi thử 70 câu
- ✅ Timer 30 phút
- ✅ Lưu tiến trình LocalStorage
- ✅ Responsive design
- ✅ Keyboard shortcuts

---

Made with ❤️ for learning