# Color Contrast Checker - Google Apps Script

A Google Apps Script project that provides a sidebar tool for checking color contrast ratios in Google Docs, ensuring WCAG accessibility compliance.

## Features

- **Color Selection**: Pick foreground and background colors using color pickers or hex input
- **Auto-Detection**: Automatically extract colors from selected text in the document
- **WCAG Compliance**: Check against WCAG AA and AAA standards for both normal and large text
- **Real-time Calculation**: Instant contrast ratio calculation and visual feedback
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Project Structure

```
src/
├── Code.gs           # Main Apps Script functions
├── Sidebar.html      # HTML interface for the sidebar
└── appsscript.json   # Project configuration
```

## Setup

1. **Install clasp globally:**
   ```bash
   npm install -g @google/clasp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Login to Google (if needed):**
   ```bash
   npm run login
   ```

## Available Scripts

- `npm run clone` - Clone the Apps Script project
- `npm run push` - Push changes to Apps Script
- `npm run pull` - Pull changes from Apps Script
- `npm run deploy` - Deploy the script
- `npm run open` - Open in Apps Script editor

## Usage

1. **Open Google Docs**
2. **Go to Extensions → Apps Script**
3. **Run the `showSidebar()` function** or deploy as a web app
4. **Use the sidebar to:**
   - Select colors manually with color pickers
   - Click "Get Selected Text Colors" to extract colors from selected text
   - View real-time contrast ratio and WCAG compliance results

## Functions

### `showSidebar()`
Displays the Color Contrast Checker sidebar in the Google Docs UI.

### `getSelectedColors()`
Extracts the foreground and background colors from the currently selected text in the document.

**Returns:** Object with `foreground` and `background` color values in hex format.

## WCAG Standards

The tool checks against:
- **WCAG AA**: 4.5:1 for normal text, 3:1 for large text
- **WCAG AAA**: 7:1 for normal text, 4.5:1 for large text

## Apps Script ID

Your Apps Script ID: `13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh`

Direct link: https://script.google.com/d/13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh/edit

## Authentication

The project includes authentication tokens for automated deployment. Make sure to keep these secure and don't commit sensitive credentials to public repositories.

## GitHub Actions

This project includes GitHub Actions for automatic deployment:
- Pushes changes to Apps Script when code is updated
- Deploys the script automatically
- Requires `CLASP_TOKEN` secret in GitHub repository settings

## Development

1. Make changes to files in the `src/` directory
2. Push to GitHub - Actions will handle deployment
3. Or manually push with `npm run push`

## License

MIT License - See individual package licenses for details.