# Project Fullstack React + Node.js với Docker

## Giới thiệu

Dự án này là ứng dụng web fullstack sử dụng:

- **Backend**: Node.js 22.20.0 + Express (hoặc framework bạn dùng)
- **Frontend**: React (phiên bản trong package.json)
- **Docker**: Tất cả container đều chạy trên Docker, không cần cài Node hay npm trên máy local.
- **Frontend serve**: Nginx 1.27
- **Backend port**: 5000
- **Frontend port**: 3000

Mục tiêu: Người mới vào dự án chỉ cần Docker là chạy được toàn bộ hệ thống.

---

## Cài đặt Docker

### 2.1 Windows / macOS
- Tải **Docker Desktop**: [https://www.docker.com/products/docker-desktop]
- Chọn bản **amd64** nếu máy Intel/AMD, **arm64** nếu Mac M1/M2.
- Cài đặt và bật Docker Desktop.
- Tải Mongodb Compasss: https://www.mongodb.com/try/download/compass


### 2.2 Linux
- Cài Docker Engine + Docker Compose:
sudo apt update
sudo apt install docker.io docker-compose-plugin

### Kiểm tra docker
docker -v
docker compose version

### Build docker 
docker-compose build

### Chạy dự án
docker-compose up
