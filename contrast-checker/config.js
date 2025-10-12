// Google Cloud Configuration
const CONFIG = {
    // Google Cloud Project ID
    projectId: '423822051374',
    
    // OAuth2 Client Configuration
    oauth2: {
        clientId: '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com',
        // Note: Client secret should not be exposed in frontend code
        // It should be handled server-side or through secure authentication flow
    },
    
    // API Configuration
    apis: {
        docs: {
            version: 'v1',
            discoveryDocs: ['https://docs.googleapis.com/$discovery/rest?version=v1']
        },
        drive: {
            version: 'v3',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        },
        picker: {
            version: 'v3',
            apiKey: 'YOUR_PICKER_API_KEY' // This needs to be set in GCP Console
        }
    },
    
    // OAuth Scopes
    scopes: [
        'https://www.googleapis.com/auth/documents.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ],
    
    // Application URLs
    urls: {
        dashboard: 'https://gjoeckel.github.io/my-mcp-servers/contrast-checker/',
        tool: 'https://gjoeckel.github.io/my-mcp-servers/contrast-checker/app.html',
        github: 'https://github.com/gjoeckel/my-mcp-servers',
        issues: 'https://github.com/gjoeckel/my-mcp-servers/issues'
    },
    
    // WCAG Standards
    wcag: {
        aa: {
            normal: 4.5,
            large: 3.0
        },
        aaa: {
            normal: 7.0,
            large: 4.5
        }
    },
    
    // Feature Flags
    features: {
        googleDocsIntegration: true,
        documentPicker: true,
        googleSheetsExport: true,
        advancedMode: true,
        mobileOptimized: true
    },
    
    // Debug Settings
    debug: {
        enabled: true,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        showConsole: true
    }
};

// Utility function to get configuration value
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
}

// Utility function to check if feature is enabled
function isFeatureEnabled(feature) {
    return getConfig(`features.${feature}`) === true;
}

// Utility function to log debug messages
function debugLog(message, level = 'info') {
    if (CONFIG.debug.enabled && CONFIG.debug.showConsole) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
}

// Export configuration for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}