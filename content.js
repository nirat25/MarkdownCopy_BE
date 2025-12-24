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

      // TODO: Convert HTML to Markdown (will implement in next milestone)
      // TODO: Copy to clipboard (will implement in later milestones)

    } catch (error) {
      console.error('Markdown Clipper: Error extracting HTML:', error);
    }
  }
});
