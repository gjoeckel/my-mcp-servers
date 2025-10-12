# Color Contrast Checker - Accessibility Tools

A comprehensive accessibility testing suite with both Google Apps Script integration and standalone web application for checking color contrast ratios, ensuring WCAG accessibility compliance.

## 🌐 Live Demo

- **Web Dashboard**: [https://gjoeckel.github.io/my-mcp-servers/contrast-checker/](https://gjoeckel.github.io/my-mcp-servers/contrast-checker/)
- **Contrast Tool**: [https://gjoeckel.github.io/my-mcp-servers/contrast-checker/app.html](https://gjoeckel.github.io/my-mcp-servers/contrast-checker/app.html)

## Features

### Web Application
- **Mobile-Optimized**: Responsive design for iPhone and mobile devices
- **Google Integration**: Sign in with Google to access Google Docs
- **Document Picker**: Select and analyze documents from Google Drive
- **Real-time Analysis**: Instant contrast ratio calculation and WCAG compliance checking
- **Advanced Mode**: Additional features for power users

### Google Apps Script (Sidebar)
- **Color Selection**: Pick foreground and background colors using color pickers or hex input
- **Auto-Detection**: Automatically extract colors from selected text in the document
- **WCAG Compliance**: Check against WCAG AA and AAA standards for both normal and large text
- **Real-time Calculation**: Instant contrast ratio calculation and visual feedback
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Project Structure

```
├── src/                          # Google Apps Script files
│   ├── Code.gs                   # Main Apps Script functions
│   ├── Sidebar.html              # HTML interface for the sidebar
│   └── appsscript.json           # Project configuration
├── contrast-checker/             # Web application
│   ├── index.html                # Dashboard and status page
│   ├── app.html                  # Main contrast checking tool
│   ├── config.js                 # Google Cloud configuration
│   ├── contrast-engine.js        # WCAG contrast calculation engine
│   ├── picker.js                 # Google Picker integration
│   ├── docs-api.js               # Google Docs API integration
│   └── styles.css                # Mobile-optimized styles
└── README.md                     # This file
```

## Quick Start

### Web Application (Recommended)
1. **Visit the live demo**: [https://gjoeckel.github.io/my-mcp-servers/contrast-checker/](https://gjoeckel.github.io/my-mcp-servers/contrast-checker/)
2. **Sign in with Google** (optional) to access Google Docs integration
3. **Start checking contrast** by selecting colors or picking documents

### Google Apps Script Setup
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

### Web Application
1. **Open the dashboard** in your browser
2. **Sign in with Google** for full functionality
3. **Select a document** from Google Drive or use manual color input
4. **View real-time results** with WCAG compliance checking

### Google Apps Script (Sidebar)
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

## Google Cloud Configuration

This project uses Google Cloud Project ID: `423822051374`

### Enabled APIs
- Google Docs API
- Google Drive API
- Google Picker API
- Google Sheets API
- Google Forms API
- Identity and Access Management

### OAuth2 Configuration
- Client ID: `1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com`
- Scopes: Documents read-only, Drive read-only, User profile
- Redirect URIs: GitHub Pages URLs configured

## GitHub Actions

This project includes GitHub Actions for automatic deployment:
- Pushes changes to Apps Script when code is updated
- Deploys the script automatically
- Requires `CLASP_TOKEN` secret in GitHub repository settings

## Development

### Web Application
1. Make changes to files in the `contrast-checker/` directory
2. Push to GitHub - GitHub Pages will automatically deploy
3. Test the live URLs for functionality

### Google Apps Script
1. Make changes to files in the `src/` directory
2. Push to GitHub - Actions will handle deployment
3. Or manually push with `npm run push`

## Mobile Optimization

The web application is specifically optimized for mobile devices:
- Touch-friendly buttons (44px minimum)
- Responsive design for all screen sizes
- iPhone Safari compatibility
- Dark mode support
- Offline functionality for basic contrast checking

## License

MIT License - See individual package licenses for details.