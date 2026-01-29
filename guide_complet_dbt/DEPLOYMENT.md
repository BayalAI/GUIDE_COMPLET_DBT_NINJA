# 🚀 DEPLOYMENT GUIDE - Vercel

## Quick Deploy in 2 Minutes ⚡

### Option 1: GitHub (Recommended)

```bash
# 1. Initialize git repository
git init
git add .
git commit -m "Initial commit: DBT Ninja Guide"

# 2. Create GitHub repository
# Go to github.com/new and create repo

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/dbt-ninja-guide.git
git branch -M main
git push -u origin main

# 4. Deploy on Vercel
# Go to vercel.com/new
# Import your GitHub repo
# Click Deploy
```

### Option 2: Vercel CLI

```powershell
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

### Option 3: Drag & Drop on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Choose "Import From Git"
4. Paste your GitHub repo URL
5. Click "Import"
6. Click "Deploy"

## Configuration Steps

### 1. Vercel Environment Setup

No special configuration needed! The default settings work perfectly:

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 2. Domain Setup (Optional)

```
# In Vercel Dashboard:
1. Go to your project
2. Settings → Domains
3. Add your custom domain (e.g., dbt-ninja.com)
4. Follow DNS setup instructions
```

### 3. Environment Variables (if needed)

```
# In Vercel Dashboard:
1. Settings → Environment Variables
2. Add any variables (currently none needed)
3. Redeploy
```

## Automatic Deploys

Once connected to GitHub:

- **Main branch** → Automatic production deployment
- **Other branches** → Preview deployments
- **Pull requests** → Preview URLs

## Post-Deployment Checks

```bash
# Visit your deployment
https://your-project-name.vercel.app

# Check build logs
vercel logs https://your-project-name.vercel.app

# View analytics
https://vercel.com/your-account/your-project-name
```

## Performance Monitoring

Vercel provides built-in:
- ✅ Web Vitals monitoring
- ✅ Real-time analytics
- ✅ Performance insights
- ✅ Deployment history

## Troubleshooting

### Build fails with "out of memory"

```bash
# Increase build resources in vercel.json
# No action needed - Vercel auto-scales
```

### Changes not reflecting

```bash
# Force redeploy:
vercel --prod --force
```

### Custom domain not working

1. Check DNS settings in Vercel dashboard
2. Wait 24-48 hours for DNS propagation
3. Verify CNAME or A records

## Advanced Configuration

### Custom Build Command

Edit `vercel.json`:

```json
{
  "buildCommand": "npm run build && npm run export",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  }
}
```

### Analytics Enabled

```yaml
# vercel.json
{
  "analytics": true
}
```

### Edge Functions (Optional)

```typescript
// api/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Add custom logic
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
}
```

## Estimated Costs

- **Free Tier**: Perfect for learning/personal projects ✅
- **Pro Tier**: $20/month for professional use
- **Enterprise**: Custom pricing

Your DBT Ninja Guide fits comfortably in the Free tier!

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add custom domain
3. ✅ Enable analytics
4. ✅ Share with team
5. ✅ Keep content updated

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Community: https://github.com/vercel/next.js/discussions

---

**Your DBT Ninja Guide is now live! 🎉**
