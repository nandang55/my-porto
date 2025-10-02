# Quick Start Guide

Panduan cepat untuk menjalankan website portfolio Anda.

## Langkah 1: Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

2. Edit file `.env` dan isi dengan credentials Supabase Anda:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Catatan**: Jika Anda belum setup Supabase, website tetap bisa dijalankan dengan data dummy. Lihat `SUPABASE_SETUP.md` untuk panduan lengkap setup Supabase.

## Langkah 2: Jalankan Development Server

```bash
npm run dev
```

Website akan berjalan di `http://localhost:5173`

## Langkah 3: Akses Website

### Halaman Public
- **Home**: `http://localhost:5173/`
- **Portfolio**: `http://localhost:5173/portfolio`
- **Blog**: `http://localhost:5173/blog`
- **About**: `http://localhost:5173/about`
- **Contact**: `http://localhost:5173/contact`

### Admin Panel
- **Login**: `http://localhost:5173/admin/login`
- **Dashboard**: `http://localhost:5173/admin/dashboard` (setelah login)

## Mode Tanpa Supabase (Demo Mode)

Jika Anda belum setup Supabase, website akan menggunakan data dummy:
- Portfolio akan menampilkan 3 project contoh
- Blog akan menampilkan 3 artikel contoh
- Contact form akan gagal submit (karena tidak ada database)

Untuk functionality penuh, ikuti panduan di `SUPABASE_SETUP.md`.

## Kustomisasi Website

### Update Informasi Pribadi

1. **Nama & Bio** - Edit `src/pages/Home.jsx`
2. **About/Skills** - Edit `src/pages/About.jsx`
3. **Contact Info** - Edit `src/pages/Contact.jsx`
4. **Social Links** - Edit `src/components/Footer.jsx`

### Ganti Warna Theme

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Ganti warna sesuai keinginan
    600: '#0284c7', // warna utama
    // ...
  },
}
```

### Ganti Font

Edit `src/index.css` dan tambahkan font di `index.html`.

## Deploy ke Production

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Jangan lupa set environment variables di Vercel dashboard
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Jangan lupa set environment variables di Netlify dashboard
```

## Troubleshooting

### Build Error
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Failed
- Pastikan `.env` sudah dibuat dan diisi dengan benar
- Restart development server setelah mengubah `.env`
- Cek di console browser untuk error message detail

### Dark Mode Tidak Bekerja
- Clear browser cache dan reload
- Cek localStorage browser Anda

## Next Steps

1. ✅ Jalankan website locally
2. 📝 Kustomisasi konten dan styling
3. 🗄️ Setup Supabase (lihat `SUPABASE_SETUP.md`)
4. 🚀 Deploy ke production
5. 🎨 Tambahkan foto dan konten asli

## Tips

- Gunakan **React DevTools** untuk debugging
- Test dark mode dengan toggle di navbar
- Test responsive design dengan browser DevTools
- Gunakan admin panel untuk mengelola konten

---

Butuh bantuan? Baca `README.md` atau `SUPABASE_SETUP.md` untuk dokumentasi lengkap.

