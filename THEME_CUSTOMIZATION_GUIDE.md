# Theme Customization Guide

## 🎨 Overview
Comprehensive theme and color customization system that allows each user to personalize their portfolio's appearance with custom color schemes.

## 🖼️ Visual Assets

### **1. Cover Image** (cover_image)
- **Purpose:** Hero section background banner
- **Recommended Size:** 1920x600px
- **Max Size:** 5MB
- **Formats:** JPG, PNG, WebP, GIF
- **Applied to:**
  - Hero section background with color overlay
  - Creates a more personalized and professional look
- **Fallback:** If no cover image, uses gradient of primary color

### **2. Favicon** (favicon_url)
- **Purpose:** Browser tab icon
- **Recommended Size:** 32x32px or 64x64px
- **Max Size:** 1MB
- **Formats:** PNG, ICO, SVG
- **Applied to:**
  - Browser tab icon
  - Bookmark icon
  - Dynamically set via JavaScript

## 🌈 Available Color Settings

### **1. Primary Color** (theme_color)
- **Purpose:** Main brand color
- **Default:** `#0284c7` (Sky Blue)
- **Applied to:**
  - Hero section background gradient
  - Navigation active/hover states
  - Avatar border in navbar
  - Project title hover effect
  - Project placeholder background
  - Button primary states
  - Footer Skills icon gradient (primary → secondary)

### **2. Secondary Color** (secondary_color)
- **Purpose:** Supporting brand color
- **Default:** `#6366f1` (Indigo)
- **Applied to:**
  - Hero gradient (blended with primary)
  - Footer Skills icon gradient
  - Footer Languages icon gradient (secondary → accent)
  - Secondary buttons and elements

### **3. Accent Color** (accent_color)
- **Purpose:** Highlight and special elements
- **Default:** `#f59e0b` (Amber)
- **Applied to:**
  - Availability badge (Available for hire)
  - Footer "MY EXPERTISE" badge
  - Footer Languages icon gradient
  - Special highlights and badges

### **4. Primary Text Color** (text_primary)
- **Purpose:** Main text for headings and important content
- **Default:** `#1f2937` (Gray-800)
- **Applied to:**
  - Headings
  - Important text elements
  - (Future: can be dynamically applied)

### **5. Secondary Text Color** (text_secondary)
- **Purpose:** Muted text for descriptions
- **Default:** `#6b7280` (Gray-500)
- **Applied to:**
  - Descriptions
  - Captions
  - Less important text
  - (Future: can be dynamically applied)

### **6. Light Background** (bg_light)
- **Purpose:** Main background in light mode
- **Default:** `#ffffff` (White)
- **Applied to:**
  - Page background (light mode)
  - Card backgrounds

### **7. Dark Background** (bg_dark)
- **Purpose:** Main background in dark mode
- **Default:** `#111827` (Gray-900)
- **Applied to:**
  - Page background (dark mode)
  - Card backgrounds

## 🎯 Quick Presets

Pre-configured color schemes for instant professional looks:

### **Ocean Blue** (Default)
```
Primary:   #0284c7 (Sky Blue)
Secondary: #0ea5e9 (Cyan)
Accent:    #38bdf8 (Light Blue)
```

### **Purple Dream**
```
Primary:   #7c3aed (Violet)
Secondary: #a78bfa (Purple-400)
Accent:    #c084fc (Purple-300)
```

### **Emerald Fresh**
```
Primary:   #059669 (Emerald)
Secondary: #10b981 (Green)
Accent:    #34d399 (Emerald-400)
```

### **Sunset Orange**
```
Primary:   #ea580c (Orange)
Secondary: #f97316 (Orange-500)
Accent:    #fb923c (Orange-400)
```

### **Rose Pink**
```
Primary:   #e11d48 (Rose)
Secondary: #f43f5e (Rose-500)
Accent:    #fb7185 (Rose-400)
```

### **Teal Fresh**
```
Primary:   #0d9488 (Teal)
Secondary: #14b8a6 (Teal-500)
Accent:    #2dd4bf (Teal-400)
```

