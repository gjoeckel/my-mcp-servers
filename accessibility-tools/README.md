# Accessibility Tools Suite

A comprehensive suite of desktop-focused accessibility tools for Google Workspace documents, with a mobile-friendly development interface for remote collaboration.

## Architecture

### Development Interface (Mobile)
- **URL**: `https://gjoeckel.github.io/my-mcp-servers/accessibility-tools/dev-ui.html`
- **Purpose**: Mobile control panel for development management
- **Target**: iPhone Safari browser

### Desktop Tools (End Users)
- **URL**: `https://gjoeckel.github.io/my-mcp-servers/accessibility-tools/`
- **Purpose**: Full-featured accessibility analysis tools
- **Target**: Desktop browsers (Chrome, Firefox, Safari, Edge)

## Communication System

The system uses JSON files for communication between the mobile dev interface and the Cursor agent:

- `data/instructions.json` - Commands from mobile interface to agent
- `data/results.json` - Results from agent back to mobile interface
- `data/status.json` - Agent status and heartbeat
- `data/test-documents.json` - Selected test documents

## Available Tools

### 1. Contrast Checker
- **Desktop URL**: `/tools/contrast/`
- **Features**: WCAG AA/AAA compliance checking, gradient support, batch processing
- **APIs**: Google Docs API, Google Slides API

### 2. Heading Analyzer (Planned)
- **Features**: Heading structure validation, outline generation
- **APIs**: Google Docs API

### 3. Alt Text Validator (Planned)
- **Features**: Image alt text analysis, missing alt text detection
- **APIs**: Google Docs API, Google Slides API

## Development Workflow

1. **Mobile Interface**: Select test documents and run tools
2. **Agent Processing**: Cursor agent monitors instructions and executes tools
3. **Results Display**: Mobile interface displays results and allows feedback
4. **Continuous Development**: Iterative testing and improvement cycle

## Setup

1. Open mobile dev interface in Safari
2. Authenticate with Google
3. Select test documents
4. Run accessibility tools
5. Review results and provide feedback

## File Structure

```
accessibility-tools/
├── dev-ui.html              # Mobile development interface
├── index.html               # Desktop tool launcher
├── tools/                   # Desktop accessibility tools
│   ├── contrast/           # Contrast checker tool
│   ├── headings/           # Heading analyzer (planned)
│   └── alt-text/           # Alt text validator (planned)
├── shared/                  # Shared resources
│   ├── google-auth.js      # Google authentication
│   ├── google-picker.js    # Document picker
│   ├── docs-api.js         # Google Docs API
│   ├── slides-api.js       # Google Slides API
│   └── common.css          # Shared styles
└── data/                   # Communication files
    ├── instructions.json   # Mobile → Agent commands
    ├── results.json        # Agent → Mobile results
    ├── status.json         # Agent status
    └── test-documents.json # Selected documents
```