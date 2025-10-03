# 🌐 Custom Domain Setup Guide

Connect your own domain (e.g., portfolio.com) to your portfolio!

## ✨ What is Custom Domain?

**Without Custom Domain:**
```
Your portfolio: https://myporto.com/john-doe
```

**With Custom Domain:**
```
Your portfolio: https://www.johndoe.com
                https://johndoe.com
```

**Professional branding with your own domain!** 🎯

---

## 📋 **Requirements**

Before setting up custom domain, you need:

1. ✅ **Own a domain** - Buy from Namecheap, GoDaddy, Cloudflare, etc.
2. ✅ **Access to DNS settings** - In your domain registrar
3. ✅ **Portfolio slug configured** - Your /{slug} must work first
4. ✅ **Hosting configured** - Application deployed (Vercel/Netlify)

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Buy a Domain**

**Popular Registrars:**
- **Namecheap** - $8-12/year, easy to use
- **GoDaddy** - $10-15/year, popular
- **Cloudflare** - $8-10/year, best for developers
- **Google Domains** - $12/year, simple
- **Porkbun** - $6-10/year, cheap

**Recommendations:**
- Choose `.com` for professional look
- Keep it short and memorable
- Match your name/brand

**Examples:**
```
johndoe.com
janesmith.dev
alexchen.me
acmestudio.com
```

---

### **Step 2: Configure DNS Records**

Go to your domain registrar's DNS settings and add:

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: www
Value: your-app.vercel.app (or your hosting)
TTL: 3600
```

**Option B: A Record (Alternative)**
```
Type: A
Name: @
Value: YOUR_SERVER_IP (get from hosting provider)
TTL: 3600
```

**For both www and non-www:**
```
CNAME: www → your-app.vercel.app
CNAME: @ → your-app.vercel.app
(or use domain forwarding)
```

---

### **Step 3: Configure in Settings**

1. **Login** to `/admin/dashboard`
2. Go to **"Portfolio Settings"**
3. Click **"Custom Domain"** tab
4. Enter your domain:
   ```
   www.yourdomain.com
   or
   yourdomain.com
   ```
5. Click **"Update Settings"**
6. Done! ✅

---

### **Step 4: Wait for Propagation**

**DNS Propagation Time:**
- Minimum: 5-30 minutes
- Average: 1-2 hours
- Maximum: 24-48 hours

**Check Status:**
```bash
# Check DNS propagation
dig www.yourdomain.com

# Or use online tools:
# - whatsmydns.net
# - dnschecker.org
```

---

### **Step 5: Verify & Test**

1. **Wait** for DNS propagation
2. **Visit** your custom domain: `https://www.yourdomain.com`
3. Should show **your portfolio** ✅
4. Original `/{slug}` URL **still works** as backup

---

## 🎯 **Platform-Specific Setup**

### **Vercel:**

1. Add domain in Vercel dashboard:
   ```
   Project → Settings → Domains
   → Add: www.yourdomain.com
   ```

2. Vercel shows DNS records needed

3. Add those records in your domain registrar

4. Wait for verification (usually 5-10 mins)

5. SSL auto-configured! ✅

### **Netlify:**

1. Add domain in Netlify:
   ```
   Site Settings → Domain Management
   → Add custom domain
   ```

2. Netlify provides DNS configuration

3. Update your domain's DNS records

4. Verify domain

5. Enable HTTPS (auto SSL) ✅

### **Custom Hosting:**

