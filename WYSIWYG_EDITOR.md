# 📝 WYSIWYG Rich Text Editor with CKEditor

Professional rich text editor powered by CKEditor 5 Classic!

## ✨ Features

✅ **WYSIWYG Editing** - What You See Is What You Get  
✅ **Rich Formatting** - Bold, Italic, Underline, Strikethrough  
✅ **Headings** - H1, H2, H3 for document structure  
✅ **Lists** - Bullet lists and numbered lists  
✅ **Links** - Hyperlinks with "open in new tab" option  
✅ **Tables** - Insert and edit tables  
✅ **Block Quotes** - For citations and quotes  
✅ **Undo/Redo** - Full history support  
✅ **Dark Mode** - Auto-adapts to theme  
✅ **Professional UI** - Industry-standard editor  
✅ **Clean HTML** - Semantic markup output  

---

## 🎨 Visual Preview

### **Editor Mode (Admin)**

```
┌──────────────────────────────────────────────────────┐
│ [Heading ▼] [B] [I] [U] [S] [🔗] [•] [1.] ["] [Table]│
│ [↶] [↷]                                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│ # Main Heading                                       │
│                                                      │
│ This is **bold**, *italic*, and underlined text.    │
│                                                      │
│ • First bullet point                                 │
│ • Second bullet point                                │
│                                                      │
│ 1. Numbered item one                                 │
│ 2. Numbered item two                                 │
│                                                      │
│ > This is a blockquote                               │
│                                                      │
│ Visit [our website](https://example.com)             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Toolbar Features

### **Heading Dropdown**
- Paragraph (default)
- Heading 1 (H1) - Large title
- Heading 2 (H2) - Section title
- Heading 3 (H3) - Subsection title

### **Text Formatting**
- **Bold** - Make text bold (Ctrl/Cmd + B)
- *Italic* - Make text italic (Ctrl/Cmd + I)
- <u>Underline</u> - Underline text (Ctrl/Cmd + U)
- ~~Strikethrough~~ - Strike through text

### **Lists**
- **Bullet List** - Unordered list with bullets
- **Numbered List** - Ordered list with numbers

### **Links**
- **Insert Link** - Add hyperlinks
- Option to open in new tab
- Auto-detects and formats URLs

### **Blocks**
- **Block Quote** - For citations
- **Table** - Insert and edit tables

### **History**
- **Undo** - Undo last change (Ctrl/Cmd + Z)
- **Redo** - Redo undone change (Ctrl/Cmd + Shift + Z)

---

## 📦 Component Usage

### **RichTextEditor** (`src/components/RichTextEditor.jsx`)

**Props:**
- `value` - HTML string content
- `onChange` - Callback when content changes
- `placeholder` - Placeholder text (default: "Start writing...")
- `minHeight` - Minimum editor height (default: "200px")

**Example:**
```javascript
import RichTextEditor from '../components/RichTextEditor';

const [content, setContent] = useState('');

<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your content here..."
  minHeight="300px"
/>
```

---

## 💻 Implementation

### **AdminPortfolio.jsx** - Project Description

```javascript
const [description, setDescription] = useState('');

<RichTextEditor
  value={description}
  onChange={setDescription}
  placeholder="Write a detailed project description..."
  minHeight="250px"
/>

// Save HTML to database
const projectData = {
  description: description,
  // ...
};
```

### **AdminBlog.jsx** - Blog Content

```javascript
const [content, setContent] = useState('');

<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your blog post..."
  minHeight="400px"
/>

// Save HTML to database
const postData = {
  content: content,
  // ...
};
```

### **Display HTML Content**

```javascript
// Portfolio.jsx or Blog.jsx
<div 
  className="prose prose-sm"
  dangerouslySetInnerHTML={{ __html: project.description }}
/>
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl/Cmd + B** | Bold |
| **Ctrl/Cmd + I** | Italic |
| **Ctrl/Cmd + U** | Underline |
| **Ctrl/Cmd + Z** | Undo |
| **Ctrl/Cmd + Shift + Z** | Redo |
| **Ctrl/Cmd + K** | Insert link |
| **Tab** | Indent (in lists) |
| **Shift + Tab** | Outdent (in lists) |
| **Enter** | New paragraph |
| **Shift + Enter** | Line break |

