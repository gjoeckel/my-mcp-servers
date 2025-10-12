// Google Docs API Integration
// Handles document reading and color extraction

let docsApiLoaded = false;
let authInstance = null;

/**
 * Initialize Google Docs API
 * @param {Object} config - Configuration object
 */
function initializeDocsAPI(config) {
    if (typeof gapi === 'undefined') {
        console.error('Google API not loaded');
        return Promise.reject('Google API not loaded');
    }
    
    return new Promise((resolve, reject) => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: config.apiKey || 'YOUR_API_KEY',
                clientId: config.clientId,
                discoveryDocs: config.discoveryDocs || [
                    'https://docs.googleapis.com/$discovery/rest?version=v1'
                ],
                scope: config.scopes || [
                    'https://www.googleapis.com/auth/documents.readonly',
                    'https://www.googleapis.com/auth/drive.readonly'
                ]
            }).then(() => {
                docsApiLoaded = true;
                authInstance = gapi.auth2.getAuthInstance();
                console.log('Google Docs API initialized');
                resolve();
            }).catch(error => {
                console.error('Error initializing Google Docs API:', error);
                reject(error);
            });
        });
    });
}

/**
 * Sign in user
 * @returns {Promise} Promise that resolves when user is signed in
 */
function signIn() {
    if (!authInstance) {
        return Promise.reject('Auth instance not initialized');
    }
    
    return authInstance.signIn().then(user => {
        console.log('User signed in:', user.getBasicProfile().getName());
        return user;
    }).catch(error => {
        console.error('Sign in error:', error);
        throw error;
    });
}

/**
 * Sign out user
 */
function signOut() {
    if (authInstance) {
        authInstance.signOut();
        console.log('User signed out');
    }
}

/**
 * Check if user is signed in
 * @returns {boolean} True if user is signed in
 */
function isSignedIn() {
    return authInstance && authInstance.isSignedIn.get();
}

/**
 * Get current user
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    if (!authInstance) return null;
    return authInstance.currentUser.get();
}

/**
 * Get document by ID
 * @param {string} documentId - Google Docs document ID
 * @returns {Promise} Promise that resolves with document data
 */
function getDocument(documentId) {
    if (!docsApiLoaded) {
        return Promise.reject('Docs API not loaded');
    }
    
    return gapi.client.docs.documents.get({
        documentId: documentId
    }).then(response => {
        console.log('Document retrieved:', response.result);
        return response.result;
    }).catch(error => {
        console.error('Error retrieving document:', error);
        throw error;
    });
}

/**
 * Extract colors from document
 * @param {Object} document - Google Docs document object
 * @returns {Array} Array of color combinations found
 */
function extractColorsFromDocument(document) {
    const colorCombinations = [];
    const textElements = extractTextElements(document);
    
    textElements.forEach(element => {
        const foregroundColor = element.foregroundColor;
        const backgroundColor = element.backgroundColor;
        
        if (foregroundColor || backgroundColor) {
            colorCombinations.push({
                text: element.text,
                foregroundColor: foregroundColor,
                backgroundColor: backgroundColor,
                startIndex: element.startIndex,
                endIndex: element.endIndex
            });
        }
    });
    
    return colorCombinations;
}

/**
 * Extract text elements from document
 * @param {Object} document - Google Docs document object
 * @returns {Array} Array of text elements
 */
function extractTextElements(document) {
    const textElements = [];
    
    if (!document.body || !document.body.content) {
        return textElements;
    }
    
    function processElement(element, parentStyle = {}) {
        if (element.textRun) {
            const textRun = element.textRun;
            const style = { ...parentStyle, ...textRun.textStyle };
            
            textElements.push({
                text: textRun.content,
                foregroundColor: style.foregroundColor ? googleColorToHex(style.foregroundColor) : null,
                backgroundColor: style.backgroundColor ? googleColorToHex(style.backgroundColor) : null,
                startIndex: element.startIndex,
                endIndex: element.endIndex,
                style: style
            });
        }
        
        if (element.paragraph) {
            const paragraph = element.paragraph;
            const paragraphStyle = { ...parentStyle, ...paragraph.paragraphStyle };
            
            if (paragraph.elements) {
                paragraph.elements.forEach(childElement => {
                    processElement(childElement, paragraphStyle);
                });
            }
        }
        
        if (element.table) {
            const table = element.table;
            if (table.tableRows) {
                table.tableRows.forEach(row => {
                    if (row.tableCells) {
                        row.tableCells.forEach(cell => {
                            if (cell.content) {
                                cell.content.forEach(cellElement => {
                                    processElement(cellElement, parentStyle);
                                });
                            }
                        });
                    }
                });
            }
        }
    }
    
    document.body.content.forEach(element => {
        processElement(element);
    });
    
    return textElements;
}

/**
 * Convert Google Docs color to hex
 * @param {Object} color - Google Docs color object
 * @returns {string} Hex color string
 */
function googleColorToHex(color) {
    if (!color || !color.rgbColor) {
        return null;
    }
    
    const rgb = color.rgbColor;
    const r = Math.round((rgb.red || 0) * 255);
    const g = Math.round((rgb.green || 0) * 255);
    const b = Math.round((rgb.blue || 0) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get selected text colors (simulated for web version)
 * @returns {Promise} Promise that resolves with color data
 */
function getSelectedTextColors() {
    return new Promise((resolve, reject) => {
        // In a real implementation, this would get the selected text
        // For now, we'll return a placeholder
        console.log('Getting selected text colors...');
        
        // Simulate API call
        setTimeout(() => {
            resolve({
                foreground: '#000000',
                background: '#ffffff',
                text: 'Sample selected text'
            });
        }, 1000);
    });
}

/**
 * Analyze document for accessibility issues
 * @param {string} documentId - Google Docs document ID
 * @returns {Promise} Promise that resolves with analysis results
 */
function analyzeDocumentAccessibility(documentId) {
    return getDocument(documentId).then(document => {
        const colorCombinations = extractColorsFromDocument(document);
        const analysis = {
            documentId: documentId,
            title: document.title,
            colorCombinations: colorCombinations,
            issues: [],
            recommendations: []
        };
        
        // Analyze each color combination
        colorCombinations.forEach(combination => {
            if (combination.foregroundColor && combination.backgroundColor) {
                const ratio = calculateContrast(combination.foregroundColor, combination.backgroundColor);
                const compliance = checkWCAGCompliance(ratio);
                
                if (!compliance.aa.passes) {
                    analysis.issues.push({
                        type: 'low_contrast',
                        text: combination.text,
                        foreground: combination.foregroundColor,
                        background: combination.backgroundColor,
                        ratio: ratio,
                        severity: 'high'
                    });
                }
            }
        });
        
        return analysis;
    });
}

/**
 * Export analysis results to Google Sheets
 * @param {Object} analysis - Analysis results
 * @returns {Promise} Promise that resolves when export is complete
 */
function exportToSheets(analysis) {
    // This would integrate with Google Sheets API
    console.log('Exporting to Google Sheets:', analysis);
    return Promise.resolve('Export functionality not yet implemented');
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.docsApiModule = {
        initializeDocsAPI,
        signIn,
        signOut,
        isSignedIn,
        getCurrentUser,
        getDocument,
        extractColorsFromDocument,
        getSelectedTextColors,
        analyzeDocumentAccessibility,
        exportToSheets
    };
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDocsAPI,
        signIn,
        signOut,
        isSignedIn,
        getCurrentUser,
        getDocument,
        extractColorsFromDocument,
        getSelectedTextColors,
        analyzeDocumentAccessibility,
        exportToSheets
    };
}