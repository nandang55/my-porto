import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './RichTextEditor.css';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...',
  minHeight = '200px'
}) => {
  const editorConfiguration = {
    placeholder,
    toolbar: {
      items: [
        'heading', '|',
        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
        'alignment', '|',
        'numberedList', 'bulletedList', '|',
        'outdent', 'indent', '|',
        'link', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
        'horizontalLine', 'specialCharacters', '|',
        'undo', 'redo', '|',
        'sourceEditing'
      ],
      shouldNotGroupWhenFull: true
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    fontSize: {
      options: [
        'tiny',
        'small',
        'default',
        'big',
        'huge'
      ]
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    fontColor: {
      colors: [
        {
          color: 'hsl(0, 0%, 0%)',
          label: 'Black'
        },
        {
          color: 'hsl(0, 0%, 30%)',
          label: 'Dim grey'
        },
        {
          color: 'hsl(0, 0%, 60%)',
          label: 'Grey'
        },
        {
          color: 'hsl(0, 0%, 90%)',
          label: 'Light grey'
        },
        {
          color: 'hsl(0, 0%, 100%)',
          label: 'White',
          hasBorder: true
        },
        {
          color: 'hsl(0, 75%, 60%)',
          label: 'Red'
        },
        {
          color: 'hsl(30, 75%, 60%)',
          label: 'Orange'
        },
        {
          color: 'hsl(60, 75%, 60%)',
          label: 'Yellow'
        },
        {
          color: 'hsl(90, 75%, 60%)',
          label: 'Light green'
        },
        {
          color: 'hsl(120, 75%, 60%)',
          label: 'Green'
        },
        {
          color: 'hsl(150, 75%, 60%)',
          label: 'Aquamarine'
        },
        {
          color: 'hsl(180, 75%, 60%)',
          label: 'Turquoise'
        },
        {
          color: 'hsl(210, 75%, 60%)',
          label: 'Light blue'
        },
        {
          color: 'hsl(240, 75%, 60%)',
          label: 'Blue'
        },
        {
          color: 'hsl(270, 75%, 60%)',
          label: 'Purple'
        }
      ]
    },
    fontBackgroundColor: {
      colors: [
        {
          color: 'hsl(0, 0%, 0%)',
          label: 'Black'
        },
        {
          color: 'hsl(0, 0%, 30%)',
          label: 'Dim grey'
        },
        {
          color: 'hsl(0, 0%, 60%)',
          label: 'Grey'
        },
        {
          color: 'hsl(0, 0%, 90%)',
          label: 'Light grey'
        },
        {
          color: 'hsl(0, 0%, 100%)',
          label: 'White',
          hasBorder: true
        },
        {
          color: 'hsl(0, 75%, 60%)',
          label: 'Red'
        },
        {
          color: 'hsl(30, 75%, 60%)',
          label: 'Orange'
        },
        {
          color: 'hsl(60, 75%, 60%)',
          label: 'Yellow'
        },
        {
          color: 'hsl(90, 75%, 60%)',
          label: 'Light green'
        },
        {
          color: 'hsl(120, 75%, 60%)',
          label: 'Green'
        },
        {
          color: 'hsl(150, 75%, 60%)',
          label: 'Aquamarine'
        },
        {
          color: 'hsl(180, 75%, 60%)',
          label: 'Turquoise'
        },
        {
          color: 'hsl(210, 75%, 60%)',
          label: 'Light blue'
        },
        {
          color: 'hsl(240, 75%, 60%)',
          label: 'Blue'
        },
        {
          color: 'hsl(270, 75%, 60%)',
          label: 'Purple'
        }
      ]
    },
    alignment: {
      options: ['left', 'center', 'right', 'justify']
    },
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
        },
        isDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'python', label: 'Python' },
        { language: 'php', label: 'PHP' },
        { language: 'java', label: 'Java' },
        { language: 'c', label: 'C' },
        { language: 'cpp', label: 'C++' },
        { language: 'csharp', label: 'C#' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'go', label: 'Go' },
        { language: 'rust', label: 'Rust' },
        { language: 'swift', label: 'Swift' },
        { language: 'kotlin', label: 'Kotlin' },
        { language: 'sql', label: 'SQL' },
        { language: 'html', label: 'HTML' },
        { language: 'css', label: 'CSS' },
        { language: 'xml', label: 'XML' },
        { language: 'json', label: 'JSON' },
        { language: 'yaml', label: 'YAML' },
        { language: 'markdown', label: 'Markdown' },
        { language: 'bash', label: 'Bash' },
        { language: 'shell', label: 'Shell' }
      ]
    },
    htmlEmbed: {
      showPreviews: true,
      sanitizeHtml: (inputHtml) => {
        // Basic sanitization - remove script tags
        return inputHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
    },
    mediaEmbed: {
      previewsInData: true,
      providers: [
        {
          name: 'youtube',
          url: [
            /^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)/,
            /^(?:m\.)?youtube\.com\/v\/([\w-]+)/,
            /^youtube\.com\/embed\/([\w-]+)/,
            /^youtu\.be\/([\w-]+)/
          ],
          html: match => {
            const id = match[1];
            return (
              '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                `<iframe src="https://www.youtube.com/embed/${id}" ` +
                  'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                  'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                '</iframe>' +
              '</div>'
            );
          }
        },
        {
          name: 'vimeo',
          url: [
            /^vimeo\.com\/(\d+)/,
            /^vimeo\.com\/[^/]+\/[^/]+\/video\/(\d+)/,
            /^vimeo\.com\/album\/[^/]+\/video\/(\d+)/,
            /^vimeo\.com\/channels\/[^/]+\/(\d+)/,
            /^vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
            /^vimeo\.com\/ondemand\/[^/]+\/(\d+)/,
            /^player\.vimeo\.com\/video\/(\d+)/
          ],
          html: match => {
            const id = match[1];
            return (
              '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                `<iframe src="https://player.vimeo.com/video/${id}" ` +
                  'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                  'frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>' +
                '</iframe>' +
              '</div>'
            );
          }
        }
      ]
    }
  };

  return (
    <div className="rich-text-editor-wrapper" style={{ minHeight }}>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default RichTextEditor;