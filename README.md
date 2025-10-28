# DocuFlow - Digital Document Management System

Modern web application untuk mengelola dokumen digital dengan kategori, tags, dan fitur pencarian.

## ✨ Fitur

- ✅ Autentikasi User (JWT)
- ✅ Upload Dokumen (PDF, Images, Docs)
- ✅ Organisir dengan Kategori
- ✅ Tag Dokumen
- ✅ Fitur Pencarian
- ✅ Download Dokumen
- ✅ UI Modern dengan Tailwind CSS

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- MongoDB
- JWT Authentication
- Motor (Async MongoDB Driver)

**Frontend:**
- React 18
- Tailwind CSS
- Shadcn UI Components
- Axios

## 📦 Instalasi

### Prasyarat
- Python 3.8+
- Node.js 16+
- MongoDB (lokal atau cloud)

### Backend Setup

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Pastikan MongoDB berjalan di `mongodb://localhost:27017`

4. Jalankan server:
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Backend akan berjalan di: `http://localhost:8001`

### Frontend Setup

1. Masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm start
```

Frontend akan berjalan di: `http://localhost:3000`

## 🔐 Environment Variables

### Backend `.env`
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=docflow_db
CORS_ORIGINS=*
SECRET_KEY=your-secret-key-here
```

### Frontend `.env`
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get user saat ini

### Categories
- `POST /api/categories` - Buat kategori
- `GET /api/categories` - Get semua kategori
- `DELETE /api/categories/{id}` - Hapus kategori

### Documents
- `POST /api/documents` - Upload dokumen
- `GET /api/documents` - Get semua dokumen
- `GET /api/documents/{id}` - Get dokumen by ID
- `PUT /api/documents/{id}` - Update dokumen
- `DELETE /api/documents/{id}` - Hapus dokumen
- `GET /api/documents/{id}/download` - Download dokumen

## 🚀 Cara Menggunakan

1. Buka browser dan akses `http://localhost:3000`
2. Register akun baru atau login
3. Buat kategori untuk mengorganisir dokumen
4. Upload dokumen dengan judul, kategori, dan tags
5. Gunakan fitur search untuk mencari dokumen
6. Download atau edit dokumen sesuai kebutuhan

## 📝 Catatan

- Pastikan MongoDB sudah berjalan sebelum menjalankan backend
- File yang diupload akan disimpan di folder `backend/uploads/`
- Untuk production, ganti `SECRET_KEY` di `.env` dengan key yang lebih aman

## 🤝 Kontribusi

Silakan buat pull request atau laporkan issue jika menemukan bug.

## 📄 Lisensi

MIT License
