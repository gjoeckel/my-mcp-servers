/**
 * Google Slides API Helper
 * Handles interactions with Google Slides API
 */

class GoogleSlidesAPI {
    constructor(authInstance) {
        this.authInstance = authInstance;
        this.baseUrl = 'https://slides.googleapis.com/v1/presentations';
    }

    async getPresentation(presentationId) {
        const token = this.authInstance.getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        try {
            const response = await fetch(`${this.baseUrl}/${presentationId}`, {
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
            console.error('Error fetching presentation:', error);
            throw error;
        }
    }

    async getPresentationContent(presentationId) {
        const presentation = await this.getPresentation(presentationId);
        return this.extractSlideContent(presentation);
    }

    extractSlideContent(presentation) {
        const slides = [];
        
        if (presentation.slides) {
            presentation.slides.forEach((slide, slideIndex) => {
                const slideContent = {
                    slideId: slide.objectId,
                    slideNumber: slideIndex + 1,
                    elements: []
                };

                if (slide.pageElements) {
                    slide.pageElements.forEach(element => {
                        const elementContent = this.extractElementContent(element);
                        if (elementContent) {
                            slideContent.elements.push(elementContent);
                        }
                    });
                }

                slides.push(slideContent);
            });
        }

        return {
            presentationId: presentation.presentationId,
            title: presentation.title,
            slides: slides
        };
    }

    extractElementContent(element) {
        if (element.shape) {
            return this.extractShapeContent(element);
        } else if (element.textBox) {
            return this.extractTextBoxContent(element);
        } else if (element.image) {
            return this.extractImageContent(element);
        } else if (element.table) {
            return this.extractTableContent(element);
        }
        
        return null;
    }

    extractShapeContent(element) {
        const shape = element.shape;
        const text = shape.text ? this.extractTextContent(shape.text) : null;
        
        return {
            type: 'shape',
            objectId: element.objectId,
            shapeType: shape.shapeType,
            text: text,
            position: element.transform ? this.extractPosition(element.transform) : null,
            size: element.size ? this.extractSize(element.size) : null
        };
    }

    extractTextBoxContent(element) {
        const textBox = element.textBox;
        const text = this.extractTextContent(textBox);
        
        return {
            type: 'textBox',
            objectId: element.objectId,
            text: text,
            position: element.transform ? this.extractPosition(element.transform) : null,
            size: element.size ? this.extractSize(element.size) : null
        };
    }

    extractImageContent(element) {
        return {
            type: 'image',
            objectId: element.objectId,
            imageUrl: element.image.contentUrl,
            position: element.transform ? this.extractPosition(element.transform) : null,
            size: element.size ? this.extractSize(element.size) : null
        };
    }

    extractTableContent(element) {
        const table = element.table;
        const rows = [];
        
        if (table.tableRows) {
            table.tableRows.forEach(row => {
                const cells = [];
                if (row.tableCells) {
                    row.tableCells.forEach(cell => {
                        const cellText = cell.text ? this.extractTextContent(cell.text) : null;
                        cells.push({
                            text: cellText,
                            columnSpan: cell.columnSpan || 1,
                            rowSpan: cell.rowSpan || 1
                        });
                    });
                }
                rows.push(cells);
            });
        }

        return {
            type: 'table',
            objectId: element.objectId,
            rows: rows,
            position: element.transform ? this.extractPosition(element.transform) : null,
            size: element.size ? this.extractSize(element.size) : null
        };
    }

    extractTextContent(textElement) {
        if (!textElement.textElements) return null;

        const textParts = [];
        textElement.textElements.forEach(textEl => {
            if (textEl.textRun) {
                const textRun = textEl.textRun;
                const content = textRun.content || '';
                const style = textRun.style || {};
                
                textParts.push({
                    text: content,
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
                });
            }
        });

        return {
            text: textParts.map(part => part.text).join(''),
            parts: textParts
        };
    }

    extractPosition(transform) {
        return {
            x: transform.translateX ? this.convertDimension(transform.translateX) : 0,
            y: transform.translateY ? this.convertDimension(transform.translateY) : 0,
            scaleX: transform.scaleX || 1,
            scaleY: transform.scaleY || 1,
            shearX: transform.shearX || 0,
            shearY: transform.shearY || 0
        };
    }

    extractSize(size) {
        return {
            width: size.width ? this.convertDimension(size.width) : 0,
            height: size.height ? this.convertDimension(size.height) : 0
        };
    }

    convertDimension(dimension) {
        // Convert from EMU (English Metric Units) to pixels
        // 1 EMU = 1/914400 inch, 1 inch = 96 pixels
        return Math.round((dimension.magnitude / 914400) * 96);
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

    async getPresentationMetadata(presentationId) {
        const presentation = await this.getPresentation(presentationId);
        return {
            presentationId: presentation.presentationId,
            title: presentation.title,
            createdTime: presentation.createdTime,
            modifiedTime: presentation.modifiedTime,
            revisionId: presentation.revisionId,
            size: presentation.size,
            slideCount: presentation.slides ? presentation.slides.length : 0
        };
    }

    async searchInPresentation(presentationId, searchTerm) {
        const content = await this.getPresentationContent(presentationId);
        const results = [];
        
        content.slides.forEach(slide => {
            slide.elements.forEach(element => {
                if (element.text && element.text.text.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push({
                        slideNumber: slide.slideNumber,
                        slideId: slide.slideId,
                        elementType: element.type,
                        elementId: element.objectId,
                        text: element.text.text
                    });
                } else if (element.type === 'table') {
                    element.rows.forEach((row, rowIndex) => {
                        row.forEach((cell, cellIndex) => {
                            if (cell.text && cell.text.text.toLowerCase().includes(searchTerm.toLowerCase())) {
                                results.push({
                                    slideNumber: slide.slideNumber,
                                    slideId: slide.slideId,
                                    elementType: 'table_cell',
                                    elementId: element.objectId,
                                    rowIndex: rowIndex,
                                    cellIndex: cellIndex,
                                    text: cell.text.text
                                });
                            }
                        });
                    });
                }
            });
        });
        
        return results;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleSlidesAPI;
}