---

## 🎨 CKEditor Configuration

### **Current Toolbar:**
```javascript
toolbar: [
  'heading', '|',
  'bold', 'italic', 'underline', 'strikethrough', '|',
  'link', 'bulletedList', 'numberedList', '|',
  'blockQuote', 'insertTable', '|',
  'undo', 'redo'
]
```

### **Heading Options:**
```javascript
heading: {
  options: [
    { model: 'paragraph', title: 'Paragraph' },
    { model: 'heading1', view: 'h1', title: 'Heading 1' },
    { model: 'heading2', view: 'h2', title: 'Heading 2' },
    { model: 'heading3', view: 'h3', title: 'Heading 3' }
  ]
}
```

### **Link Configuration:**
```javascript
link: {
  defaultProtocol: 'https://',
  decorators: {
    openInNewTab: {
      mode: 'manual',
      label: 'Open in a new tab',
      attributes: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }
  }
}
```

---

## 📊 HTML Output Examples

### **Example 1: Formatted Text**

**Editor:**
```
This is **bold** and *italic* text.
```

**HTML Output:**
```html
<p>This is <strong>bold</strong> and <em>italic</em> text.</p>
```

### **Example 2: Headings & Lists**

**Editor:**
```
# Features

- Easy to use
- Professional
- Powerful
```

**HTML Output:**
```html
<h1>Features</h1>
<ul>
  <li>Easy to use</li>
  <li>Professional</li>
  <li>Powerful</li>
</ul>
```

### **Example 3: Links & Quotes**

**Editor:**
```
> "Great editor!" - User

Visit [CKEditor](https://ckeditor.com)
```

**HTML Output:**
```html
<blockquote>
  <p>"Great editor!" - User</p>
</blockquote>
<p>Visit <a href="https://ckeditor.com">CKEditor</a></p>
```

### **Example 4: Tables**

**Editor:**
```
| Feature | Status |
|---------|--------|
| Bold    | ✅     |
| Tables  | ✅     |
```

**HTML Output:**
```html
<table>
  <tr>
    <th>Feature</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>Bold</td>
    <td>✅</td>
  </tr>
  <tr>
    <td>Tables</td>
    <td>✅</td>
  </tr>
</table>
```

---

## 🎯 Best Practices

### **DO ✅**

```
✅ Use headings for structure (H1 → H2 → H3)
✅ Bold for emphasis, italic for subtle emphasis
✅ Lists for multiple points
✅ Links to external resources
✅ Block quotes for citations
✅ Tables for data presentation
✅ Keep content well-organized
```

### **DON'T ❌**

```
❌ Skip heading levels (H1 → H3)
❌ Overuse bold/italic everywhere
❌ Create overly complex tables
❌ Use too many different styles
❌ Forget to add link text
❌ Leave empty paragraphs
```

---

## 🔧 Customization

### **Add More Toolbar Items**

Edit `RichTextEditor.jsx`:

```javascript
toolbar: [
  'heading', '|',
  'bold', 'italic', 'underline', 'strikethrough', '|',
  'link', 'bulletedList', 'numberedList', '|',
  'blockQuote', 'insertTable', '|',
  'imageUpload', 'mediaEmbed', '|', // Add these
  'undo', 'redo'
]
```

### **Change Editor Height**

```javascript
<RichTextEditor
  value={content}
  onChange={setContent}
  minHeight="500px" // Increase height
/>
```

### **Custom CSS Styling**

Edit `RichTextEditor.css`:

```css
.rich-text-editor-wrapper .ck-editor__editable {
  min-height: 300px; /* Change default height */
  font-size: 18px;   /* Increase font size */
}
```

---

## 🌙 Dark Mode Support

CKEditor automatically adapts to dark mode:

**Light Mode:**
- White background
- Dark text
- Light toolbar

