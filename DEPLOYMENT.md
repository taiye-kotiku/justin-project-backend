# 🚀 DEPLOYMENT GUIDE

## Quick Links
- **Live Demo:** https://justin-project.netlify.app
- **Backend API:** https://justin-project-backend.onrender.com
- **Portfolio:** https://taiye.framer.website

---

## Deployment Overview

This project is deployed using:
- **Backend:** Render (https://render.com)
- **Frontend:** Netlify (https://netlify.com)
- **Automation:** n8n Cloud
- **API Key Management:** Environment Variables (Render/Netlify Secrets)

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- GitHub repository connected
- Environment variables configured

### Environment Variables Required
```
GOOGLE_GEMINI_API_KEY=sk_xxxxx
BLOTATO_API_KEY=xxxxx
GOOGLE_SHEETS_ID=xxxxx
GOOGLE_DRIVE_FOLDER_ID=xxxxx
INSTAGRAM_ACCOUNT_ID=xxxxx
NODE_ENV=production
PORT=10000
```

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Render dashboard
3. Add environment variables in Render settings
4. Deploy (automatic on push to main)

### Monitoring
- View logs: https://dashboard.render.com
- Check uptime: https://status.render.com

---

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account (free tier available)
- GitHub repository connected
- Environment variables configured

### Environment Variables Required
```
VITE_API_URL=https://justin-project-backend.onrender.com
VITE_API_TIMEOUT=30000
```

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Netlify dashboard
3. Add environment variables in Netlify settings
4. Deploy (automatic on push to main)

### Build Command
```bash
npm run build
```

### Publish Directory
```
dist
```

### Monitoring
- View builds: https://app.netlify.com
- Check analytics: https://analytics.netlify.com

---

## Local Development

### Backend
```bash
# Install dependencies
npm install

# Create .env.local file with your API keys
cp .env.example .env.local

# Start development server
npm run dev
```

### Frontend
```bash
# Install dependencies
npm install

# Create .env.local with API URL
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Start development server
npm run dev
```

---

## Updating Live Version

### For Backend Changes
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
# Render automatically deploys
```

### For Frontend Changes
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
# Netlify automatically deploys
```

---

## Troubleshooting

### Backend Not Responding
1. Check Render dashboard for errors
2. Verify environment variables are set
3. Check API key validity
4. View logs: `https://dashboard.render.com/services`

### Frontend Not Loading
1. Check Netlify build logs
2. Verify build command in settings
3. Check API URL in environment variables
4. Clear browser cache and hard refresh

### API 401/403 Errors
1. Verify API keys in Render environment
2. Check if keys are still valid
3. Ensure CORS is properly configured

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| **Composite Generation** | 15-25 seconds |
| **API Response** | < 100ms |
| **Frontend Load** | < 2 seconds |
| **Uptime (Backend)** | 99% |
| **Uptime (Frontend)** | 99% |

---

## Support

For issues or questions:
1. Check this deployment guide
2. Review environment variables
3. Check GitHub Issues
4. Contact: kotikutaiye@gmail.com

---

**Last Updated:** December 2025