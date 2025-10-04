# 🌐 Subdomain Setup Guide - BagdjaPorto

Guide lengkap untuk mengkonfigurasi subdomain pada Cloudflare dan Vercel.

## 📋 Overview

### Current Access Method:
```
https://porto.bagdja.com/poppy
https://porto.bagdja.com/john
```

### After Subdomain Setup:
```
https://poppy.porto.bagdja.com
https://john.porto.bagdja.com
```

**Both methods will work!** Path-based access tetap didukung untuk backward compatibility.

---

## 🔧 Part 1: Cloudflare DNS Configuration

### Step 1: Login to Cloudflare
1. Go to https://dash.cloudflare.com
2. Select domain: **bagdja.com**
3. Navigate to **DNS** > **Records**

### Step 2: Add Wildcard CNAME Record

**Add the following DNS record:**

```
Type:    CNAME
Name:    *.porto
Target:  cname.vercel-dns.com
Proxy:   ✅ Proxied (Orange cloud)
TTL:     Auto
```

**What this does:**
- `*.porto.bagdja.com` → Points to Vercel
- Catches ALL subdomains: `poppy.porto.bagdja.com`, `john.porto.bagdja.com`, etc.
- Cloudflare proxy for SSL and caching

### Step 3: Add Root Domain CNAME (if not exists)

**If you don't have `porto.bagdja.com` yet:**

```
Type:    CNAME
Name:    porto
Target:  cname.vercel-dns.com
Proxy:   ✅ Proxied (Orange cloud)
TTL:     Auto
```

### Step 4: Verify DNS

**Using terminal:**
```bash
# Check wildcard subdomain
nslookup poppy.porto.bagdja.com

# Check root domain
nslookup porto.bagdja.com
```

**Expected result:**
```
Non-authoritative answer:
Name:    poppy.porto.bagdja.com
Address: <Vercel IP>
```

**⏰ DNS Propagation:** May take 5-60 minutes globally

---

## 🚀 Part 2: Vercel Domain Configuration

### Step 1: Open Project Settings
1. Go to https://vercel.com/dashboard
2. Select your project: **my-porto**
3. Go to **Settings** > **Domains**

### Step 2: Add Root Domain

**Add domain:**
```
porto.bagdja.com
```

**Vercel will:**
- ✅ Verify domain ownership
- ✅ Generate SSL certificate
- ✅ Enable HTTPS automatically

### Step 3: Add Wildcard Domain

**Add wildcard domain:**
```
*.porto.bagdja.com
```

**Vercel will:**
- ✅ Enable all subdomains automatically
- ✅ Generate wildcard SSL certificate
- ✅ No need to add each subdomain manually

### Step 4: Verify Domains

**Check status:**
- `porto.bagdja.com` → ✅ Valid
- `*.porto.bagdja.com` → ✅ Valid

**Test URLs:**
```bash
# Root domain
curl -I https://porto.bagdja.com

# Wildcard subdomain
curl -I https://test.porto.bagdja.com

# Specific subdomain
curl -I https://poppy.porto.bagdja.com
```

All should return: `200 OK` with SSL

---

## 🔍 Part 3: How It Works

### Subdomain Detection Flow

```
User visits: https://poppy.porto.bagdja.com
                    ↓
┌─────────────────────────────────────────┐
│ 1. DNS Resolution (Cloudflare)         │
│    *.porto.bagdja.com → Vercel          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. Vercel Routing                       │
│    Serve: index.html                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. React App Loads                      │
│    subdomainHelper.js detects:         │
│    - hostname: poppy.porto.bagdja.com   │
│    - subdomain: "poppy"                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. SubdomainRouter                      │
│    Routes to: LandingPageRenderer       │
│    With: tenantSlug="poppy"             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. TenantContext                        │
│    Fetches: portfolios.slug = "poppy"  │
│    Loads: Poppy's data                  │
└─────────────────────────────────────────┘
                    ↓
        Display: Poppy's Landing Page
```

### URL Routing Matrix

| URL | Subdomain | Path | Route To | Description |
|-----|-----------|------|----------|-------------|
| `poppy.porto.bagdja.com` | `poppy` | `/` | Landing Page | Tenant home |
| `poppy.porto.bagdja.com/projects` | `poppy` | `/projects` | Projects List | Poppy's projects |
| `poppy.porto.bagdja.com/blog` | `poppy` | `/blog` | Blog List | Poppy's blog |
| `poppy.porto.bagdja.com/about` | `poppy` | `/about` | About Page | Poppy's about |
| `poppy.porto.bagdja.com/admin` | `poppy` | `/admin` | Admin Panel | Admin login |
| `porto.bagdja.com` | `null` | `/` | Main Home | App homepage |
| `porto.bagdja.com/poppy` | `null` | `/poppy` | Landing Page | Fallback route |
| `porto.bagdja.com/admin` | `null` | `/admin` | Admin Panel | Admin login |

### Code Logic

