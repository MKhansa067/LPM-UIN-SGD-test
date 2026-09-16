# 🐳 Panduan Deployment & Docker — LPM UIN SGD

Aplikasi di-containerize menggunakan Multi-Stage Dockerfile untuk menjamin kompatibilitas cross-platform (Linux, Windows, macOS).

---

## 🏗️ Mengapa Multi-Stage Build?
Docker image final dibuat super ringan (~200MB) karena hanya berisi runtime Next.js standalone hasil kompilasi, tanpa menyertakan node_modules dev atau source code mentah.

---

## 🚀 Langkah Deploy Production

### 1. Prasyarat Server
- OS: Linux (Ubuntu 22.04 LTS direkomendasikan) / Windows Server / cPanel dengan Support Docker
- Docker Engine 24.0+ & Docker Compose v2+

### 2. Menjalankan Container
```bash
# Clone repository
git clone https://github.com/uin-sgd/lpm-uin-sgd.git
cd lpm-uin-sgd

# Konfigurasi file .env.production
cp .env.example .env.production
# Edit nilai DATABASE_URL dan NEXTAUTH_SECRET

# Build & Run dengan Docker Compose Production
docker compose -f docker-compose.prod.yml up -d --build
```

### 3. Skalabilitas (Horizontal Scaling)
Untuk menambah instance replika aplikasi Next.js:
```bash
docker compose -f docker-compose.prod.yml up -d --scale lpm-app=3
```
Nginx otomatis akan melakukan Load Balancing (Round Robin) ke 3 container replika tersebut.
