// Background service worker for Markdown Clipper extension

console.log('Markdown Clipper: Background service worker loaded');

// Extension installation handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('Markdown Clipper: Extension installed successfully');
});