**subdomainHelper.js:**
```javascript
export const getSubdomain = () => {
  const hostname = window.location.hostname;
  // "poppy.porto.bagdja.com"
  
  if (hostname === 'localhost') return null;
  
  const parts = hostname.split('.');
  // ["poppy", "porto", "bagdja", "com"]
  
  const subdomain = parts[0];
  // "poppy"
  
  if (excludedSubdomains.includes(subdomain)) return null;
  
  return subdomain;
  // Returns: "poppy"
};
```

**App.jsx - SubdomainRouter:**
```javascript
const SubdomainRouter = ({ children }) => {
  const subdomain = getSubdomain();
  
  if (subdomain) {
    // Subdomain mode: tenant-only routes
    return (
      <Routes>
        <Route path="/" element={<LandingPageRenderer tenantSlug={subdomain} />} />
        <Route path="/projects" element={<PublicPortfolio />} />
        <Route path="/blog" element={<TenantBlog />} />
        ...
      </Routes>
    );
  }
  
  // Normal mode: all routes
  return children;
};
```

---

## ✅ Part 4: Testing

### Local Testing (Development)

**Since localhost doesn't support subdomains natively, test with paths:**

```bash
# Start dev server
npm run dev

# Test path-based (current method)
http://localhost:5173/poppy
http://localhost:5173/john
```

**To test subdomain locally (optional):**

1. Edit `/etc/hosts`:
```bash
sudo nano /etc/hosts
```

2. Add entries:
```
127.0.0.1  poppy.localhost
127.0.0.1  john.localhost
127.0.0.1  sarah.localhost
```

3. Access:
```
http://poppy.localhost:5173
http://john.localhost:5173
```

### Production Testing

**After DNS and Vercel setup:**

```bash
# Test wildcard subdomain
curl -I https://poppy.porto.bagdja.com
curl -I https://john.porto.bagdja.com
curl -I https://test.porto.bagdja.com

# Expected: 200 OK, SSL certificate valid

# Test backward compatibility
curl -I https://porto.bagdja.com/poppy
curl -I https://porto.bagdja.com/john

# Expected: 200 OK
```

**Browser testing:**
1. Visit: `https://poppy.porto.bagdja.com`
2. Should load: Poppy's landing page
3. Check URL bar: Shows subdomain
4. Navigate to `/projects`: `https://poppy.porto.bagdja.com/projects`
5. Check data: Poppy's projects only

---

## 🔒 Part 5: SSL Certificate

### Automatic SSL

**Vercel automatically generates:**
- ✅ SSL certificate for `porto.bagdja.com`
- ✅ Wildcard SSL for `*.porto.bagdja.com`
- ✅ Auto-renewal every 90 days
- ✅ Let's Encrypt (free)

### Verify SSL

```bash
# Check SSL certificate
openssl s_client -connect poppy.porto.bagdja.com:443 -servername poppy.porto.bagdja.com

# Should show:
# - Subject: CN=*.porto.bagdja.com
# - Issuer: Let's Encrypt
# - Valid from/to dates
```

---

## 📊 Part 6: Environment Variables (Optional)

**If you need environment-specific behavior:**

**.env.local (Development):**
```env
VITE_BASE_DOMAIN=localhost:5173
VITE_USE_SUBDOMAIN=false
```

**.env.production (Vercel):**
```env
VITE_BASE_DOMAIN=porto.bagdja.com
VITE_USE_SUBDOMAIN=true
```

**Usage in code:**
```javascript
const useSubdomain = import.meta.env.VITE_USE_SUBDOMAIN === 'true';
const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'porto.bagdja.com';
```

---

## 🎯 Part 7: Subdomain Features

### What Users Get

**Each tenant now has:**
```
✅ Own subdomain: poppy.porto.bagdja.com
✅ Custom landing page
✅ Projects showcase: /projects
✅ Blog: /blog
✅ About page: /about
✅ Contact form: /contact
✅ Custom branding (colors, favicon, etc.)
```

### SEO Benefits

**Before (Path-based):**
```
Domain Authority: Shared across all tenants
URL: porto.bagdja.com/poppy
```

**After (Subdomain):**
```
Domain Authority: Individual per tenant
URL: poppy.porto.bagdja.com
```

**Benefits:**
- 🎯 Better SEO isolation
- 📈 Individual analytics tracking
- 🔍 Better search engine indexing
- 💼 More professional appearance

---

## 🚨 Troubleshooting

### Issue 1: Subdomain Not Resolving

**Check:**
```bash
# DNS propagation
dig poppy.porto.bagdja.com

# Should show Vercel IP
```

**Solutions:**
- Wait 5-60 minutes for DNS propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
- Try different browser/incognito mode

### Issue 2: SSL Certificate Error

**Check:**
- Vercel domain status: Should be "Valid"
- Certificate type: Should include wildcard
- Wait 1-2 minutes for cert generation

**Solutions:**
- Re-add domain in Vercel
- Check Cloudflare SSL/TLS mode: "Full (strict)"
- Contact Vercel support if persists

### Issue 3: Routes Not Working

**Check console:**
```javascript
console.log('Subdomain:', getSubdomain());
console.log('Tenant slug:', getTenantSlug());
```

**Solutions:**
- Clear browser cache
- Check subdomainHelper.js logic
- Verify TenantContext logging

