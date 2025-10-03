# 🔔 Global Alert/Notification System

Modern toast notification system dengan design yang bagus menggantikan `alert()` browser default.

## ✨ Features

✅ **4 Alert Types** - Success, Error, Warning, Info  
✅ **Auto Dismiss** - Otomatis hilang setelah 5 detik (customizable)  
✅ **Progress Bar** - Visual indicator countdown  
✅ **Smooth Animations** - Slide in from right  
✅ **Dark Mode Support** - Automatic theming  
✅ **Multiple Alerts** - Queue system untuk multiple notifications  
✅ **Close Button** - Manual dismiss  
✅ **Accessible** - ARIA labels dan keyboard support  
✅ **Beautiful UI** - Modern design dengan Tailwind CSS  

## 🎨 Alert Types

### 1. **Success** ✅
```javascript
alert.success('Project created successfully!');
alert.success('Data has been saved.', 'Success'); // custom title
```
**When to use:** Successful operations, confirmations
**Color:** Green

### 2. **Error** ❌
```javascript
alert.error('Failed to upload file!');
alert.error('Network connection lost.', 'Connection Error');
```
**When to use:** Errors, failures, critical issues
**Color:** Red

### 3. **Warning** ⚠️
```javascript
alert.warning('You can only upload up to 10 files');
alert.warning('This action cannot be undone.', 'Warning');
```
**When to use:** Warnings, cautions, non-critical issues
**Color:** Yellow

### 4. **Info** ℹ️
```javascript
alert.info('Please wait while we process your request');
alert.info('New features available!', 'Update Available');
```
**When to use:** Information, tips, updates
**Color:** Blue

## 🚀 Usage

### Basic Usage

```javascript
import { useAlert } from '../context/AlertContext';

const MyComponent = () => {
  const alert = useAlert();

  const handleSubmit = async () => {
    try {
      // ... your code
      alert.success('Form submitted successfully!');
    } catch (error) {
      alert.error('Failed to submit form. Please try again.');
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
};
```

### Custom Duration

```javascript
// Auto-dismiss after 10 seconds
alert.showAlert({
  type: 'info',
  title: 'Processing',
  message: 'This may take a while...',
  duration: 10000
});

// No auto-dismiss (duration: 0 or null)
alert.showAlert({
  type: 'warning',
  title: 'Important',
  message: 'Please read this carefully!',
  duration: 0
});
```

### Advanced Usage

```javascript
const alert = useAlert();

// With all options
alert.showAlert({
  type: 'success',
  title: 'Upload Complete',
  message: 'Your file has been uploaded successfully.',
  duration: 5000
});

// Get alert ID for manual removal
const alertId = alert.info('Loading...');
// Later...
alert.removeAlert(alertId);
```

## 📦 Components & Structure

### 1. **Alert Component** (`src/components/Alert.jsx`)

Individual alert/toast notification.

**Props:**
- `id` - Unique identifier
- `type` - 'success' | 'error' | 'warning' | 'info'
- `title` - Alert title (optional)
- `message` - Alert message
- `duration` - Auto-dismiss duration in ms (default: 5000)
- `onClose` - Callback when closed

### 2. **AlertContext** (`src/context/AlertContext.jsx`)

Global state management for alerts.

**Provides:**
- `showAlert(options)` - Show custom alert
- `success(message, title?)` - Show success alert
- `error(message, title?)` - Show error alert
- `warning(message, title?)` - Show warning alert
- `info(message, title?)` - Show info alert
- `removeAlert(id)` - Manually remove alert

### 3. **AlertProvider**

Wrap your app with AlertProvider (already done in `App.jsx`).

```javascript
<ThemeProvider>
  <AuthProvider>
    <AlertProvider>
      {/* Your app */}
    </AlertProvider>
  </AuthProvider>
</ThemeProvider>
```

## 🎨 Visual Design

### Alert Structure

```
┌────────────────────────────────────────────────┐
│ [Icon] Title                               [X] │
│        Message text here                       │
│        ━━━━━━━━━━━━━━━━━━━━━━━━ (progress)    │
└────────────────────────────────────────────────┘
```

### Color Schemes

**Success (Green):**
- Background: `bg-green-50` (light) / `bg-green-900/20` (dark)
- Border: `border-green-500`
- Icon/Text: `text-green-500`

**Error (Red):**
- Background: `bg-red-50` (light) / `bg-red-900/20` (dark)
- Border: `border-red-500`
- Icon/Text: `text-red-500`

**Warning (Yellow):**
- Background: `bg-yellow-50` (light) / `bg-yellow-900/20` (dark)
- Border: `border-yellow-500`
- Icon/Text: `text-yellow-500`

**Info (Blue):**
- Background: `bg-blue-50` (light) / `bg-blue-900/20` (dark)
- Border: `border-blue-500`
- Icon/Text: `text-blue-500`

## 🎬 Animations

### Slide In Animation

