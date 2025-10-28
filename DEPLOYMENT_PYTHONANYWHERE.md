# 🐍 Deploy DocuFlow ke PythonAnywhere

## Langkah 1: Buat Akun PythonAnywhere

1. Buka https://www.pythonanywhere.com
2. Klik **"Pricing & signup"**
3. Pilih **"Create a Beginner account"** (GRATIS)
4. Isi form registrasi dan verifikasi email

## Langkah 2: Upload Code ke PythonAnywhere

### Opsi A: Clone dari GitHub (RECOMMENDED)

1. Login ke PythonAnywhere
2. Klik tab **"Consoles"**
3. Klik **"Bash"** untuk membuka terminal
4. Jalankan command:

```bash
git clone https://github.com/Fitrah-Andhika-Ramadhan/docflow.git
cd docflow/backend
```

### Opsi B: Upload Manual

1. Klik tab **"Files"**
2. Upload semua file backend ke folder `/home/YOUR_USERNAME/docflow/backend`

## Langkah 3: Install Dependencies

Di Bash console, jalankan:

```bash
cd ~/docflow/backend
pip3.10 install --user -r requirements.txt
```

## Langkah 4: Setup Web App

1. Klik tab **"Web"**
2. Klik **"Add a new web app"**
3. Pilih **"Manual configuration"**
4. Pilih **"Python 3.10"**
5. Klik **"Next"**

## Langkah 5: Configure WSGI File

1. Di halaman Web app, scroll ke **"Code"** section
2. Klik link **"WSGI configuration file"** (contoh: `/var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py`)
3. **Hapus semua isi file** dan ganti dengan:

```python
import sys
import os
from pathlib import Path

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/docflow/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['MONGO_URL'] = 'mongodb+srv://docflow_db:main123@cluster0.bbuyo04.mongodb.net/?appName=Cluster0'
os.environ['DB_NAME'] = 'docflow_db'
os.environ['CORS_ORIGINS'] = '*'
os.environ['SECRET_KEY'] = 'your-secret-key-change-in-production-123456789'

# Import FastAPI app
from server import app as application

# ASGI to WSGI adapter for FastAPI
from asgiref.wsgi import WsgiToAsgi
application = WsgiToAsgi(application)
```

**PENTING**: Ganti `YOUR_USERNAME` dengan username PythonAnywhere Anda!

4. Klik **"Save"**

## Langkah 6: Install ASGI Adapter

Kembali ke Bash console:

```bash
pip3.10 install --user asgiref
```

## Langkah 7: Set Virtual Environment (Optional tapi Recommended)

1. Di halaman Web app, scroll ke **"Virtualenv"** section
2. Masukkan path: `/home/YOUR_USERNAME/.local`
3. Atau buat virtualenv baru:

```bash
cd ~
python3.10 -m venv docflow-env
source docflow-env/bin/activate
cd docflow/backend
pip install -r requirements.txt
```

Lalu set virtualenv path ke: `/home/YOUR_USERNAME/docflow-env`

## Langkah 8: Reload Web App

1. Scroll ke atas halaman Web
2. Klik tombol hijau besar **"Reload YOUR_USERNAME.pythonanywhere.com"**
3. Tunggu beberapa detik

## Langkah 9: Test Backend

Backend Anda sekarang live di:
```
https://YOUR_USERNAME.pythonanywhere.com
```

Test API:
```
https://YOUR_USERNAME.pythonanywhere.com/api/auth/me
```

API Docs:
```
https://YOUR_USERNAME.pythonanywhere.com/docs
```

## Langkah 10: Deploy Frontend ke Vercel

1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik **"Add New"** → **"Project"**
4. Import repository **"docflow"**
5. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://YOUR_USERNAME.pythonanywhere.com
   ```
7. Klik **"Deploy"**

## ✅ Selesai!

Aplikasi Anda sekarang live:
- **Backend**: `https://YOUR_USERNAME.pythonanywhere.com`
- **Frontend**: `https://docflow-xxx.vercel.app`

## 🔧 Troubleshooting

### Error: "ModuleNotFoundError"
```bash
cd ~/docflow/backend
pip3.10 install --user -r requirements.txt
```

### Error: "No module named 'asgiref'"
```bash
pip3.10 install --user asgiref
```

### Error: "Connection timeout to MongoDB"
- Pastikan MongoDB Atlas IP whitelist sudah set ke `0.0.0.0/0`
- Check environment variables di WSGI file

### Error: "502 Bad Gateway"
- Check error log di tab **"Web"** → **"Error log"**
- Pastikan WSGI file sudah benar
- Reload web app

## 📝 Catatan

- **Free tier PythonAnywhere**:
  - 1 web app
  - 512MB disk space
  - Daily CPU limit
  - Cukup untuk development/testing
  
- **Upgrade** jika butuh:
  - Multiple web apps
  - More disk space
  - No CPU limit
  - Custom domain

## 🔄 Update Code

Jika ada perubahan code:

```bash
cd ~/docflow
git pull origin main
# Reload web app dari dashboard
```
