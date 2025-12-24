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

    const selectedText = selection.toString();
    console.log('Markdown Clipper: Selected text:', selectedText.substring(0, 50) + '...');

    // TODO: Convert selection to Markdown (will implement in next milestones)
    // TODO: Copy to clipboard (will implement in next milestones)
  }
});