```css
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Progress Bar Animation

```css
@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
```

## 📍 Position

Alerts appear at **top-right** corner of the screen:

```css
.fixed.top-4.right-4.z-[9999]
```

- **Fixed position** - Stays visible on scroll
- **Top-right** - Non-intrusive placement
- **Z-index 9999** - Always on top
- **Max-width 384px** - Readable width

## 🔄 Migration from Old Alerts

### Before (Browser Alert)
```javascript
alert('Project created successfully!');
alert('Failed to save project.');
```

### After (Custom Alert)
```javascript
alert.success('Project created successfully!');
alert.error('Failed to save project.');
```

### Migration Checklist

✅ **AdminPortfolio.jsx** - All alerts replaced  
✅ **AdminBlog.jsx** - All alerts replaced  
✅ **AdminMessages.jsx** - All alerts replaced  
✅ **MediaUploader.jsx** - All alerts replaced  

## 🎯 Best Practices

### DO ✅

```javascript
// Specific, actionable messages
alert.success('Project created successfully!');
alert.error('Failed to upload file. File size exceeds 50MB.');

// Use appropriate type
alert.warning('You have unsaved changes.');
alert.info('Tip: Press Ctrl+S to save.');

// Clear titles for context
alert.error('Network error occurred.', 'Connection Failed');
```

### DON'T ❌

```javascript
// Too vague
alert.error('Error!');
alert.info('Done');

// Wrong type
alert.success('File not found'); // Should be error
alert.error('Data saved'); // Should be success

// Too long
alert.info('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...');
```

## 📱 Responsive Design

Alerts are responsive and adapt to screen sizes:

```javascript
// Container
className="max-w-md w-full"

// Mobile: Full width (minus padding)
// Tablet: Max 384px
// Desktop: Max 384px
```

## 🔧 Customization

### Change Default Duration

Edit `AlertContext.jsx`:

```javascript
const showAlert = useCallback(({ 
  type = 'info', 
  title, 
  message, 
  duration = 8000 // Change from 5000 to 8000
}) => {
  // ...
}, []);
```

### Change Position

Edit `AlertContext.jsx`:

```javascript
// Top-left
<div className="fixed top-4 left-4 z-[9999]">

// Bottom-right
<div className="fixed bottom-4 right-4 z-[9999]">

// Bottom-center
<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
```

### Add New Alert Type

Edit `Alert.jsx`:

```javascript
const types = {
  success: { /* ... */ },
  error: { /* ... */ },
  warning: { /* ... */ },
  info: { /* ... */ },
  // Add new type
  premium: {
    icon: FiStar,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-500',
    iconColor: 'text-purple-500',
    textColor: 'text-purple-800 dark:text-purple-200',
    progressBar: 'bg-purple-500',
  },
};
```

Then add method in `AlertContext.jsx`:

```javascript
const premium = useCallback((message, title = 'Premium') => {
  return showAlert({ type: 'premium', title, message });
}, [showAlert]);
```

## 🧪 Testing

### Test All Alert Types

```javascript
const TestAlerts = () => {
  const alert = useAlert();

  return (
    <div className="p-4 space-y-2">
      <button onClick={() => alert.success('Success message')}>
        Test Success
      </button>
      <button onClick={() => alert.error('Error message')}>
        Test Error
      </button>
      <button onClick={() => alert.warning('Warning message')}>
        Test Warning
      </button>
      <button onClick={() => alert.info('Info message')}>
        Test Info
      </button>
    </div>
  );
};
```

## 📊 Usage Statistics

Current usage in the app:

- **AdminPortfolio.jsx**: 4 alerts (create, update, delete, error)
- **AdminBlog.jsx**: 4 alerts (publish, update, delete, error)
- **AdminMessages.jsx**: 2 alerts (delete, error)
- **MediaUploader.jsx**: 3 alerts (file limit, invalid file, upload failed)

**Total**: 13 alert calls replaced from browser `alert()`

## 🎉 Benefits vs Browser Alert

| Feature | Browser Alert | Custom Alert |
|---------|---------------|--------------|
| Design | Ugly, system-dependent | Beautiful, consistent |
| Dark Mode | ❌ No support | ✅ Auto-adapts |
| Position | Center (blocks UI) | Top-right (non-blocking) |
| Auto-dismiss | ❌ Manual only | ✅ Auto after 5s |
| Multiple alerts | ❌ Blocks queue | ✅ Stack nicely |
| Animations | ❌ None | ✅ Smooth slide-in |
| Customization | ❌ None | ✅ Fully customizable |
| Types | ❌ Generic | ✅ 4 types with colors |
| Progress indicator | ❌ No | ✅ Visual countdown |
| Close button | ❌ OK only | ✅ X button |

## 📚 Related Files

- `src/components/Alert.jsx` - Alert component
- `src/context/AlertContext.jsx` - Alert context & provider
- `src/App.jsx` - AlertProvider integration
- `src/index.css` - Alert animations
- `src/pages/admin/AdminPortfolio.jsx` - Usage example
- `src/pages/admin/AdminBlog.jsx` - Usage example
- `src/pages/admin/AdminMessages.jsx` - Usage example
- `src/components/MediaUploader.jsx` - Usage example

---

**Enjoy the beautiful alerts!** 🎊 No more ugly browser popups! 🚫
