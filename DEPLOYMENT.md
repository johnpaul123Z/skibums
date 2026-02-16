# 🚀 Deploy to Render

## Quick Deploy

1. **Push to GitHub** ✅ (Already done!)
   - Repository: https://github.com/johnpaul123Z/skibums

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (free tier available)

3. **Deploy from Dashboard**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `johnpaul123Z/skibums` repository
   - Render will auto-detect the `render.yaml` config

4. **Add Environment Variable**
   - In Render dashboard, go to "Environment"
   - Add: `NEXT_PUBLIC_MAPBOX_TOKEN`
   - Value: Your Mapbox token from https://account.mapbox.com/access-tokens/
   - (Get a free token - no credit card required!)

5. **Deploy!**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build
   - Your app will be live at: `https://skibums-job-board.onrender.com`

## Configuration

### Build Settings (Auto-detected from render.yaml)
```yaml
Build Command: npm install && npm run build
Start Command: npm start
Node Version: 20.11.0
Region: Oregon (US West - closest to ski resorts!)
```

### Environment Variables Required
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

## Free Tier Limitations

⚠️ **Important**: Render's free tier has some limitations:

1. **Cold Starts**: App sleeps after 15 min of inactivity
   - First visit after sleep takes ~30 seconds to wake up
   - Subsequent visits are instant

2. **Build Time**: ~5-10 minutes per deployment

3. **Scraping Performance**:
   - Puppeteer works on free tier!
   - Scraping 240+ jobs may take 20-30 seconds on first load
   - Consider upgrading to Starter ($7/mo) for better performance

## Optimization for Production

### Option 1: Add Caching (Recommended)
Consider adding Redis caching to avoid scraping on every request:

```bash
# Add Redis on Render (free tier available)
1. Create Redis instance on Render
2. Add REDIS_URL to environment variables
3. Cache scraped jobs for 6-12 hours
```

### Option 2: Scheduled Jobs
Use Render Cron Jobs (paid) to pre-scrape jobs:

```yaml
# Add to render.yaml
- type: cron
  name: job-scraper
  env: node
  schedule: "0 */6 * * *"  # Every 6 hours
  buildCommand: npm install
  startCommand: node scripts/scrape-and-cache.js
```

### Option 3: ISR (Incremental Static Regeneration)
Use Next.js ISR to cache pages:

```typescript
// In app/page.tsx
export const revalidate = 21600; // 6 hours
```

## Troubleshooting

### Issue: "Application Error" on First Load
**Solution**: Puppeteer needs dependencies
```yaml
# Add to render.yaml under buildCommand:
buildCommand: |
  npm install &&
  npm run build &&
  npx puppeteer browsers install chrome
```

### Issue: Scraping Times Out
**Solution**: Increase timeout or cache results
- Free tier has 512MB RAM - should be OK for Puppeteer
- If issues persist, upgrade to Starter plan

### Issue: Map Doesn't Load
**Solution**: Check environment variable
1. Go to Render dashboard → Environment
2. Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set
3. Restart service

## Custom Domain (Optional)

1. Go to Render dashboard → Settings
2. Click "Custom Domains"
3. Add your domain (e.g., `skibums.com`)
4. Update DNS records at your registrar
5. SSL is automatic!

## Performance Tips

### For Free Tier:
- Enable ISR for 6-hour caching
- Limit job scraping to 100 total jobs
- Consider scraping only on server restart

### For Paid Plans ($7+/mo):
- Keep full scraping (240+ jobs)
- Add Redis caching
- Use Cron Jobs for scheduled scraping
- Better performance (no cold starts)

## Monitoring

After deployment, you can:
- View logs in Render dashboard
- Monitor build times
- Check scraping success rates
- See memory/CPU usage

## Cost Estimate

| Plan | Cost | Features |
|------|------|----------|
| Free | $0 | 750 hours/mo, sleeps after 15min, 512MB RAM |
| Starter | $7/mo | Always on, 512MB RAM, faster builds |
| Standard | $25/mo | 2GB RAM, better for Puppeteer |

## Alternative: Vercel

If Render doesn't work well, try Vercel:
```bash
npm install -g vercel
vercel --prod
```

Note: Vercel has 10-second function timeout (may not work for scraping all 240 jobs)

---

## 🎉 Your App Will Be Live!

After following the steps above, your ski job board will be accessible worldwide at:

**https://skibums-job-board.onrender.com**

Or your custom domain! 🏔️🎿
