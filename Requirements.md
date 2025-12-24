Project Plan: Selection-to-Markdown Browser Extension
Core Functionality
The extension will allow users to select any content on a webpage, right-click, and copy it as Markdown. This requires:

Detecting user text selection
Converting the selected HTML to Markdown
Copying the result to clipboard

Architecture Overview
Components needed:

manifest.json - Extension configuration file
background.js - Handles context menu creation and message passing
content.js - Runs on web pages to capture selection and convert to Markdown
turndown library - JavaScript library for HTML-to-Markdown conversion (we'll bundle this)

Technical Approach
Step 1: Set up the basic extension structure

Create a manifest.json with necessary permissions (contextMenus, activeTab, clipboardWrite)
Define content scripts to run on all pages
Set up background service worker for Chrome Manifest V3

Step 2: Add context menu integration

Register a context menu item that appears on text selection
Handle the menu click event to trigger conversion

Step 3: Implement selection capture

Get the user's selection using window.getSelection()
Extract the HTML range that was selected
Preserve the DOM structure including links, formatting, lists, etc.

Step 4: HTML to Markdown conversion

Use Turndown.js library to convert HTML to Markdown
Configure Turndown rules for proper handling of:

Headers (h1-h6)
Bold/italic text
Links and images
Lists (ordered and unordered)
Code blocks
Tables
Blockquotes



Step 5: Clipboard integration

Use the Clipboard API to write the Markdown to clipboard
Provide visual feedback (optional: a small toast notification)

File Structure
markdown-clipper/
├── manifest.json
├── background.js
├── content.js
├── lib/
│   └── turndown.js
└── icons/ (optional)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
Key Technical Decisions
1. Manifest Version: Use V3 (current standard for Chrome extensions)
2. Selection Handling: Capture the selection's HTML content rather than just plain text to preserve structure
3. Conversion Library: Use Turndown.js because it:

Handles complex HTML structures well
Is customizable with plugins
Works reliably in browser environments

4. Hacky shortcuts we can take:

Skip the popup UI entirely - just use context menu
No settings/options page needed
Bundle Turndown.js directly (no build process)
Minimal error handling for edge cases
No icon required (Chrome will use default)

Implementation Steps

Create the manifest.json file with proper permissions
Download and include Turndown.js library
Create background.js to register context menu
Create content.js with selection and conversion logic
Test with various web page elements (paragraphs, lists, tables, code)
Load as unpacked extension in Chrome for testing

Potential Gotchas to Handle

Some websites may have complex CSS that affects selection
Tables might need special formatting rules
Code blocks should preserve formatting
Nested lists need proper indentation
Images should capture alt text and URLs

Milestones & To-Do Lists
Milestone 1: Project Setup & Core Structure
Goal: Establish the basic extension framework and file structure
To-Do:

 Create project directory structure
 Write manifest.json with:

 Manifest V3 configuration
 Required permissions (contextMenus, activeTab, clipboardWrite, scripting)
 Content script declarations
 Background service worker declaration


 Download Turndown.js library (latest version)
 Create placeholder files (background.js, content.js)
 Verify the extension loads in Chrome without errors
 Test basic "hello world" functionality

Success Criteria: Extension loads as unpacked in Chrome developer mode without errors

Milestone 2: Context Menu Integration
Goal: Create right-click menu that appears on text selection
To-Do:

 Implement background.js service worker
 Register context menu on extension install
 Configure context menu to only show when text is selected
 Set up message passing between background and content scripts
 Handle context menu click event
 Send message to content script when menu is clicked
 Test context menu appears and disappears correctly

Success Criteria: Right-click menu appears only when text is selected and clicking it triggers content script

Milestone 3: Selection Capture & HTML Extraction
Goal: Properly capture user selection with full HTML structure
To-Do:

 Implement selection capture in content.js
 Use window.getSelection() to get current selection
 Extract Range object from selection
 Clone selected content to preserve DOM structure
 Create container element for the cloned content
 Handle edge cases:

 Empty selections
 Selections spanning multiple elements
 Selections with nested structures
 Selections inside shadow DOM (note limitations)


 Preserve attributes needed for conversion (href, src, alt, etc.)
 Test with various selection types (single paragraph, multiple elements, tables, lists)

Success Criteria: Can reliably extract HTML from any normal web page selection

Milestone 4: HTML to Markdown Conversion Setup
Goal: Configure Turndown with proper rules and plugins
To-Do:

 Initialize Turndown instance in content.js
 Configure basic Turndown options:

 Set heading style (ATX: # vs Setext)
 Set bullet list marker style
 Set code block style (fenced vs indented)
 Set fence characters for code blocks
 Configure link style and reference links


 Add Turndown GFM (GitHub Flavored Markdown) plugin for:

 Strikethrough support
 Tables support
 Task lists support


 Test basic conversion with simple HTML
 Verify Markdown output is valid

Success Criteria: Basic HTML elements convert to clean Markdown

Milestone 5: Handle Complex Elements - Tables
Goal: Ensure tables convert properly to Markdown
To-Do:

 Enable GFM tables plugin
 Create custom Turndown rule if needed for complex tables
 Handle edge cases:

 Tables with colspan/rowspan (note: may need simplification)
 Nested tables (flatten or handle gracefully)
 Tables with header rows
 Tables with multiple tbody sections
 Empty cells


 Test with various table structures from real websites
 Ensure proper alignment is preserved where possible

Success Criteria: Standard tables convert to GFM table format correctly

Milestone 6: Handle Complex Elements - Code Blocks
Goal: Preserve code formatting and syntax information
To-Do:

 Configure code block fence style (triple backticks)
 Create custom rule for <pre><code> blocks
 Extract language class from code blocks (e.g., language-javascript)
 Preserve indentation within code blocks
 Handle inline code (<code> without <pre>)
 Test with:

 Inline code snippets
 Multi-line code blocks
 Code blocks with syntax highlighting classes
 Code from various documentation sites (MDN, Stack Overflow)


 Ensure special characters in code are not escaped incorrectly

Success Criteria: Code blocks maintain formatting and language hints

Milestone 7: Handle Complex Elements - Nested Lists
Goal: Properly indent and format nested list structures
To-Do:

 Configure list indentation (2 or 4 spaces)
 Test nested unordered lists (ul > li > ul)
 Test nested ordered lists (ol > li > ol)
 Test mixed nested lists (ul > li > ol and vice versa)
 Verify proper indentation levels maintained
 Handle edge cases:

 Lists with multiple paragraphs per item
 Lists with code blocks inside items
 Lists nested 3+ levels deep


 Test with real-world examples (Wikipedia, documentation sites)

Success Criteria: All nested list types render correctly with proper indentation

Milestone 8: Handle Images Properly
Goal: Capture image URLs and alt text in Markdown format
To-Do:

 Create custom Turndown rule for <img> tags
 Extract and preserve:

 src attribute (convert relative URLs to absolute)
 alt attribute for accessibility
 title attribute if present


 Handle different image URL types:

 Absolute URLs (https://...)
 Relative URLs (convert using document.baseURI)
 Data URIs (base64 encoded images)
 Protocol-relative URLs (//example.com/image.jpg)


 Handle images within links (<a><img></a>)
 Test with:

 Simple images
 Images in different contexts (paragraphs, lists, tables)
 Linked images
 Images with missing alt text


 Consider adding image dimensions in title if needed

Success Criteria: Images convert to ![alt](url "title") format with correct absolute URLs

Milestone 9: Handle CSS-Affected Selections
Goal: Deal with selections on websites with complex styling
To-Do:

 Test on sites with heavy CSS:

 Medium articles
 Notion pages
 Google Docs (if accessible)
 Wikipedia
 GitHub


 Handle pseudo-elements that affect content:

 ::before and ::after (note: these won't be in selection)
 Document workarounds if needed


 Strip unnecessary styling attributes (class, style, etc.)
 Preserve only semantic HTML for conversion
 Handle hidden elements in selection
 Test with elements that have contenteditable

Success Criteria: Selection works reliably across popular websites with various CSS frameworks

Milestone 10: Clipboard Integration
Goal: Copy Markdown to clipboard with user feedback
To-Do:

 Implement clipboard writing using Clipboard API
 Use navigator.clipboard.writeText() for the Markdown
 Handle clipboard API permissions
 Add error handling for clipboard access failures
 Create simple visual feedback:

 Inject temporary toast notification
 Style the notification (position, animation)
 Auto-dismiss after 2-3 seconds
 Show different messages for success/failure


 Ensure clipboard write works in various contexts
 Test clipboard content in Markdown editors

Success Criteria: Markdown is reliably copied to clipboard with visual confirmation

Milestone 11: Error Handling & Edge Cases
Goal: Handle failures gracefully and improve robustness
To-Do:

 Add error handling for:

 Empty selections
 Selection API failures
 Turndown conversion errors
 Clipboard API failures
 Message passing failures


 Create fallback mechanisms:

 Fallback to plain text if HTML conversion fails
 User notification if critical error occurs


 Handle special page types:

 PDFs in browser (limited support)
 Chrome internal pages (chrome://)
 Extension pages


 Add console logging for debugging
 Test error scenarios deliberately

Success Criteria: Extension handles errors without breaking and informs user when appropriate

Milestone 12: Testing & Refinement
Goal: Comprehensive testing and polish
To-Do:

 Create test cases document with various HTML patterns
 Test on diverse websites:

 News sites (NYTimes, BBC)
 Documentation (MDN, React docs)
 Social media (Twitter/X, Reddit)
 Blogs (Medium, personal blogs)
 Technical sites (Stack Overflow, GitHub)


 Test special characters and encoding
 Test with very long selections
 Test with selections containing special Markdown characters
 Verify Markdown output in various Markdown renderers:

 GitHub
 Obsidian
 Typora
 VS Code preview


 Optimize performance if needed
 Clean up code and add comments
 Create README with installation and usage instructions

Success Criteria: Extension works reliably across all tested scenarios and produces valid Markdown

Milestone 13: Final Polish & Documentation
Goal: Prepare for personal use with proper documentation
To-Do:

 Add keyboard shortcut (optional but nice-to-have)
 Create simple README.md with:

 Installation instructions
 Usage guide
 Known limitations
 Troubleshooting tips


 Add comments to code for future reference
 Consider adding basic icons (can use simple emoji or text icons)
 Package extension for easy installation
 Create backup of working version
 Document any customizations or preferences

Success Criteria: Extension is well-documented and ready for daily use