# Zettel - 배포 가이드

프로덕션 환경 배포를 위한 단계별 가이드

## 배포 전 체크리스트

실제 배포를 진행하기 전에 [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)를 확인하세요.

## 배포 방법

### 방법 1: Docker Compose (권장)

가장 간단하고 안정적인 배포 방법입니다.

#### 1. 서버 준비

```bash
# 서버에 Docker와 Docker Compose 설치
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin

# 또는 공식 설치 스크립트 사용
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 2. 프로젝트 배포

```bash
# 서버에 프로젝트 클론
git clone https://github.com/username/zettel.git
cd zettel

# 환경 변수 설정
cp .env.example .env
nano .env  # YOUTUBE_API_KEY와 SECRET_KEY 설정

# Docker Compose 실행
docker compose up -d

# 로그 확인
docker compose logs -f
```

#### 3. 접속 확인

```bash
curl http://localhost:8000/
curl http://localhost:5173/
```

#### 4. Nginx 리버스 프록시 설정 (선택사항)

```nginx
# /etc/nginx/sites-available/zettel
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Nginx 설정 활성화
sudo ln -s /etc/nginx/sites-available/zettel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL 인증서 설정 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt-get install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

### 방법 2: 직접 배포

#### 1. 백엔드 배포

```bash
# 서버에 Python 3.11 설치
sudo apt-get update
sudo apt-get install -y python3.11 python3.11-venv

# 프로젝트 클론
git clone https://github.com/username/zettel.git
cd zettel/backend

# 가상환경 생성
python3.11 -m venv venv
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
nano .env

# Gunicorn을 사용한 프로덕션 실행
pip install gunicorn
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

#### 2. 백엔드 Systemd 서비스

```ini
# /etc/systemd/system/zettel-backend.service
[Unit]
Description=Zettel Backend API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/opt/zettel/backend
Environment="PATH=/opt/zettel/backend/venv/bin"
ExecStart=/opt/zettel/backend/venv/bin/gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable zettel-backend
sudo systemctl start zettel-backend
sudo systemctl status zettel-backend
```

#### 3. 프론트엔드 배포

```bash
# Node.js 20 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 프론트엔드 빌드
cd /opt/zettel/frontend
npm install
npm run build

# Nginx 설정
sudo cp nginx.conf /etc/nginx/sites-available/zettel-frontend

