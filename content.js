// Content script for Markdown Clipper extension

console.log('Markdown Clipper: Content script loaded');

// Initialize Turndown service with defensive checks
let turndownService = null;

try {
  // Verify Turndown is available
  if (typeof TurndownService === 'undefined') {
    throw new Error('TurndownService not found');
  }
  console.log('Markdown Clipper: Turndown library loaded successfully');

  // Verify Turndown GFM plugin is available
  if (typeof turndownPluginGfm === 'undefined') {
    throw new Error('turndownPluginGfm not found');
  }
  console.log('Markdown Clipper: Turndown GFM plugin loaded successfully');

  // Initialize Turndown service with configuration
  turndownService = new TurndownService({
    headingStyle: 'atx',           // Use # for headings
    hr: '---',                      // Horizontal rule style
    bulletListMarker: '-',          // Use - for bullet lists
    codeBlockStyle: 'fenced',       // Use ``` for code blocks
    fence: '```',                   // Code fence characters
    emDelimiter: '*',               // Use * for emphasis
    strongDelimiter: '**',          // Use ** for strong
    linkStyle: 'inlined',           // Use [text](url) format
    linkReferenceStyle: 'full'      // Reference link style
  });

  // Add GFM (GitHub Flavored Markdown) plugin for tables, strikethrough, and task lists
  const gfm = turndownPluginGfm.gfm;
  turndownService.use(gfm);

  // Custom rule for code blocks to preserve language information
  turndownService.addRule('fencedCodeBlock', {
    filter: function (node, options) {
      return (
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      );
    },
    replacement: function (content, node, options) {
      const className = node.firstChild.getAttribute('class') || '';
      const language = (className.match(/language-(\S+)/) || [null, ''])[1];
      const code = node.firstChild.textContent || '';

      return (
        '\n\n' + options.fence + language + '\n' +
        code.replace(/\n$/, '') + '\n' +
        options.fence + '\n\n'
      );
    }
  });

  // Custom rule for images to convert relative URLs to absolute
  turndownService.addRule('images', {
    filter: 'img',
    replacement: function (content, node) {
      const alt = node.getAttribute('alt') || '';
      const src = node.getAttribute('src') || '';
      const title = node.getAttribute('title') || '';

      // Convert relative URLs to absolute
      let absoluteSrc = src;
      try {
        if (src && !src.startsWith('data:')) {
          absoluteSrc = new URL(src, document.baseURI).href;
        }
      } catch (e) {
        console.warn('Markdown Clipper: Could not convert image URL to absolute:', src);
      }

      const titlePart = title ? ' "' + title + '"' : '';
      return '![' + alt + '](' + absoluteSrc + titlePart + ')';
    }
  });

  // Custom rule for better nested list handling
  turndownService.addRule('listItem', {
    filter: 'li',
    replacement: function (content, node, options) {
      content = content
        .replace(/^\n+/, '') // remove leading newlines
        .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
        .replace(/\n/gm, '\n    '); // indent

      let prefix = options.bulletListMarker + ' ';
      const parent = node.parentNode;

      if (parent.nodeName === 'OL') {
        const start = parent.getAttribute('start');
        const index = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index : index + 1) + '. ';
      }

      return prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '');
    }
  });

  console.log('Markdown Clipper: Turndown service initialized with GFM plugin and custom rules');
} catch (error) {
  console.error('Markdown Clipper: Failed to initialize Turndown service:', error);
  console.error('Markdown Clipper: Extension will not function on this page');
}

// Function to show toast notification
function showToast(message, isSuccess = true) {
  // Create toast element
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;

  // Add to page
  document.body.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2700);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convertToMarkdown') {
    console.log('Markdown Clipper: Received convertToMarkdown message');

    // Check if Turndown service is available
    if (!turndownService) {
      console.error('Markdown Clipper: Turndown service not initialized');
      showToast('✗ Extension not loaded properly', false);
      return;
    }

    // Get current selection
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      console.warn('Markdown Clipper: No selection found');
      showToast('✗ No text selected', false);
      return;
    }

    // Extract HTML from selection
    try {
      // Get the range from the selection
      const range = selection.getRangeAt(0);

      // Clone the selected content to preserve DOM structure
      const clonedContent = range.cloneContents();

      // Create a temporary container to hold the cloned content
      const container = document.createElement('div');
      container.appendChild(clonedContent);

      // Get the HTML from the container
      let html = container.innerHTML;

      // Get the plain text from the selection for comparison
      const selectedPlainText = selection.toString();
      const extractedPlainText = container.textContent || '';

      // Log for testing
      console.log('Markdown Clipper: Extracted HTML:', html.substring(0, 100) + '...');
      console.log('Markdown Clipper: Full HTML length:', html.length);
      console.log('Markdown Clipper: Selected text length:', selectedPlainText.length);
      console.log('Markdown Clipper: Extracted text length:', extractedPlainText.length);

      // Check if significant content was lost (Shadow DOM, custom components, etc.)
      const contentLossRatio = extractedPlainText.length / selectedPlainText.length;
      const significantContentLost = contentLossRatio < 0.7; // More than 30% content missing

      let markdown;
      if (html.trim().length < 10 || significantContentLost) {
        if (significantContentLost) {
          console.log('Markdown Clipper: Significant content lost in HTML extraction (' +
                      Math.round((1 - contentLossRatio) * 100) + '% missing), using plain text fallback');
        } else {
          console.log('Markdown Clipper: HTML extraction failed, using plain text fallback');
        }

        // Check if it looks like code (multiple lines or contains typical code characters)
        const looksLikeCode = selectedPlainText.includes('\n') || /[{}();[\]]/.test(selectedPlainText);

        if (looksLikeCode && selectedPlainText.length > 20) {
          // Wrap in code fence
          markdown = '```\n' + selectedPlainText + '\n```';
          console.log('Markdown Clipper: Wrapped plain text as code block');
        } else {
          // Use as plain text
          markdown = selectedPlainText;
        }
      } else {
        // Convert HTML to Markdown normally
        markdown = turndownService.turndown(html);
      }

      // Log the converted Markdown
      console.log('Markdown Clipper: Converted to Markdown:');
      console.log(markdown);
      console.log('Markdown Clipper: Markdown length:', markdown.length);

      // Copy to clipboard
      navigator.clipboard.writeText(markdown)
        .then(() => {
          console.log('Markdown Clipper: Successfully copied to clipboard');
          showToast('✓ Copied as Markdown!', true);
        })
        .catch((error) => {
          console.error('Markdown Clipper: Failed to copy to clipboard:', error);
          showToast('✗ Failed to copy', false);
        });

    } catch (error) {
      console.error('Markdown Clipper: Error extracting HTML:', error);
      showToast('✗ Error converting selection', false);
    }
  }
});