### Issue 4: 404 on Subdomain

**Possible causes:**
- Tenant slug doesn't exist in database
- Portfolio is not active (`is_active = false`)
- No landing page created

**Check database:**
```sql
SELECT slug, is_active FROM portfolios WHERE slug = 'poppy';
SELECT * FROM landing_pages WHERE user_id = (SELECT user_id FROM portfolios WHERE slug = 'poppy');
```

---

## 📚 Additional Resources

### Cloudflare Docs
- [DNS Records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
- [CNAME Flattening](https://developers.cloudflare.com/dns/cname-flattening/)

### Vercel Docs
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Wildcard Domains](https://vercel.com/docs/concepts/projects/domains/wildcard-domains)
- [DNS Configuration](https://vercel.com/docs/concepts/projects/domains/add-a-domain)

### Testing Tools
- [DNS Checker](https://dnschecker.org/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)
- [What's My DNS](https://www.whatsmydns.net/)

---

## ✅ Quick Checklist

### Cloudflare Setup
- [ ] Login to Cloudflare dashboard
- [ ] Select `bagdja.com` domain
- [ ] Add CNAME record: `*.porto` → `cname.vercel-dns.com`
- [ ] Add CNAME record: `porto` → `cname.vercel-dns.com` (if not exists)
- [ ] Enable Cloudflare proxy (orange cloud)
- [ ] Save changes

### Vercel Setup
- [ ] Login to Vercel dashboard
- [ ] Open project settings
- [ ] Go to Domains tab
- [ ] Add domain: `porto.bagdja.com`
- [ ] Add wildcard: `*.porto.bagdja.com`
- [ ] Wait for verification (automatic)
- [ ] Check SSL certificate status

### Testing
- [ ] Wait 10-30 minutes for DNS propagation
- [ ] Test: `https://porto.bagdja.com` (should work)
- [ ] Test: `https://poppy.porto.bagdja.com` (should load Poppy's portfolio)
- [ ] Test: `https://anyname.porto.bagdja.com` (should check database)
- [ ] Test SSL: Lock icon in browser
- [ ] Test navigation: All links work correctly
- [ ] Test backward compatibility: `https://porto.bagdja.com/poppy` still works

### Deployment
- [ ] Commit changes to git
- [ ] Push to GitHub
- [ ] Vercel auto-deploys
- [ ] Verify deployment successful
- [ ] Test live URLs

---

## 🎉 Expected Results

### For Tenant "Poppy"

**Subdomain Access:**
```
Home:     https://poppy.porto.bagdja.com
Projects: https://poppy.porto.bagdja.com/projects
Blog:     https://poppy.porto.bagdja.com/blog
About:    https://poppy.porto.bagdja.com/about
Contact:  https://poppy.porto.bagdja.com/contact
```

**Path Access (Still Works):**
```
Home:     https://porto.bagdja.com/poppy
Projects: https://porto.bagdja.com/poppy/projects
Blog:     https://porto.bagdja.com/poppy/blog
About:    https://porto.bagdja.com/poppy/about
Contact:  https://porto.bagdja.com/poppy/contact
```

**Both show identical content!**

---

## 💡 Pro Tips

### 1. Preview Before Going Live
```bash
# Use Vercel preview URL first
https://my-porto-git-main-yourusername.vercel.app

# Test with ?slug=poppy query parameter
https://your-preview.vercel.app?slug=poppy
```

### 2. Monitor DNS Propagation
```bash
# Check from multiple locations
https://www.whatsmydns.net/#CNAME/poppy.porto.bagdja.com
```

### 3. SSL Certificate Monitoring
- Vercel auto-renews 30 days before expiry
- No action needed
- Email notifications if issues

### 4. Analytics per Subdomain
```javascript
// Google Analytics
gtag('config', 'GA_MEASUREMENT_ID', {
  'page_path': window.location.pathname,
  'custom_map': {
    'dimension1': getSubdomain()  // Track which tenant
  }
});
```

### 5. Custom Domain per Tenant (Future)
```
Tenant can add: www.poppydesign.com
CNAME to: poppy.porto.bagdja.com
Result: Custom domain shows their portfolio
```

---

## 🆘 Support

**If you encounter issues:**

1. **Check console logs:**
   ```javascript
   // Should see:
   "Detected tenant from subdomain: poppy"
   ```

2. **Verify DNS:**
   ```bash
   nslookup poppy.porto.bagdja.com
   ```

3. **Check Vercel deployment logs:**
   - Go to Vercel dashboard
   - Check latest deployment
   - Look for errors

4. **Test subdomainHelper locally:**
   ```javascript
   // In browser console
   import { getSubdomain } from './utils/subdomainHelper';
   console.log(getSubdomain());
   ```

---

## 📝 Notes

- DNS changes can take up to 48 hours globally (usually 10-30 minutes)
- Cloudflare proxy adds caching and DDoS protection
- Vercel handles SSL automatically
- Wildcard certificate covers unlimited subdomains
- Old path-based URLs still work (backward compatible)
- Admin panel accessible from any subdomain: `poppy.porto.bagdja.com/admin`

**Happy deploying! 🚀**