**Dark Mode:**
- Dark gray background (#374151)
- Light text (#f3f4f6)
- Dark toolbar (#1f2937)

All colors defined in `RichTextEditor.css`.

---

## 📱 Responsive Design

CKEditor is fully responsive:

- **Desktop**: Full toolbar visible
- **Tablet**: Toolbar wraps nicely
- **Mobile**: Touch-optimized
- **All**: Scrollable content area

---

## 🆚 CKEditor vs Plain Textarea

| Feature | Textarea | CKEditor 5 |
|---------|----------|------------|
| **Formatting** | None | ✅ Full rich text |
| **Preview** | ❌ No | ✅ WYSIWYG |
| **Tables** | ❌ No | ✅ Yes |
| **Lists** | Plain text | ✅ Formatted |
| **Links** | Plain URL | ✅ Clickable |
| **Headings** | Plain | ✅ Styled |
| **Undo/Redo** | Basic | ✅ Full history |
| **Professional** | ❌ No | ✅ Industry standard |
| **User Experience** | Poor | ✅ Excellent |

---

## 🎊 Why CKEditor?

### **Advantages:**

✅ **Industry Standard** - Used by millions worldwide  
✅ **Feature Rich** - 100+ plugins available  
✅ **Professional UI** - Beautiful, polished interface  
✅ **Well Documented** - Extensive official docs  
✅ **Actively Maintained** - Regular updates  
✅ **Extensible** - Easy to add features  
✅ **Accessibility** - WCAG compliant  
✅ **Performance** - Optimized and fast  

### **Perfect For:**

- Blog posts
- Project descriptions
- Documentation
- News articles
- Product descriptions
- Any rich text content!

---

## 🔐 Security

### **HTML Sanitization**

For production, sanitize HTML:

```bash
npm install dompurify
```

```javascript
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(content) 
}} />
```

---

## 📚 Available Plugins (Not Installed)

CKEditor has many plugins you can add:

- **Image Upload** - Upload images
- **Media Embed** - Embed videos (YouTube, Vimeo)
- **Code Block** - Syntax highlighted code
- **Font** - Font family & size
- **Text Color** - Color picker
- **Alignment** - Text alignment
- **Horizontal Line** - Insert HR
- **Special Characters** - Insert symbols
- **Emoji** - Emoji picker
- And 100+ more!

---

## 💡 Usage Tips

### **For Better Content:**

1. ✅ Start with a heading (H1)
2. ✅ Use H2 for main sections
3. ✅ Use H3 for subsections
4. ✅ Break text into paragraphs
5. ✅ Use lists for multiple points
6. ✅ Add links to references
7. ✅ Use bold sparingly
8. ✅ Tables for structured data

---

## 📦 Dependencies

```json
{
  "@ckeditor/ckeditor5-react": "^latest",
  "@ckeditor/ckeditor5-build-classic": "^latest"
}
```

---

## 📂 Files

- ✅ `src/components/RichTextEditor.jsx` - Component
- ✅ `src/components/RichTextEditor.css` - Styles
- ✅ `src/index.css` - Prose styles for display
- ✅ `src/pages/admin/AdminPortfolio.jsx` - Uses editor
- ✅ `src/pages/admin/AdminBlog.jsx` - Uses editor
- ✅ `src/pages/Portfolio.jsx` - Displays HTML
- ✅ `src/pages/Blog.jsx` - Displays HTML

---

## 🎉 Summary

### **What You Got:**

✅ **Professional WYSIWYG editor** powered by CKEditor 5  
✅ **15+ formatting tools** (headings, bold, italic, lists, links, tables, etc.)  
✅ **Beautiful UI** - Industry-standard design  
✅ **Dark mode support** - Auto-adapts  
✅ **Keyboard shortcuts** - Power user friendly  
✅ **Tables support** - For structured data  
✅ **Clean HTML output** - Semantic markup  
✅ **Undo/Redo** - Full editing history  
✅ **Responsive** - Works on all devices  
✅ **Extensible** - Easy to add more features  
✅ **Production ready** - Battle-tested editor  

---

**Enjoy CKEditor 5!** 📝✨  
The professional choice for rich text editing! 🎨