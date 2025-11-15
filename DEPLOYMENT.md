# Deployment Guide

This guide covers deploying the AI Intake System to production.

## Pre-Deployment Checklist

- [ ] Anthropic API key obtained
- [ ] Database backup strategy defined
- [ ] SSL certificates acquired
- [ ] Domain name configured
- [ ] Environment variables secured
- [ ] Monitoring tools set up
- [ ] Log aggregation configured

## Environment Setup

### 1. Create Production Environment File

```bash
cp .env.example .env.production
```

Update with production values:

```env
# Database - Use strong password
DATABASE_URL=postgresql://aiintake:STRONG_PASSWORD@postgres:5432/ai_intake

# API Keys - Keep secure
ANTHROPIC_API_KEY=sk-ant-api03-...

# Security - Generate strong secret
JWT_SECRET=use-a-cryptographically-secure-random-string-here

# Application
NODE_ENV=production
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Frontend - Use your production domain
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 24
```

## Docker Deployment

### Option 1: Docker Compose (Recommended for small-medium deployments)

1. **Update docker-compose.yml for production**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ai-intake-db-prod
    environment:
      POSTGRES_USER: aiintake
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ai_intake
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aiintake"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ai-intake-backend-prod
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
    volumes:
      - uploads:/app/uploads
    depends_on:
      postgres:
        condition: service_healthy
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ai-intake-frontend-prod
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    depends_on:
      - backend
    restart: always

  nginx:
    image: nginx:alpine
    container_name: ai-intake-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    restart: always

volumes:
  postgres_data:
  uploads:
```

2. **Create Nginx configuration**

```bash
mkdir -p nginx/ssl nginx/logs
```

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # Frontend
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        client_max_body_size 50M;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # Backend API
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        client_max_body_size 50M;

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }
    }
}
```

3. **Add SSL certificates**

Place your SSL certificates in `nginx/ssl/`:
- `fullchain.pem`
- `privkey.pem`

Or use Let's Encrypt:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Get certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Copy to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
```

4. **Deploy**

```bash
# Build and start
docker-compose -f docker-compose.yml --env-file .env.production up -d --build

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

## Cloud Deployment

### AWS ECS Deployment

1. **Create ECR repositories**

```bash
aws ecr create-repository --repository-name ai-intake-backend
aws ecr create-repository --repository-name ai-intake-frontend
```

2. **Build and push images**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t ai-intake-backend .
docker tag ai-intake-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ai-intake-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ai-intake-backend:latest

# Build and push frontend
cd ../frontend
docker build -t ai-intake-frontend .
docker tag ai-intake-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ai-intake-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ai-intake-frontend:latest
```

3. **Set up RDS PostgreSQL**

```bash
aws rds create-db-instance \
  --db-instance-identifier ai-intake-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username aiintake \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20
```

4. **Create ECS task definitions and services** using AWS Console or CLI

### Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (TODO: create these files)

## Post-Deployment

### 1. Verify Deployment

```bash
# Check health endpoint
curl https://api.yourdomain.com/health

# Check frontend
curl https://yourdomain.com

# Check database connection
docker-compose exec backend npm run migrate
```

### 2. Set Up Monitoring

**Prometheus + Grafana**

```bash
# Add to docker-compose.yml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3002:3000"
  depends_on:
    - prometheus
```

**Application Performance Monitoring**

Consider adding:
- New Relic
- Datadog
- Sentry for error tracking

### 3. Set Up Backups

**Database Backups**

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U aiintake ai_intake > backup_$DATE.sql
# Upload to S3
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
# Keep local backups for 7 days
find . -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 4. Set Up Log Aggregation

**ELK Stack**

```bash
# Add to docker-compose.yml
elasticsearch:
  image: elasticsearch:8.11.0
  environment:
    - discovery.type=single-node
  ports:
    - "9200:9200"

logstash:
  image: logstash:8.11.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

kibana:
  image: kibana:8.11.0
  ports:
    - "5601:5601"
  depends_on:
    - elasticsearch
```

### 5. Configure Alerts

Set up alerts for:
- High error rates
- Slow API responses
- Database connection failures
- Disk space issues
- High CPU/memory usage

## Scaling

### Horizontal Scaling

```yaml
# Update docker-compose.yml
backend:
  deploy:
    replicas: 3

frontend:
  deploy:
    replicas: 2
```

### Load Balancing

Configure nginx upstream with multiple backend instances:

```nginx
upstream backend {
    least_conn;
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}
```

## Security Hardening

1. **Enable firewall**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Fail2ban**
   ```bash
   sudo apt-get install fail2ban
   ```

3. **Regular updates**
   ```bash
   # Update system packages
   sudo apt-get update && sudo apt-get upgrade

   # Update Docker images
   docker-compose pull
   docker-compose up -d
   ```

4. **Secrets management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Never commit secrets to git
   - Rotate secrets regularly

## Troubleshooting

### Container won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database connection issues
```bash
docker-compose exec backend psql $DATABASE_URL
```

### SSL certificate issues
```bash
openssl s_client -connect yourdomain.com:443
```

### Performance issues
```bash
docker stats
docker-compose top
```

## Rollback Procedure

```bash
# Tag current version
docker-compose images

# Stop current deployment
docker-compose down

# Pull previous images
docker pull YOUR_REGISTRY/ai-intake-backend:previous-tag
docker pull YOUR_REGISTRY/ai-intake-frontend:previous-tag

# Start with previous version
docker-compose up -d
```

## Maintenance Windows

Schedule regular maintenance:
- Database optimization
- Log rotation
- Backup verification
- Security updates
- Certificate renewal
