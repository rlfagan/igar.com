# Railway Deployment Guide

This guide covers deploying the IGAR.ai backend and database to Railway, and frontend to Vercel.

## Architecture

- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Node.js/Express with Docker)
- **Database**: Railway (PostgreSQL)

---

## Part 1: Deploy Database to Railway

### Step 1: Create PostgreSQL Database

1. Go to [Railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Railway will automatically create and provision your database

### Step 2: Get Database Connection Details

Railway will provide these environment variables automatically:
- `DATABASE_URL` - Full PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual connection details

**Note these down** - you'll need them for the backend service.

---

## Part 2: Deploy Backend to Railway

### Step 1: Create Backend Service

1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Connect your GitHub account if not already connected
3. Select your repository: `rlfagan/igar.com`
4. Railway will detect the Docker setup automatically

### Step 2: Configure Build Settings

Railway should auto-detect the Dockerfile. If not:

1. Go to **Settings** → **Build**
2. Set **Root Directory**: `backend`
3. Set **Dockerfile Path**: `backend/Dockerfile`

### Step 3: Set Environment Variables

In the backend service, go to **Variables** and add:

```bash
# Port (Railway provides this automatically, but you can override)
PORT=9501

# Database Connection (use the PostgreSQL service's DATABASE_URL)
# Railway can reference other services with: ${{Postgres.DATABASE_URL}}
DATABASE_URL=${{Postgres.DATABASE_URL}}

# OR set individual connection parameters
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
PGDATABASE=${{Postgres.PGDATABASE}}

# Node Environment
NODE_ENV=production

# Anthropic API Key (for AI review features)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# CORS Origin (your Vercel frontend URL)
FRONTEND_URL=https://your-app.vercel.app
```

### Step 4: Deploy

1. Click **"Deploy"** - Railway will build and deploy your backend
2. Once deployed, Railway will provide a public URL like: `https://your-backend.up.railway.app`
3. **Save this URL** - you'll need it for Vercel

### Step 5: Run Database Migrations and Seed

After first deployment, you need to initialize the database:

1. Go to your backend service
2. Open the **"Shell"** tab (or use Railway CLI)
3. Run these commands:

```bash
# Run migrations
npm run migrate

# Seed the database
npm run seed
```

**Important**: Make sure migrations run successfully before seeding.

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import `rlfagan/igar.com` from GitHub

### Step 2: Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Node Version**: 20.x

### Step 3: Set Environment Variables

Add this environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

Replace `https://your-backend.up.railway.app` with your actual Railway backend URL.

### Step 4: Deploy

Click **"Deploy"** - Vercel will build and deploy your frontend.

---

## Part 4: Post-Deployment Configuration

### Update CORS on Backend

After getting your Vercel URL, update the backend's `FRONTEND_URL` environment variable on Railway:

```bash
FRONTEND_URL=https://your-actual-app.vercel.app
```

Then redeploy the backend service.

### Verify Everything Works

1. Visit your Vercel frontend URL
2. Try logging in (use demo credentials or create new user)
3. Test Quick Import feature (HuggingFace/OpenAI/Anthropic)
4. Check that API calls work (check Network tab in browser DevTools)

---

## Railway CLI (Optional)

For easier deployments and management, install Railway CLI:

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy from local
railway up

# Run commands in Railway environment
railway run npm run migrate
railway run npm run seed

# View logs
railway logs
```

---

## Database Backup

Railway automatically backs up your PostgreSQL database. To restore or download:

1. Go to PostgreSQL service in Railway
2. Click **"Data"** tab
3. Use pgAdmin or any PostgreSQL client with the connection details

---

## Monitoring and Logs

### Backend Logs
- Railway Dashboard → Backend Service → **"Deployments"** → View logs

### Frontend Logs
- Vercel Dashboard → Your Project → **"Deployments"** → Function logs

---

## Environment Variables Reference

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `9501` |
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-...` |
| `FRONTEND_URL` | Vercel frontend URL | `https://app.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Railway backend URL | `https://backend.railway.app` |

---

## Troubleshooting

### Backend won't connect to database
- Check that DATABASE_URL is set correctly
- Verify PostgreSQL service is healthy
- Check Railway logs for connection errors

### Frontend can't reach backend
- Verify NEXT_PUBLIC_API_URL is set on Vercel
- Check CORS settings in backend (FRONTEND_URL must match Vercel URL)
- Check Railway backend is deployed and healthy

### Database migrations fail
- Ensure PostgreSQL service is running first
- Check connection string format
- Run migrations manually via Railway shell

### Quick Import not working
- Check backend logs on Railway
- Verify axios is installed (should be in package.json)
- Test the `/api/models/fetch-metadata` endpoint directly

---

## Scaling and Performance

### Railway
- **Auto-scaling**: Enabled by default
- **Memory**: Adjust in service settings if needed
- **Database**: Upgrade plan for more connections/storage

### Vercel
- **Auto-scaling**: Handled automatically
- **Edge Network**: Global CDN
- **Serverless Functions**: 10-second timeout on Hobby plan

---

## Costs

### Railway
- **Free Tier**: $5/month credit
- **Database**: ~$5-10/month
- **Backend**: ~$5-10/month
- **Total**: ~$10-20/month

### Vercel
- **Free Tier**: Generous for personal projects
- **Pro**: $20/month if needed (commercial use)

---

## Support

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **IGAR.ai Issues**: [github.com/rlfagan/igar.com/issues](https://github.com/rlfagan/igar.com/issues)
