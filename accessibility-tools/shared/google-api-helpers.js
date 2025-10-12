/**
 * Google API Helpers
 * Shared utilities for interacting with Google Workspace APIs
 */

class GoogleAPIHelpers {
    constructor() {
        this.apiKey = null;
        this.clientId = null;
        this.discoveryDocs = [
            'https://docs.googleapis.com/$discovery/rest?version=v1',
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
            'https://slides.googleapis.com/$discovery/rest?version=v1'
        ];
        this.scopes = [
            'https://www.googleapis.com/auth/documents.readonly',
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/presentations.readonly'
        ];
        this.gapiLoaded = false;
        this.gisLoaded = false;
    }

    /**
     * Initialize Google API
     * @param {string} apiKey - Google API key
     * @param {string} clientId - Google OAuth client ID
     */
    async initialize(apiKey, clientId) {
        this.apiKey = apiKey;
        this.clientId = clientId;

        try {
            await this.loadGAPI();
            await this.loadGIS();
            await this.initializeGAPI();
            return true;
        } catch (error) {
            console.error('Failed to initialize Google API:', error);
            return false;
        }
    }

    /**
     * Load Google API script
     */
    loadGAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                this.gapiLoaded = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.gapiLoaded = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Load Google Identity Services
     */
    loadGIS() {
        return new Promise((resolve, reject) => {
            if (window.google?.accounts?.id) {
                this.gisLoaded = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => {
                this.gisLoaded = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize GAPI with discovery docs
     */
    async initializeGAPI() {
        return new Promise((resolve, reject) => {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: this.apiKey,
                        discoveryDocs: this.discoveryDocs
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Authenticate user with Google
     * @returns {Promise<boolean>} Authentication success
     */
    async authenticate() {
        return new Promise((resolve) => {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: this.scopes.join(' '),
                callback: (response) => {
                    if (response.access_token) {
                        gapi.client.setApiKey(this.apiKey);
                        gapi.client.setToken(response);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });

            tokenClient.requestAccessToken();
        });
    }

    /**
     * Extract document ID from Google Docs URL
     * @param {string} url - Google Docs URL
     * @returns {string|null} Document ID
     */
    extractDocumentId(url) {
        const patterns = [
            /\/document\/d\/([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/,
            /^([a-zA-Z0-9-_]+)$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Get Google Docs document content
     * @param {string} documentId - Document ID
     * @returns {Promise<Object>} Document content
     */
    async getDocumentContent(documentId) {
        try {
            const response = await gapi.client.docs.documents.get({
                documentId: documentId
            });

            return this.parseDocumentContent(response.result);
        } catch (error) {
            console.error('Error fetching document:', error);
            throw new Error('Failed to fetch document content');
        }
    }

    /**
     * Parse Google Docs content for accessibility testing
     * @param {Object} document - Google Docs document object
     * @returns {Object} Parsed content
     */
    parseDocumentContent(document) {
        const content = {
            title: document.title,
            elements: [],
            textContent: '',
            images: [],
            links: [],
            headings: []
        };

        const processElement = (element, level = 0) => {
            if (!element) return;

            // Text elements
            if (element.textRun) {
                const textRun = element.textRun;
                const text = textRun.content;
                
                if (text.trim()) {
                    content.elements.push({
                        type: 'text',
                        content: text,
                        style: textRun.textStyle || {},
                        level: level
                    });
                    content.textContent += text;
                }
            }

            // Paragraph elements
            if (element.paragraph) {
                const paragraph = element.paragraph;
                const paragraphStyle = paragraph.paragraphStyle || {};
                
                // Check if it's a heading
                const namedStyleType = paragraphStyle.namedStyleType;
                if (namedStyleType && namedStyleType.startsWith('HEADING_')) {
                    const headingLevel = parseInt(namedStyleType.replace('HEADING_', ''));
                    content.headings.push({
                        level: headingLevel,
                        text: this.extractTextFromElements(paragraph.elements),
                        style: paragraphStyle
                    });
                }

                // Process paragraph elements
                if (paragraph.elements) {
                    paragraph.elements.forEach(el => processElement(el, level + 1));
                }
            }

            // Table elements
            if (element.table) {
                const table = element.table;
                content.elements.push({
                    type: 'table',
                    rows: table.tableRows?.length || 0,
                    level: level
                });

                if (table.tableRows) {
                    table.tableRows.forEach(row => {
                        if (row.tableCells) {
                            row.tableCells.forEach(cell => {
                                if (cell.content) {
                                    cell.content.forEach(el => processElement(el, level + 1));
                                }
                            });
                        }
                    });
                }
            }

            // Image elements
            if (element.inlineObjectElement) {
                const inlineObject = element.inlineObjectElement;
                content.images.push({
                    type: 'inline',
                    objectId: inlineObject.inlineObjectId,
                    level: level
                });
            }

            // Link elements
            if (element.textRun?.textStyle?.link) {
                const link = element.textRun.textStyle.link;
                content.links.push({
                    url: link.url,
                    text: element.textRun.content.trim(),
                    level: level
                });
            }
        };

        // Process document body
        if (document.body && document.body.content) {
            document.body.content.forEach(element => processElement(element));
        }

        return content;
    }

    /**
     * Extract text content from paragraph elements
     * @param {Array} elements - Paragraph elements
     * @returns {string} Combined text content
     */
    extractTextFromElements(elements) {
        if (!elements) return '';
        
        return elements
            .map(el => el.textRun?.content || '')
            .join('')
            .trim();
    }

    /**
     * Get Google Sheets content
     * @param {string} spreadsheetId - Spreadsheet ID
     * @param {string} range - Range to read (optional)
     * @returns {Promise<Object>} Spreadsheet content
     */
    async getSpreadsheetContent(spreadsheetId, range = 'A1:Z1000') {
        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: range
            });

            return {
                values: response.result.values || [],
                range: response.result.range,
                majorDimension: response.result.majorDimension
            };
        } catch (error) {
            console.error('Error fetching spreadsheet:', error);
            throw new Error('Failed to fetch spreadsheet content');
        }
    }

    /**
     * Get Google Slides content
     * @param {string} presentationId - Presentation ID
     * @returns {Promise<Object>} Presentation content
     */
    async getPresentationContent(presentationId) {
        try {
            const response = await gapi.client.slides.presentations.get({
                presentationId: presentationId
            });

            return this.parsePresentationContent(response.result);
        } catch (error) {
            console.error('Error fetching presentation:', error);
            throw new Error('Failed to fetch presentation content');
        }
    }

    /**
     * Parse Google Slides content
     * @param {Object} presentation - Presentation object
     * @returns {Object} Parsed content
     */
    parsePresentationContent(presentation) {
        const content = {
            title: presentation.title,
            slides: [],
            images: [],
            textContent: ''
        };

        if (presentation.slides) {
            presentation.slides.forEach((slide, index) => {
                const slideContent = {
                    slideNumber: index + 1,
                    elements: [],
                    text: '',
                    images: []
                };

                if (slide.pageElements) {
                    slide.pageElements.forEach(element => {
                        // Text elements
                        if (element.shape && element.shape.text) {
                            const textElement = element.shape.text;
                            const text = this.extractTextFromTextElement(textElement);
                            
                            slideContent.elements.push({
                                type: 'text',
                                content: text,
                                style: element.shape.shapeProperties || {}
                            });
                            slideContent.text += text + ' ';
                        }

                        // Image elements
                        if (element.image) {
                            slideContent.images.push({
                                url: element.image.contentUrl,
                                properties: element.image.properties || {}
                            });
                        }
                    });
                }

                content.slides.push(slideContent);
                content.textContent += slideContent.text;
            });
        }

        return content;
    }

    /**
     * Extract text from Google Slides text element
     * @param {Object} textElement - Text element
     * @returns {string} Extracted text
     */
    extractTextFromTextElement(textElement) {
        if (!textElement.textElements) return '';
        
        return textElement.textElements
            .map(el => el.textRun?.content || '')
            .join('')
            .trim();
    }

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return gapi.client.getToken() !== null;
    }

    /**
     * Sign out user
     */
    signOut() {
        const token = gapi.client.getToken();
        if (token) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken(null);
        }
    }

    /**
     * Get current user info
     * @returns {Promise<Object>} User information
     */
    async getUserInfo() {
        try {
            const response = await gapi.client.request({
                path: 'https://www.googleapis.com/oauth2/v2/userinfo'
            });
            return response.result;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAPIHelpers;
} else {
    window.GoogleAPIHelpers = GoogleAPIHelpers;
}