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
