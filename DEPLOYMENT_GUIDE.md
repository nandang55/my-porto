# 🚀 Deployment Guide - Vercel

Panduan lengkap untuk deploy portfolio website ke Vercel.

---

## 🎯 Prerequisites

- ✅ Project sudah jalan di local
- ✅ Supabase sudah setup
- ✅ Build test berhasil
- ✅ Git repository (GitHub/GitLab/Bitbucket)

---

## 📦 Method 1: Deploy via Vercel Dashboard (EASIEST) ⭐

### Step 1: Push ke GitHub

1. **Create GitHub Repository**
   - Buka https://github.com/new
   - Repository name: `my-portfolio`
   - Visibility: Public atau Private
   - Klik "Create repository"

2. **Push Code ke GitHub**
   ```bash
   cd /Users/nandanghermawan/Project/my-porto
   
   # Initialize git (jika belum)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Portfolio website"
   
   # Add remote (ganti dengan URL repo Anda)
   git remote add origin https://github.com/USERNAME/my-portfolio.git
   
   # Push
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect Vercel dengan GitHub

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Klik "Sign Up" atau "Log In"
   - Pilih "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository `my-portfolio`
   - Klik "Import"

### Step 3: Configure Project

Vercel akan auto-detect Vite settings. Pastikan:

- **Framework Preset**: `Vite`
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### Step 4: Add Environment Variables ⚠️ PENTING!

Sebelum deploy, tambahkan environment variables:

1. Di halaman import, scroll ke **"Environment Variables"**
2. Tambahkan 2 variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co` (dari Supabase dashboard)
   
   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGc...` (anon key dari Supabase)

3. Environment: Pilih **Production**, **Preview**, dan **Development** (semua)

### Step 5: Deploy! 🚀

1. Klik **"Deploy"**
2. Tunggu 1-2 menit (Vercel akan build & deploy)
3. Setelah selesai, akan muncul confetti 🎉
4. Klik **"Visit"** untuk lihat website live!

✅ **Website Anda sudah LIVE!**

---

## 🛠️ Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

Pilih method login (Email, GitHub, etc)

### Step 3: Deploy

```bash
cd /Users/nandanghermawan/Project/my-porto

# Deploy
vercel
```

Follow prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: my-portfolio (atau nama lain)
- **Directory**: `.` (press Enter)
- **Override settings**: No

### Step 4: Add Environment Variables

```bash
# Add Supabase URL
vercel env add VITE_SUPABASE_URL

# Paste URL, pilih environment: Production, Preview, Development

# Add Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY

# Paste key, pilih environment: Production, Preview, Development
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

✅ **Deployment complete!**

---

## 🔧 Post-Deployment Configuration

### 1. Setup Custom Domain (Optional)

**Via Dashboard:**
1. Buka project di Vercel dashboard
2. Settings → Domains
3. Add domain (contoh: `yourname.com`)
4. Follow DNS configuration instructions

**Via CLI:**
```bash
vercel domains add yourname.com
```

### 2. Configure Supabase Redirect URLs

Penting untuk Authentication!

1. Buka Supabase Dashboard
2. Settings → API → Authentication
3. **Site URL**: Tambahkan Vercel URL (contoh: `https://my-portfolio.vercel.app`)
4. **Redirect URLs**: Tambahkan:
   ```
   https://my-portfolio.vercel.app/**
   https://my-portfolio.vercel.app/admin/dashboard
   ```

### 3. Update CORS (Jika Perlu)

Jika ada CORS error:

1. Supabase Dashboard → Settings → API
2. Scroll ke "CORS Configuration"
3. Tambahkan Vercel URL Anda

---

## 📋 Vercel Configuration File

File `vercel.json` sudah include di project:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Ini untuk handle React Router (SPA routing).

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Setelah connect dengan GitHub:

1. **Push ke branch `main`** → Auto-deploy ke Production
2. **Push ke branch lain** → Auto-deploy ke Preview
3. **Pull Request** → Auto-deploy Preview URL

```bash
# Make changes
git add .
git commit -m "Update homepage"
git push origin main

# Vercel will auto-deploy! 🎉
```

### Manual Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 📊 Monitoring & Analytics

### View Deployment Logs

**Via Dashboard:**
1. Vercel Dashboard → Project
2. Deployments tab
3. Klik deployment → View Logs

**Via CLI:**
```bash
vercel logs
```

### Analytics

Vercel provides free analytics:
- Page views
- Performance metrics
- Error tracking

Enable di: Project Settings → Analytics

---

## 🐛 Troubleshooting

### Build Failed

**Error: "Command failed: npm run build"**

**Solution:**
```bash
# Test build locally first
cd /Users/nandanghermawan/Project/my-porto
npm run build

# Fix any errors, then commit & push
```

### Environment Variables Not Working

**Solution:**
1. Check spelling: `VITE_SUPABASE_URL` (case-sensitive!)
2. Redeploy setelah add env vars:
   ```bash
   vercel --prod
   ```
3. Check di Vercel Dashboard → Settings → Environment Variables

### 404 on Refresh

**Solution:**
- Pastikan `vercel.json` ada di root folder
- Isi sesuai template di atas
- Redeploy

### Supabase Connection Failed

**Solution:**
1. Check environment variables di Vercel
2. Update Supabase redirect URLs
3. Check CORS settings
4. Test di browser console

### "This site can't be reached"

**Solution:**
- Tunggu beberapa menit (DNS propagation)
- Clear browser cache
- Try incognito/private mode
- Check Vercel deployment status

---

## 🎨 Custom Domain Setup

### 1. Buy Domain (Optional)

Rekomendasi registrar:
- Namecheap
- Google Domains
- Cloudflare

### 2. Add Domain di Vercel

**Via Dashboard:**
1. Project Settings → Domains
2. Add `yourdomain.com` dan `www.yourdomain.com`
3. Copy DNS records yang diberikan Vercel

### 3. Configure DNS

Di domain registrar Anda:

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Wait for DNS Propagation

- Biasanya 5-10 menit
- Maksimal 24-48 jam
- Check status: https://dnschecker.org

---

## 💰 Pricing

**Hobby Plan (FREE):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Edge network
- ✅ Analytics

**Pro Plan ($20/month):**
- Everything in Hobby
- More bandwidth
- Team features
- Priority support

Untuk portfolio personal, **FREE plan sudah cukup!** ✅

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Status Page**: https://vercel-status.com

---

## 📋 Deployment Checklist

Sebelum deploy, pastikan:

- [ ] Build berhasil di local (`npm run build`)
- [ ] Semua dependencies terinstall
- [ ] `.env` tidak ter-commit ke Git
- [ ] `vercel.json` ada di root folder
- [ ] Supabase credentials ready
- [ ] Code sudah di-push ke GitHub
- [ ] Environment variables siap

---

## 🎉 Success!

Setelah deploy berhasil:

1. ✅ Website live di `https://your-project.vercel.app`
2. ✅ Auto-deploy on git push
3. ✅ HTTPS enabled automatically
4. ✅ Global CDN
5. ✅ Analytics enabled

**Selamat! Portfolio Anda sudah online!** 🚀

---

## 🚀 Next Steps

1. Share URL ke teman/recruiter
2. Add custom domain (optional)
3. Setup Google Analytics
4. Submit to search engines
5. Share di LinkedIn/Twitter

**Happy deploying!** 🎉