# 빌드 파일 복사
sudo mkdir -p /var/www/zettel
sudo cp -r dist/* /var/www/zettel/

# Nginx 재시작
sudo systemctl reload nginx
```

## 환경별 설정

### 개발 환경
```bash
# docker-compose.dev.yml 사용
docker compose -f docker-compose.dev.yml up -d
```

### 스테이징 환경
```bash
# 별도의 docker-compose.staging.yml 생성
# ENV=staging 설정
docker compose -f docker-compose.staging.yml up -d
```

### 프로덕션 환경
```bash
# docker-compose.yml 사용
# ENV=production 설정
docker compose up -d
```

## 데이터베이스 관리

### 백업

```bash
# SQLite 데이터베이스 백업
docker compose exec backend sqlite3 /app/data/zettel.db ".backup /app/data/backup-$(date +%Y%m%d).db"

# 백업 파일 다운로드
docker cp zettel-backend-1:/app/data/backup-20260117.db ./backup-20260117.db

# 또는 직접 복사
cp data/zettel.db data/backup-$(date +%Y%m%d).db
```

### 복원

```bash
# 백업 파일 업로드
docker cp ./backup-20260117.db zettel-backend-1:/app/data/

# 복원
docker compose exec backend sqlite3 /app/data/zettel.db ".restore /app/data/backup-20260117.db"
```

### 마이그레이션

```bash
# 마이그레이션 생성
docker compose exec backend alembic revision --autogenerate -m "description"

# 마이그레이션 실행
docker compose exec backend alembic upgrade head

# 롤백
docker compose exec backend alembic downgrade -1
```

## 모니터링

### 로그 수집

```bash
# Docker 로그
docker compose logs -f

# 특정 서비스 로그
docker compose logs -f backend
docker compose logs -f frontend

# 로그 저장
docker compose logs > logs/$(date +%Y%m%d).log
```

### 헬스체크

```bash
# 백엔드 헬스체크
curl http://localhost:8000/

# 프론트엔드 헬스체크
curl http://localhost:5173/health

# Docker 헬스체크 상태
docker compose ps
```

### 리소스 모니터링

```bash
# 컨테이너 리소스 사용량
docker stats

# 디스크 사용량
docker system df
```

## 업데이트 및 롤백

### 업데이트

```bash
# 1. 코드 업데이트
git pull origin main

# 2. 환경 변수 확인
diff .env .env.example

# 3. 백업 생성
cp data/zettel.db data/backup-before-update-$(date +%Y%m%d).db

# 4. 컨테이너 재빌드 및 재시작
docker compose down
docker compose up -d --build

# 5. 마이그레이션 실행 (필요시)
docker compose exec backend alembic upgrade head

# 6. 헬스체크
curl http://localhost:8000/
curl http://localhost:5173/
```

### 롤백

```bash
# 1. 컨테이너 중지
docker compose down

# 2. 이전 버전으로 체크아웃
git checkout <previous-commit>

# 3. 데이터베이스 복원
cp data/backup-before-update-20260117.db data/zettel.db

# 4. 컨테이너 재시작
docker compose up -d --build

# 5. 확인
docker compose logs -f
```

## 보안 설정

### 환경 변수 보안

```bash
# .env 파일 권한 설정
chmod 600 .env
chmod 600 backend/.env

# 소유자만 읽기/쓰기 가능
chown $USER:$USER .env
```

### 방화벽 설정

```bash
# UFW 사용 (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# 포트 8000, 5173은 외부 접근 차단 (Nginx를 통해서만 접근)
```

### 정기 업데이트

```bash
# 시스템 업데이트
sudo apt-get update
sudo apt-get upgrade -y

# Docker 이미지 업데이트
docker compose pull
docker compose up -d
```

## 성능 최적화

### Docker 리소스 제한

```yaml
# docker-compose.yml에 추가
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Nginx 캐싱

```nginx
# Nginx 설정에 추가
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$request_uri";
    # ... 기존 프록시 설정
}
```

### 데이터베이스 최적화

```bash
# SQLite VACUUM (정기적으로 실행)
docker compose exec backend sqlite3 /app/data/zettel.db "VACUUM;"

# 인덱스 확인
docker compose exec backend sqlite3 /app/data/zettel.db ".schema"
```

## 트러블슈팅

### 컨테이너가 시작되지 않을 때

```bash
# 로그 확인
docker compose logs backend
docker compose logs frontend

# 컨테이너 상태 확인
docker compose ps

# 강제 재시작
docker compose down --volumes
docker compose up -d --force-recreate
```

### 디스크 공간 부족

```bash
# 사용하지 않는 이미지 삭제
docker system prune -a

# 로그 파일 정리
docker compose logs --tail=100 > recent.log
> /var/log/docker.log
```

### 성능 저하

```bash
# 리소스 사용량 확인
docker stats

# 프로세스 확인
docker compose exec backend top

# 데이터베이스 최적화
docker compose exec backend sqlite3 /app/data/zettel.db "VACUUM; ANALYZE;"
```

## 고급 설정

### CI/CD 파이프라인

GitHub Actions 예시:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/zettel
            git pull
            docker compose up -d --build
```

### 로드 밸런싱

여러 백엔드 인스턴스 실행:

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
```

### CDN 설정

정적 파일을 CDN으로 서빙하여 성능 향상.

## 지원

- 문서: [README.md](./README.md)
- 이슈: GitHub Issues
- 통합 체크리스트: [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)
- 빠른 시작: [QUICKSTART.md](./QUICKSTART.md)
