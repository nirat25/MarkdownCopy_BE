// Content script for Markdown Clipper extension

console.log('Markdown Clipper: Content script loaded');

// Verify Turndown is available
if (typeof TurndownService !== 'undefined') {
  console.log('Markdown Clipper: Turndown library loaded successfully');
} else {
  console.error('Markdown Clipper: Turndown library not found');
}

// Verify Turndown GFM plugin is available
if (typeof turndownPluginGfm !== 'undefined') {
  console.log('Markdown Clipper: Turndown GFM plugin loaded successfully');
} else {
  console.error('Markdown Clipper: Turndown GFM plugin not found');
}

// Initialize Turndown service with configuration
const turndownService = new TurndownService({
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

console.log('Markdown Clipper: Turndown service initialized with GFM plugin');

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

    // Get current selection
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      console.warn('Markdown Clipper: No selection found');
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
      const html = container.innerHTML;

      // Log for testing
      console.log('Markdown Clipper: Extracted HTML:', html.substring(0, 100) + '...');
      console.log('Markdown Clipper: Full HTML length:', html.length);

      // Convert HTML to Markdown
      const markdown = turndownService.turndown(html);

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