### **Slate Professional**
```
Primary:   #475569 (Slate)
Secondary: #64748b (Slate-500)
Accent:    #94a3b8 (Slate-400)
```

### **Crimson Bold**
```
Primary:   #dc2626 (Red)
Secondary: #ef4444 (Red-500)
Accent:    #f87171 (Red-400)
```

## 🛠️ How to Use

### **Step 1: Go to Settings**
Navigate to `/admin/settings` and click the **"Theme & Colors"** tab.

### **Step 2: Choose Method**
You can customize colors in two ways:

#### A. Use Quick Presets
- Click any preset card
- Colors instantly applied
- See live preview at the top

#### B. Manual Customization
- Use color picker to visually select colors
- Or type hex codes directly
- Both inputs sync automatically

### **Step 3: Preview**
- Live preview gradient at the top of the tab
- Shows how primary and secondary colors blend

### **Step 4: Save**
- Click "Update Settings"
- Colors saved to database
- Visit public portfolio to see changes

## 📐 Color Application Map

### **Hero Section:**
```
Background: linear-gradient(theme_color → theme_color+opacity)
Avatar Border: theme_color
```

### **Navigation:**
```
Active Link: theme_color
Hover Link: theme_color
Avatar Border: theme_color
```

### **Projects:**
```
Title Hover: theme_color
Placeholder BG: theme_color gradient
```

### **Footer:**
```
Skills Badge: accent_color
Skills Icon: theme_color → secondary_color gradient
Languages Icon: secondary_color → accent_color gradient
Availability Badge: accent_color
```

## 💡 Best Practices

### **Color Harmony:**
- Choose colors that complement each other
- Use color wheel for guidance (complementary, analogous, triadic)
- Test readability with white and dark text

### **Contrast:**
- Ensure sufficient contrast for accessibility
- Test in both light and dark modes
- WCAG recommends 4.5:1 for normal text, 3:1 for large text

### **Consistency:**
- Primary: Main actions and navigation
- Secondary: Supporting elements
- Accent: Special highlights only

### **Testing:**
1. Save theme colors
2. View portfolio in light mode
3. Toggle dark mode
4. Check all pages (Projects, Blog, About, Contact)
5. Verify readability and aesthetics

## 🔧 Technical Implementation

### **Database Schema:**
```sql
portfolios table:
  - theme_color (text) - Primary brand color
  - secondary_color (text) - Secondary color
  - accent_color (text) - Accent/highlight color
  - text_primary (text) - Main text color
  - text_secondary (text) - Muted text color
  - bg_light (text) - Light background
  - bg_dark (text) - Dark background
```

### **CSS Variables:**
Colors are injected as CSS custom properties:
```javascript
document.documentElement.style.setProperty('--theme-primary', color);
document.documentElement.style.setProperty('--theme-secondary', color);
document.documentElement.style.setProperty('--theme-accent', color);
// ... etc
```

### **Inline Styles:**
Most theme colors use inline styles for dynamic application:
```jsx
<div style={{ backgroundColor: portfolio.theme_color }}>
<div style={{ borderColor: portfolio.accent_color }}>
<div style={{ 
  background: `linear-gradient(${portfolio.theme_color}, ${portfolio.secondary_color})`
}}>
```

## 🎨 Future Enhancements

Potential additions:
- [ ] Font customization (Google Fonts integration)
- [ ] Border radius customization
- [ ] Shadow intensity
- [ ] Spacing preferences
- [ ] Button style variants
- [ ] Gradient direction options
- [ ] More preset themes
- [ ] Import/Export color schemes
- [ ] Color palette generator
- [ ] Accessibility checker

## 📊 Migration

Run the migration to add new color columns:
```bash
# Migration file: 20250104000000_add_theme_colors.sql
```

Default values are set for all new color columns, so existing portfolios will continue to work with the default Ocean Blue theme.

---

**Created:** 2025-01-03  
**Last Updated:** 2025-01-03

