/**
 * Google Docs API Helper
 * Handles interactions with Google Docs API
 */

class GoogleDocsAPI {
    constructor(authInstance) {
        this.authInstance = authInstance;
        this.baseUrl = 'https://docs.googleapis.com/v1/documents';
    }

    async getDocument(documentId) {
        const token = this.authInstance.getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        try {
            const response = await fetch(`${this.baseUrl}/${documentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching document:', error);
            throw error;
        }
    }

    async getDocumentContent(documentId) {
        const document = await this.getDocument(documentId);
        return this.extractTextContent(document);
    }

    extractTextContent(document) {
        const content = [];
        
        if (document.body && document.body.content) {
            document.body.content.forEach(element => {
                if (element.paragraph) {
                    const paragraph = this.extractParagraphContent(element.paragraph);
                    if (paragraph.text.trim()) {
                        content.push(paragraph);
                    }
                } else if (element.table) {
                    const table = this.extractTableContent(element.table);
                    content.push(table);
                }
            });
        }

        return content;
    }

    extractParagraphContent(paragraph) {
        const text = paragraph.elements ? 
            paragraph.elements.map(el => el.textRun ? el.textRun.content : '').join('') : '';
        
        const styles = paragraph.paragraphStyle || {};
        const headingId = paragraph.headingId;
        
        return {
            type: 'paragraph',
            text: text,
            headingLevel: this.getHeadingLevel(headingId),
            styles: {
                alignment: styles.alignment,
                lineSpacing: styles.lineSpacing,
                spaceAbove: styles.spaceAbove,
                spaceBelow: styles.spaceBelow
            },
            elements: paragraph.elements ? paragraph.elements.map(el => this.extractTextRun(el)) : []
        };
    }

    extractTextRun(textRun) {
        if (!textRun) return null;

        const text = textRun.content || '';
        const style = textRun.textStyle || {};
        
        return {
            text: text,
            styles: {
                bold: style.bold || false,
                italic: style.italic || false,
                underline: style.underline || false,
                strikethrough: style.strikethrough || false,
                fontSize: style.fontSize ? this.convertFontSize(style.fontSize) : null,
                fontFamily: style.fontFamily || null,
                foregroundColor: style.foregroundColor ? this.convertColor(style.foregroundColor) : null,
                backgroundColor: style.backgroundColor ? this.convertColor(style.backgroundColor) : null
            }
        };
    }

    extractTableContent(table) {
        const rows = [];
        
        if (table.tableRows) {
            table.tableRows.forEach(row => {
                const cells = [];
                if (row.tableCells) {
                    row.tableCells.forEach(cell => {
                        const cellContent = [];
                        if (cell.content) {
                            cell.content.forEach(element => {
                                if (element.paragraph) {
                                    const paragraph = this.extractParagraphContent(element.paragraph);
                                    cellContent.push(paragraph);
                                }
                            });
                        }
                        cells.push(cellContent);
                    });
                }
                rows.push(cells);
            });
        }

        return {
            type: 'table',
            rows: rows
        };
    }

    getHeadingLevel(headingId) {
        if (!headingId) return null;
        
        // Extract heading level from heading ID (e.g., "h.1" -> 1, "h.2" -> 2)
        const match = headingId.match(/h\.(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    convertFontSize(fontSize) {
        // Convert from points to pixels (1 point = 1.33 pixels)
        return Math.round(fontSize.magnitude * 1.33);
    }

    convertColor(color) {
        if (!color || !color.color) return null;
        
        const rgb = color.color.rgbColor;
        if (rgb) {
            const r = Math.round((rgb.red || 0) * 255);
            const g = Math.round((rgb.green || 0) * 255);
            const b = Math.round((rgb.blue || 0) * 255);
            return `rgb(${r}, ${g}, ${b})`;
        }
        
        return null;
    }

    async getDocumentMetadata(documentId) {
        const document = await this.getDocument(documentId);
        return {
            title: document.title,
            documentId: document.documentId,
            createdTime: document.createdTime,
            modifiedTime: document.modifiedTime,
            revisionId: document.revisionId,
            size: document.size
        };
    }

    async searchInDocument(documentId, searchTerm) {
        const content = await this.getDocumentContent(documentId);
        const results = [];
        
        content.forEach((element, index) => {
            if (element.type === 'paragraph' && element.text.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    type: 'paragraph',
                    index: index,
                    text: element.text,
                    headingLevel: element.headingLevel
                });
            } else if (element.type === 'table') {
                element.rows.forEach((row, rowIndex) => {
                    row.forEach((cell, cellIndex) => {
                        cell.forEach((cellElement, cellElementIndex) => {
                            if (cellElement.type === 'paragraph' && 
                                cellElement.text.toLowerCase().includes(searchTerm.toLowerCase())) {
                                results.push({
                                    type: 'table_cell',
                                    tableIndex: index,
                                    rowIndex: rowIndex,
                                    cellIndex: cellIndex,
                                    elementIndex: cellElementIndex,
                                    text: cellElement.text
                                });
                            }
                        });
                    });
                });
            }
        });
        
        return results;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleDocsAPI;
}