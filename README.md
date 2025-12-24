# Markdown Clipper

A browser extension that converts selected web content to Markdown format.

## Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this extension directory

## Usage

### Method 1: Context Menu
1. Select any content on a webpage
2. Right-click to open the context menu
3. Click "Copy as Markdown"
4. The selected content will be copied to your clipboard in Markdown format

### Method 2: Keyboard Shortcut
1. Select any content on a webpage
2. Press `Ctrl+Shift+M` (Windows/Linux) or `Cmd+Shift+M` (Mac)
3. The selected content will be copied to your clipboard in Markdown format

A green toast notification will appear confirming the copy was successful.

## Features

- ✅ Convert HTML selections to Markdown
- ✅ Support for:
  - Headers, paragraphs, lists
  - Links and images
  - Tables (GitHub Flavored Markdown)
  - Code blocks
  - Bold, italic, strikethrough
  - Nested structures
- ✅ Visual feedback on copy (toast notification)
- ✅ Keyboard shortcut (`Ctrl+Shift+M` / `Cmd+Shift+M`)
- ✅ Works on all websites (including CSP-restricted sites)

## Known Limitations

- **Complex Modern Websites**: Sites with heavy use of Shadow DOM or custom web components (like MDN, some React-based sites) may have issues with content selection. The browser's Selection API itself may return unexpected content when selecting across component boundaries. For best results on these sites:
  - Select smaller chunks of content
  - Use built-in copy buttons if available
  - Avoid selecting across different component sections

- **Special Chrome Pages**: The extension cannot run on Chrome internal pages (`chrome://`, `chrome-extension://`, etc.) or PDF files.

## Technical Stack

- Manifest V3
- Turndown.js for HTML to Markdown conversion
- Turndown GFM plugin for GitHub Flavored Markdown support
