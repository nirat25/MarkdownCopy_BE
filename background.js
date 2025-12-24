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

// Helper function to send message to content script with proper error handling
async function sendConvertMessage(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'convertToMarkdown' });
  } catch (error) {
    // Silently ignore errors from pages where content script can't run
    // This is expected behavior for chrome:// pages, PDFs, etc.
    console.debug('Markdown Clipper: Content script not available on this page');
  }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-as-markdown') {
    console.log('Markdown Clipper: Context menu clicked');
    sendConvertMessage(tab.id);
  }
});

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'copy-as-markdown') {
    console.log('Markdown Clipper: Keyboard shortcut triggered');

    // Get the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      sendConvertMessage(tabs[0].id);
    }
  }
});
