# Markdown Clipper

A browser extension that converts selected web content to Markdown format.

## Installation (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this extension directory

## Usage

1. Select any content on a webpage
2. Right-click to open the context menu
3. Click "Copy as Markdown"
4. The selected content will be copied to your clipboard in Markdown format

## Development Status

Currently in development - Milestone 1 completed (basic structure).

## Features (Planned)

- Convert HTML selections to Markdown
- Support for:
  - Headers, paragraphs, lists
  - Links and images
  - Tables (GitHub Flavored Markdown)
  - Code blocks with syntax highlighting
  - Nested structures
- Visual feedback on copy
- Works on all websites

## Technical Stack

- Manifest V3
- Turndown.js for HTML to Markdown conversion
- Turndown GFM plugin for GitHub Flavored Markdown support
