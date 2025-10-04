# 🚀 Vercel Wildcard Domain Setup - Step by Step

## ⚠️ PENTING: Order of Operations

Vercel **membutuhkan root domain dulu** sebelum wildcard!

---

## 📋 **Exact Steps (Harus Urut!):**

### **Step 1: Add Root Domain DULU**

1. **Vercel Dashboard** → Project → Settings → Domains
2. **Click:** "Add"
3. **Enter:** `porto.bagdja.com` (tanpa www, tanpa subdomain)
4. **Click:** "Add"
5. **Vercel akan show instructions:**
   ```
   Add this DNS record in Cloudflare:
   
   Type:   CNAME
   Name:   porto
   Value:  536c8f1c5983496e.vercel-dns-017.com
   ```
6. **JANGAN close popup dulu!**

---

### **Step 2: Setup Cloudflare DNS untuk Root**

1. **Buka tab baru:** https://dash.cloudflare.com
2. **Select:** bagdja.com
3. **DNS → Add record:**
   ```
   Type:    CNAME
   Name:    porto
   Target:  536c8f1c5983496e.vercel-dns-017.com
   Proxy:   🟠 Proxied (ON)
   TTL:     Auto
   ```
4. **Save**
5. **Wait 1-2 minutes**

---

### **Step 3: Verify Root Domain di Vercel**

1. **Kembali ke Vercel**
2. **Click:** "Refresh" atau "Verify"
3. **Status harus:** ✅ Valid
4. **Jika masih pending:** Wait 2-5 menit, refresh lagi

---

### **Step 4: Add Wildcard Domain (Setelah Root Valid!)**

1. **Vercel Dashboard** → Same Domains page
2. **Click:** "Add" lagi
3. **Enter:** `*.porto.bagdja.com` (with asterisk!)
4. **Click:** "Add"
5. **Vercel akan show:**
   ```
   Add this DNS record in Cloudflare:
   
   Type:   CNAME
   Name:   *.porto
   Value:  536c8f1c5983496e.vercel-dns-017.com
   ```

---

### **Step 5: Setup Cloudflare DNS untuk Wildcard**

1. **Cloudflare → DNS → Add record:**
   ```
   Type:    CNAME
   Name:    *.porto
   Target:  536c8f1c5983496e.vercel-dns-017.com
   Proxy:   🟠 Proxied (ON)
   TTL:     Auto
   ```
2. **Save**
3. **Wait 1-2 minutes**

---

### **Step 6: Verify Wildcard di Vercel**

1. **Vercel → Refresh/Verify**
2. **Status harus:** ✅ Valid
3. **SSL certificate:** Auto-generated

---

## ✅ **Final Result in Vercel Domains:**

```
┌─────────────────────────┬──────────┬──────────────┐
│ Domain                  │ Status   │ SSL          │
├─────────────────────────┼──────────┼──────────────┤
│ porto.bagdja.com       │ ✅ Valid │ ✅ Encrypted │
│ *.porto.bagdja.com     │ ✅ Valid │ ✅ Encrypted │
└─────────────────────────┴──────────┴──────────────┘
```

---

## 🔍 **Troubleshooting: Wildcard Not Working**

### **Problem:** `poppy.porto.bagdja.com` masih redirect ke `/poppy`

**Possible Causes:**

#### **1. Vercel Belum Tahu Wildcard Domain**

**Check:**
- Go to Vercel → Settings → Domains
- Is `*.porto.bagdja.com` listed? 
- Status: Valid?

**Solution:**
- Add `*.porto.bagdja.com` di Vercel (Step 4-6 di atas)
- **MUST have both:** `porto.bagdja.com` AND `*.porto.bagdja.com`

#### **2. DNS Belum Propagate**

**Check:**
```bash
nslookup poppy.porto.bagdja.com
```

**Expected:**
```
Non-authoritative answer:
Name:    poppy.porto.bagdja.com
Address: <Vercel IP>
```

**Solution:**
- Wait 5-30 minutes
- Clear browser cache: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
- Try incognito mode

#### **3. React App Not Detecting Subdomain**

**Check console:**
```javascript
// Open browser console on poppy.porto.bagdja.com
// Should see:
"Subdomain detected: poppy - Using subdomain routing"
```

**If NOT seeing this:**
- React app not deployed yet
- Or deployment failed
- Check Vercel deployment logs

**Solution:**
```bash
# Re-deploy
git add .
git commit -m "Fix subdomain routing"
git push origin main
```

#### **4. Cloudflare Cache**

**Check:**
- Cloudflare caching might show old version

**Solution:**
```
Cloudflare Dashboard → Caching → Purge Everything
```

---

## 🎯 **Alternative: Manual Test First**

**Jika wildcard masih bermasalah, test dengan subdomain specific dulu:**

### **Vercel:**
```
Add domain: poppy.porto.bagdja.com (specific, no wildcard)
```

### **Cloudflare:**
```
Type:   CNAME
Name:   poppy.porto
Target: 536c8f1c5983496e.vercel-dns-017.com
Proxy:  🟠 ON
```

**Test:**
```
https://poppy.porto.bagdja.com
```

**Jika ini works, berarti:**
- ✅ DNS correct
- ✅ Vercel routing correct
- ✅ React app correct
- ❌ Wildcard setup issue

**Lalu baru add wildcard untuk yang lain.**

---

## 🔧 **Quick Fix Commands:**

### **Clear All Caches:**
```bash
# Browser
Cmd+Shift+R (hard reload)

# DNS (Mac)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# DNS (Windows)
ipconfig /flushdns
```

### **Force Re-deploy:**
```bash
cd /Users/nandanghermawan/Project/my-porto

# Make a small change
echo "# Deploy $(date)" >> README.md

# Commit and push
git add .
git commit -m "Force redeploy for subdomain support"
git push origin main

# Watch Vercel dashboard for deployment
```

---

## 📊 **Current vs Expected:**

### **Current (Your Issue):**
```
URL: https://poppy.porto.bagdja.com
      ↓
Vercel redirects to: https://poppy.porto.bagdja.com/poppy  ❌
```

### **Expected (After Fix):**
```
URL: https://poppy.porto.bagdja.com
      ↓
Shows: Poppy's landing page directly ✅
Path: Stays as / (root)
```

---

## 💡 **Most Likely Issue:**

**Vercel doesn't know about `*.porto.bagdja.com` yet!**

**Solution:**
1. ✅ Add `porto.bagdja.com` di Vercel (root domain)
2. ✅ **Wait until root is Valid**
3. ✅ Then add `*.porto.bagdja.com` (wildcard)
4. ✅ Both must show "Valid" status
5. ✅ Re-deploy application
6. ✅ Wait 5-10 minutes
7. ✅ Test again

**Wildcard MUST be added AFTER root domain is verified!**

---

## 🆘 **If Still Not Working:**

**Send me screenshot of:**
1. Vercel → Settings → Domains (show all domains listed)
2. Browser console when visiting `poppy.porto.bagdja.com`
3. Network tab showing the actual URL loaded

**Or share:**
- What URL shows in browser address bar?
- What content is displayed?
- Any console errors?

**Saya bisa diagnose lebih detail dengan info tersebut!** 🔍
