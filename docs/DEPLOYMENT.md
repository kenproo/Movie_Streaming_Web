# ChillFilm — Deployment Guide

## Yêu cầu EC2
- Ubuntu 22.04 LTS
- t3.medium hoặc cao hơn (2 vCPU, 4GB RAM)
- 20GB+ EBS
- Security Group: inbound 22, 80, 443

## Cài đặt EC2 lần đầu

### 1. Cài Git và Docker
```bash
sudo apt-get update
sudo apt-get install -y git curl
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone repository
```bash
sudo mkdir -p /opt/movie-streaming-web
sudo chown $USER:$USER /opt/movie-streaming-web
git clone https://github.com/YOUR_ORG/movie-streaming-web.git /opt/movie-streaming-web
cd /opt/movie-streaming-web
git checkout production
```

### 3. Tạo thư mục production
```bash
sudo mkdir -p /opt/movie-service/{logs,backups/mysql,backups/qdrant,nginx,scripts}
sudo chown -R $USER:$USER /opt/movie-service
```

### 4. Copy files production
```bash
cp /opt/movie-streaming-web/deploy/ec2/docker-compose.prod.yml /opt/movie-service/
cp -r /opt/movie-streaming-web/deploy/ec2/scripts/* /opt/movie-service/scripts/
chmod +x /opt/movie-service/scripts/*.sh
```

### 5. Tạo `.env`
```bash
cp /opt/movie-streaming-web/deploy/ec2/env/.env.example /opt/movie-service/.env
nano /opt/movie-service/.env  # Điền giá trị thực
```

### 6. Restore MySQL (nếu có backup)
```bash
# Giả sử backup ở /opt/movie-service/backups/mysql/chillfilm-*.sql.gz
GUNZIP_FILE=$(ls -1t /opt/movie-service/backups/mysql/*.sql.gz | head -1)
docker compose -f /opt/movie-service/docker-compose.prod.yml up -d mysql
sleep 30
zcat "$GUNZIP_FILE" | docker exec -i $(docker ps -qf name=mysql) mysql -u root -p"$MYSQL_ROOT_PASSWORD" chillfilm
```

### 7. Restore Qdrant (nếu có snapshot)
```bash
docker compose -f /opt/movie-service/docker-compose.prod.yml up -d qdrant
curl -X POST "http://localhost:6333/collections/chillfilm_movies/snapshots/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "snapshot=@/opt/movie-service/backups/qdrant/chillfilm_movies-*.snapshot"
```

### 8. Start services
```bash
cd /opt/movie-service
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=50
```

### 9. Cài Nginx
```bash
sudo apt-get install -y nginx
sudo cp /opt/movie-streaming-web/deploy/ec2/nginx/api.chillfilm.io.vn.conf \
  /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/api.chillfilm.io.vn.conf \
  /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 10. Cài HTTPS với Certbot
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.chillfilm.io.vn
sudo systemctl reload nginx
```

### 11. Cấu hình Vercel
1. Import repository từ GitHub
2. Framework preset: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output: `dist`
6. Install command: `npm ci`
7. Thêm environment variables:
   - `VITE_API_BASE_URL=https://api.chillfilm.io.vn/api`
   - `VITE_RAG_API_BASE_URL=https://api.chillfilm.io.vn/api/chatbot`

## Rollback
```bash
# Xem các commit gần đây
cd /opt/movie-streaming-web && git log --oneline -10

# Rollback về commit cụ thể
/opt/movie-service/scripts/rollback.sh <commit-hash>
```

## Backup thủ công
```bash
/opt/movie-service/scripts/backup-mysql.sh
/opt/movie-service/scripts/backup-qdrant.sh
```