If self-hosted, you need:
1. Web server configured (Nginx/Apache)
2. SSL certificate (Let's Encrypt)
3. Domain pointing to your server IP
4. Virtual host configuration

---

## 🎨 **Settings Page - Custom Domain Tab**

```
┌──────────────────────────────────────────────┐
│ Custom Domain                                │
│ Connect your own domain to your portfolio    │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ Current Portfolio URL:                   ││
│ │ https://myporto.com/john-doe             ││
│ └──────────────────────────────────────────┘│
│                                              │
│ Custom Domain:                               │
│ [www.johndoe.com_________________________]  │
│ Enter domain without https://                │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ 📝 How to Setup Custom Domain:           ││
│ │ 1. Buy a domain from registrar           ││
│ │ 2. Add DNS records (CNAME)               ││
│ │ 3. Enter domain above                    ││
│ │ 4. Save and wait (5-30 mins)             ││
│ │ 5. Visit your domain!                    ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ✅ Custom Domain Configured                 │
│ Your portfolio is accessible at:             │
│ www.johndoe.com                              │
│                                              │
│ 🌟 Benefits:                                │
│ ✅ Professional branding                    │
│ ✅ Better SEO                               │
│ ✅ Memorable URL                            │
│                                              │
│ ⚠️ Important Notes:                         │
│ • DNS takes 5-30 minutes                    │
│ • /{slug} always works as backup            │
│ • SSL may need configuration                │
└──────────────────────────────────────────────┘
```

---

## 🌟 **Benefits**

### **Professional Branding:**
```
Without: myporto.com/john-doe
With: johndoe.com ← Professional!
```

### **Better SEO:**
- Own domain = better Google ranking
- Custom URLs = more trustworthy
- Brand recognition
- Email on same domain possible

### **Memorable:**
```
Instead of: myporto.com/very-long-username-here
Use: yourname.com ← Easy to remember!
```

---

## 🔧 **Troubleshooting**

### **Issue: Domain not working**

**Check:**
1. ✅ DNS records correct?
2. ✅ Waited enough time? (30 mins+)
3. ✅ SSL certificate active?
4. ✅ Hosting configured for domain?

**Solution:**
```bash
# Check DNS
dig www.yourdomain.com

# Should point to your hosting server
```

### **Issue: SSL/HTTPS error**

**Solution:**
- Vercel/Netlify: Auto SSL (wait 5-10 mins)
- Custom host: Install Let's Encrypt
- Check hosting provider docs

### **Issue: "Domain already taken"**

**Cause:** Another user has this domain

**Solution:** Each domain can only be used once (unique constraint)

---

## 💡 **Pro Tips**

### **Domain Selection:**
```
✅ DO: johndoe.com, janesmith.dev
✅ DO: yourname.me, yourname.io
✅ DO: Short, memorable

❌ DON'T: very-long-domain-name-here.com
❌ DON'T: hard-to-spell-name.com
```

### **DNS Configuration:**
```
Best practice:
- Use www.yourdomain.com (CNAME)
- Redirect root → www
- Or use both (CNAME + A record)
```

### **Testing:**
```
1. Test /{slug} first (make sure it works)
2. Then add custom domain
3. Test both URLs work
4. Keep /{slug} as backup
```

---

## 📊 **Access Methods**

After setup, portfolio accessible via:

**Primary (Custom Domain):**
```
https://www.johndoe.com
https://johndoe.com
```

**Backup (Platform URL):**
```
https://myporto.com/john-doe
```

**Both work!** Use custom domain for sharing, platform URL as backup.

---

## 🎊 **Summary**

### **Custom Domain Features:**

✅ **Own domain** - yourname.com  
✅ **Easy setup** - DNS + settings  
✅ **Step-by-step guide** - In settings page  
✅ **Validation** - Domain format check  
✅ **Unique** - One domain per user  
✅ **Backup URL** - /{slug} still works  
✅ **Professional** - Better branding  
✅ **SEO boost** - Better rankings  
✅ **SSL ready** - HTTPS support  
✅ **Optional** - Not required  

---

## 🔗 **Resources**

**Domain Registrars:**
- Namecheap: https://namecheap.com
- GoDaddy: https://godaddy.com  
- Cloudflare: https://cloudflare.com
- Porkbun: https://porkbun.com

**DNS Checkers:**
- https://whatsmydns.net
- https://dnschecker.org
- https://mxtoolbox.com

**SSL Providers:**
- Let's Encrypt (free)
- Cloudflare SSL (free)
- Vercel/Netlify (auto)

---

**Custom Domain Feature Complete!** 🌐✨

Now you can use your own domain for professional branding! 🎯

