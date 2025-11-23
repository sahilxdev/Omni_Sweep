# 🚀 Deploy Backend to Railway

## Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Railway deployment config"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app/
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `sahilxdev/Omni_Sweep`
   - Select `backend` folder as root directory
   - Railway will auto-detect Dockerfile

3. **Set Environment Variables**
   In Railway dashboard, add:
   ```
   PORT=3001
   ONEINCH_API_KEY=your_api_key_here
   NODE_ENV=production
   ```

4. **Get Your API URL**
   Railway will give you a URL like:
   ```
   https://omnisweep-backend-production.up.railway.app
   ```

5. **Test Deployment**
   ```bash
   curl https://your-railway-url.railway.app/api/health
   ```

## For Frontend Dev

Share this API URL:
```
API_BASE_URL=https://your-railway-url.railway.app
```

Endpoints:
- `GET /api/health` - Health check
- `GET /api/quote?tokenIn=<addr>&amount=<wei>` - Get swap quote
- `GET /api/contracts` - Get all contract addresses

## Environment Variables Needed

```env
PORT=3001
ONEINCH_API_KEY=your_1inch_api_key
NODE_ENV=production
```
