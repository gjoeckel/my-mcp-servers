// Google Picker Integration
// Handles document selection from Google Drive

let pickerApiLoaded = false;
let pickerCallback = null;

/**
 * Initialize Google Picker API
 * @param {Function} callback - Callback function when picker is ready
 */
function initializePicker(callback) {
    pickerCallback = callback;
    
    if (typeof gapi === 'undefined') {
        console.error('Google API not loaded');
        return;
    }
    
    gapi.load('picker', {
        callback: onPickerApiLoad,
        onerror: onPickerApiError
    });
}

/**
 * Callback when Picker API is loaded
 */
function onPickerApiLoad() {
    console.log('Google Picker API loaded');
    pickerApiLoaded = true;
    
    if (pickerCallback) {
        pickerCallback();
    }
}

/**
 * Error handler for Picker API loading
 * @param {Object} error - Error object
 */
function onPickerApiError(error) {
    console.error('Error loading Google Picker API:', error);
    pickerApiLoaded = false;
}

/**
 * Open Google Picker for document selection
 * @param {Object} options - Picker options
 */
function openDocumentPicker(options = {}) {
    if (!pickerApiLoaded) {
        console.error('Picker API not loaded');
        return;
    }
    
    if (typeof gapi === 'undefined' || !gapi.auth2) {
        console.error('Google Auth not initialized');
        return;
    }
    
    const authInstance = gapi.auth2.getAuthInstance();
    const currentUser = authInstance.currentUser.get();
    
    if (!currentUser.isSignedIn()) {
        console.error('User not signed in');
        return;
    }
    
    const accessToken = currentUser.getAuthResponse().access_token;
    
    // Create picker view
    const view = new google.picker.DocsView(google.picker.ViewId.DOCS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false);
    
    // Configure picker
    const picker = new google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(accessToken)
        .setCallback(pickerCallback)
        .setTitle('Select a Google Doc to analyze')
        .setOrigin(google.picker.Origin.GOOGLE_DRIVE)
        .build();
    
    picker.setVisible(true);
}

/**
 * Handle picker selection
 * @param {Object} data - Picker selection data
 */
function onPickerSelection(data) {
    if (data.action === google.picker.Action.PICKED) {
        const file = data.docs[0];
        console.log('Document selected:', file);
        
        // Notify the application about the selection
        if (typeof window !== 'undefined' && window.onDocumentSelected) {
            window.onDocumentSelected(file);
        }
        
        // Update UI with selected document info
        updateDocumentInfo(file);
    } else if (data.action === google.picker.Action.CANCEL) {
        console.log('Document selection cancelled');
    }
}

/**
 * Update UI with selected document information
 * @param {Object} file - Selected file object
 */
function updateDocumentInfo(file) {
    const documentInfo = document.getElementById('document-info');
    const documentName = document.getElementById('document-name');
    const documentUrl = document.getElementById('document-url');
    
    if (documentInfo && documentName && documentUrl) {
        documentInfo.style.display = 'block';
        documentName.textContent = file.name;
        documentUrl.textContent = file.url || 'URL not available';
    }
    
    // Store current document for API calls
    window.currentDocument = file;
}

/**
 * Get document content using Google Docs API
 * @param {string} documentId - Google Docs document ID
 * @returns {Promise} Promise that resolves with document content
 */
function getDocumentContent(documentId) {
    return new Promise((resolve, reject) => {
        if (typeof gapi === 'undefined' || !gapi.client) {
            reject(new Error('Google API client not loaded'));
            return;
        }
        
        gapi.client.docs.documents.get({
            documentId: documentId
        }).then(response => {
            console.log('Document content retrieved:', response);
            resolve(response.result);
        }).catch(error => {
            console.error('Error retrieving document content:', error);
            reject(error);
        });
    });
}

/**
 * Extract text formatting from document
 * @param {Object} document - Google Docs document object
 * @returns {Array} Array of text elements with formatting
 */
function extractTextFormatting(document) {
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
                style: style,
                startIndex: element.startIndex,
                endIndex: element.endIndex
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
 * Find text elements with specific colors
 * @param {Array} textElements - Array of text elements
 * @param {string} foregroundColor - Foreground color to search for
 * @param {string} backgroundColor - Background color to search for
 * @returns {Array} Matching text elements
 */
function findTextWithColors(textElements, foregroundColor, backgroundColor) {
    return textElements.filter(element => {
        const style = element.style;
        const fgMatch = !foregroundColor || style.foregroundColor?.color?.rgbColor;
        const bgMatch = !backgroundColor || style.backgroundColor?.color?.rgbColor;
        
        return fgMatch && bgMatch;
    });
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

// Set up global picker callback
if (typeof window !== 'undefined') {
    window.onDocumentSelected = function(file) {
        console.log('Document selected globally:', file);
        updateDocumentInfo(file);
    };
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.pickerModule = {
        initializePicker,
        openDocumentPicker,
        onPickerSelection,
        getDocumentContent,
        extractTextFormatting,
        findTextWithColors,
        googleColorToHex
    };
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePicker,
        openDocumentPicker,
        onPickerSelection,
        getDocumentContent,
        extractTextFormatting,
        findTextWithColors,
        googleColorToHex
    };
}