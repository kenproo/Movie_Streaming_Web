# ChillFilm RAG Chatbot Service

Đây là service RAG (Retrieval-Augmented Generation) Chatbot được tách biệt bằng ngôn ngữ Python sử dụng FastAPI. Service này kết nối trực tiếp đến cơ sở dữ liệu MySQL và hỗ trợ tích hợp Gemini AI để trả lời câu hỏi của người dùng và đưa ra các gợi ý phim chính xác nhất.

## 🛠️ Công nghệ sử dụng
- **FastAPI**: Khung phát triển API hiệu năng cao.
- **SQLAlchemy & PyMySQL**: Kết nối và truy vấn cơ sở dữ liệu MySQL.
- **Google GenAI SDK**: Tích hợp mô hình Gemini AI (ví dụ: `gemini-2.5-flash`) để sinh câu trả lời tự nhiên.
- **Pydantic & Pydantic Settings**: Khai báo schema dữ liệu và quản lý biến môi trường.

## 📁 Cấu trúc thư mục
```
rag_chatbot/
├── services/
│   ├── query_service.py       # Chuẩn hóa câu truy vấn từ người dùng
│   ├── retrieval_service.py   # Tìm kiếm phim ứng viên từ MySQL
│   ├── rerank_service.py      # Xếp hạng phim ứng viên thông minh
│   └── generation_service.py  # Sinh phản hồi (hỗ trợ Mock & Gemini AI)
├── config.py                  # Quản lý cấu hình dự án
├── database.py                # Thiết lập kết nối SQLAlchemy
├── main.py                    # API Entrypoint (FastAPI)
├── requirements.txt           # Danh sách thư viện phụ thuộc
├── .env                       # Biến môi trường local (chứa key db, gemini)
└── .env.example               # Mẫu file biến môi trường
```

## 🚀 Hướng dẫn cài đặt và chạy thử

### 1. Chuẩn bị môi trường Python
Yêu cầu Python version >= 3.9. Bạn nên tạo một môi trường ảo (virtual environment) để cài đặt:

```bash
# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo (Windows)
.\venv\Scripts\activate

# Kích hoạt môi trường ảo (Linux / macOS)
source venv/bin/activate
```

### 2. Cài đặt các thư viện phụ thuộc
Cài đặt tất cả các thư viện cần thiết bằng lệnh:
```bash
pip install -r requirements.txt
```

### 3. Cấu hình biến môi trường
Mở file `.env` và điều chỉnh các thông số kết nối Database cũng như API Key nếu cần:
```ini
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=root
DB_NAME=movie_streaming_web

# Thêm Gemini API Key để kích hoạt RAG AI thật (không bắt buộc)
# Nếu không cung cấp, chatbot sẽ chạy ở chế độ Mock / Rule-based
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Khởi chạy Service
Chạy lệnh sau để khởi động FastAPI server ở chế độ tự động tải lại (development mode):
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Sau khi khởi chạy thành công, tài liệu API tương tác sẽ khả dụng tại: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📡 API Endpoints

### 1. RAG Chat Request
- **Endpoint**: `POST /rag/chat`
- **Request Body**:
  ```json
  {
    "message": "Tìm cho tôi phim hành động hay nhất",
    "userId": "optional-user-uuid-string",
    "sessionId": "optional-session-id"
  }
  ```
- **Response Body**:
  ```json
  {
    "answer": "Dựa trên yêu cầu của bạn, tôi gợi ý một số phim hành động nổi bật...",
    "recommendations": [
      {
        "id": "movie-uuid-1",
        "title": "Tên Phim 1",
        "slug": "ten-phim-1",
        "posterUrl": "https://...",
        "rating": 8.5,
        "year": 2023,
        "reason": "Matches your search: hành động",
        "score": 8.5
      }
    ],
    "sessionId": "session-id"
  }
  ```

### 2. Health Check
- **Endpoint**: `GET /health`
- **Response Body**:
  ```json
  {
    "status": "healthy",
    "service": "rag-chatbot"
  }
  ```
