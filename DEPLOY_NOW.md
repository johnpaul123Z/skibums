# 🚀 Deploy Your Ski Job Board to Render - 5 Minute Guide

## ✅ Step 1: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account

## ✅ Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** to link GitHub
4. Find and select `johnpaul123Z/skibums` repository
5. Click **"Connect"**

## ✅ Step 3: Configure Settings

Render will auto-detect your `render.yaml` file with these settings:

```
Name: skibums-job-board
Build Command: npm install && npm run build && npx puppeteer browsers install chrome
Start Command: npm start
Region: Oregon (US West)
Plan: Free
```

**No need to change anything!** Just verify these are correct.

## ✅ Step 4: Add Environment Variable

**IMPORTANT**: Before clicking "Create Web Service":

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Set:
   - **Key**: `NEXT_PUBLIC_MAPBOX_TOKEN`
   - **Value**: Your Mapbox token (check your `.env.local` file locally)
   - Get a free token at: https://account.mapbox.com/access-tokens/

## ✅ Step 5: Deploy!

1. Click **"Create Web Service"** button
2. Wait 5-10 minutes for build to complete
3. Watch the logs for:
   ```
   ✓ Ready in 809ms
   🎿 Scraping all Vail Resorts...
   🏔️ Scraping Alterra...
   ⛷️ Scraping Boyne...
   ```

## ✅ Step 6: Your App is Live!

Your URL will be: **https://skibums-job-board.onrender.com**

(Or whatever name you chose)

---

## 🎉 What You'll Get

✅ **240+ live jobs** from Vail, Alterra, and Boyne  
✅ **Interactive map** with 47 resorts  
✅ **Advanced search** with filters  
✅ **Beautiful UI** with animations  
✅ **Free SSL** certificate (HTTPS)  
✅ **Auto-deploy** on git push  

## ⚠️ Free Tier Notes

- **Cold starts**: App sleeps after 15 min of inactivity
- **First visit**: Takes ~30 seconds to wake up
- **Then**: Works perfectly!
- **Upgrade to $7/mo**: No cold starts, always fast

## 🔗 Share Your Site

Once deployed, share your job board:
- Twitter/X
- LinkedIn
- Reddit (r/skiing, r/snowboarding)
- Facebook ski groups

---

## Need Help?

Check the logs in Render dashboard if anything fails. Common issues:

1. **Puppeteer error**: Chrome dependencies missing
   - Solution: Already handled in `render.yaml`!

2. **Map not loading**: Missing Mapbox token
   - Solution: Double-check environment variable

3. **Build timeout**: Free tier has 30min limit
   - Solution: Should complete in ~5-10 min

---

**Ready? Let's deploy! Go to https://render.com and follow the steps above.** 🏔️🎿
