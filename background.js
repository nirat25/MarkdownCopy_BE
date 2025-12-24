// Background service worker for Markdown Clipper extension

console.log('Markdown Clipper: Background service worker loaded');

// Extension installation handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('Markdown Clipper: Extension installed successfully');

  // Create context menu item
  chrome.contextMenus.create({
    id: 'copy-as-markdown',
    title: 'Copy as Markdown',
    contexts: ['selection']
  });

  console.log('Markdown Clipper: Context menu created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-as-markdown') {
    console.log('Markdown Clipper: Context menu clicked');

    // Send message to content script to convert selection to markdown
    chrome.tabs.sendMessage(tab.id, {
      action: 'convertToMarkdown'
    });
  }
});
