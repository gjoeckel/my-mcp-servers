/**
 * Contrast Checker Engine
 * Core logic for WCAG contrast ratio calculations and analysis
 */

class ContrastEngine {
    constructor() {
        this.wcagStandards = {
            AA: {
                normal: 4.5,
                large: 3.0
            },
            AAA: {
                normal: 7.0,
                large: 4.5
            }
        };
        
        this.largeTextThresholds = {
            18: 18, // 18px or 14px+ bold
            24: 24  // 24px or 18px+ bold
        };
    }

    /**
     * Calculate contrast ratio between two colors
     * @param {string} color1 - First color (hex, rgb, or hsl)
     * @param {string} color2 - Second color (hex, rgb, or hsl)
     * @returns {number} Contrast ratio (1-21)
     */
    calculateContrastRatio(color1, color2) {
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);
        
        if (!rgb1 || !rgb2) {
            return 0;
        }

        const lum1 = this.calculateLuminance(rgb1);
        const lum2 = this.calculateLuminance(rgb2);
        
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Parse color string to RGB values
     * @param {string} color - Color string
     * @returns {Object|null} RGB object or null if invalid
     */
    parseColor(color) {
        if (!color) return null;
        
        // Remove whitespace and convert to lowercase
        color = color.trim().toLowerCase();
        
        // Handle hex colors
        if (color.startsWith('#')) {
            return this.parseHexColor(color);
        }
        
        // Handle rgb/rgba colors
        if (color.startsWith('rgb')) {
            return this.parseRgbColor(color);
        }
        
        // Handle hsl/hsla colors
        if (color.startsWith('hsl')) {
            return this.parseHslColor(color);
        }
        
        // Handle named colors
        const namedColor = this.getNamedColor(color);
        if (namedColor) {
            return namedColor;
        }
        
        return null;
    }

    parseHexColor(hex) {
        hex = hex.replace('#', '');
        
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        if (hex.length !== 6) return null;
        
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return { r, g, b };
    }

    parseRgbColor(rgb) {
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) return null;
        
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        };
    }

    parseHslColor(hsl) {
        const match = hsl.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
        if (!match) return null;
        
        const h = parseInt(match[1]) / 360;
        const s = parseInt(match[2]) / 100;
        const l = parseInt(match[3]) / 100;
        
        return this.hslToRgb(h, s, l);
    }

    hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    getNamedColor(name) {
        const namedColors = {
            'black': { r: 0, g: 0, b: 0 },
            'white': { r: 255, g: 255, b: 255 },
            'red': { r: 255, g: 0, b: 0 },
            'green': { r: 0, g: 128, b: 0 },
            'blue': { r: 0, g: 0, b: 255 },
            'yellow': { r: 255, g: 255, b: 0 },
            'cyan': { r: 0, g: 255, b: 255 },
            'magenta': { r: 255, g: 0, b: 255 },
            'silver': { r: 192, g: 192, b: 192 },
            'gray': { r: 128, g: 128, b: 128 },
            'maroon': { r: 128, g: 0, b: 0 },
            'olive': { r: 128, g: 128, b: 0 },
            'lime': { r: 0, g: 255, b: 0 },
            'aqua': { r: 0, g: 255, b: 255 },
            'teal': { r: 0, g: 128, b: 128 },
            'navy': { r: 0, g: 0, b: 128 },
            'fuchsia': { r: 255, g: 0, b: 255 },
            'purple': { r: 128, g: 0, b: 128 }
        };
        
        return namedColors[name] || null;
    }

    /**
     * Calculate relative luminance of an RGB color
     * @param {Object} rgb - RGB color object
     * @returns {number} Relative luminance (0-1)
     */
    calculateLuminance(rgb) {
        const { r, g, b } = rgb;
        
        // Convert to sRGB
        const rsRGB = r / 255;
        const gsRGB = g / 255;
        const bsRGB = b / 255;
        
        // Apply gamma correction
        const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    /**
     * Check if contrast ratio meets WCAG standards
     * @param {number} ratio - Contrast ratio
     * @param {string} standard - WCAG standard (AA or AAA)
     * @param {boolean} isLargeText - Whether text is considered large
     * @returns {Object} Compliance result
     */
    checkCompliance(ratio, standard, isLargeText) {
        const required = this.wcagStandards[standard][isLargeText ? 'large' : 'normal'];
        const passed = ratio >= required;
        
        return {
            passed,
            required,
            actual: ratio,
            standard,
            isLargeText,
            level: passed ? 'pass' : (ratio >= required * 0.8 ? 'warning' : 'fail')
        };
    }

    /**
     * Determine if text should be considered large
     * @param {number} fontSize - Font size in pixels
     * @param {boolean} isBold - Whether text is bold
     * @param {number} threshold - Large text threshold
     * @returns {boolean} Whether text is large
     */
    isLargeText(fontSize, isBold, threshold = 18) {
        if (fontSize >= threshold) return true;
        if (isBold && fontSize >= threshold - 4) return true;
        return false;
    }

    /**
     * Generate color suggestions for better contrast
     * @param {string} foreground - Current foreground color
     * @param {string} background - Current background color
     * @param {number} targetRatio - Target contrast ratio
     * @returns {Array} Array of suggested colors
     */
    generateSuggestions(foreground, background, targetRatio) {
        const fgRgb = this.parseColor(foreground);
        const bgRgb = this.parseColor(background);
        
        if (!fgRgb || !bgRgb) return [];
        
        const suggestions = [];
        
        // Try adjusting foreground color
        suggestions.push(...this.adjustColorForContrast(fgRgb, bgRgb, targetRatio, 'foreground'));
        
        // Try adjusting background color
        suggestions.push(...this.adjustColorForContrast(bgRgb, fgRgb, targetRatio, 'background'));
        
        return suggestions.slice(0, 6); // Limit to 6 suggestions
    }

    adjustColorForContrast(colorRgb, otherRgb, targetRatio, type) {
        const suggestions = [];
        const otherLuminance = this.calculateLuminance(otherRgb);
        
        // Calculate target luminance
        const targetLuminance = type === 'foreground' 
            ? otherLuminance / (targetRatio - 0.05) - 0.05
            : (otherLuminance + 0.05) * targetRatio - 0.05;
        
        // Try different approaches
        const approaches = [
            { name: 'Darker', factor: 0.7 },
            { name: 'Much Darker', factor: 0.5 },
            { name: 'Lighter', factor: 1.3 },
            { name: 'Much Lighter', factor: 1.6 }
        ];
        
        approaches.forEach(approach => {
            const adjusted = this.adjustColorLuminance(colorRgb, approach.factor);
            const ratio = this.calculateContrastRatio(
                this.rgbToString(adjusted),
                this.rgbToString(otherRgb)
            );
            
            if (ratio >= targetRatio) {
                suggestions.push({
                    color: this.rgbToString(adjusted),
                    ratio: ratio,
                    name: `${approach.name} ${type}`,
                    type: type
                });
            }
        });
        
        return suggestions;
    }

    adjustColorLuminance(rgb, factor) {
        const { r, g, b } = rgb;
        
        return {
            r: Math.min(255, Math.max(0, Math.round(r * factor))),
            g: Math.min(255, Math.max(0, Math.round(g * factor))),
            b: Math.min(255, Math.max(0, Math.round(b * factor)))
        };
    }

    rgbToString(rgb) {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    /**
     * Analyze text elements for contrast issues
     * @param {Array} elements - Array of text elements
     * @param {Object} options - Analysis options
     * @returns {Array} Array of contrast issues
     */
    analyzeElements(elements, options = {}) {
        const {
            standard = 'AA',
            largeTextThreshold = 18,
            includeGradients = true,
            includeImages = false
        } = options;
        
        const issues = [];
        
        elements.forEach((element, index) => {
            if (element.type === 'paragraph' && element.elements) {
                element.elements.forEach((textRun, runIndex) => {
                    if (textRun.text && textRun.styles) {
                        const issue = this.analyzeTextRun(textRun, {
                            standard,
                            largeTextThreshold,
                            location: `Element ${index + 1}, Text Run ${runIndex + 1}`,
                            elementIndex: index,
                            runIndex: runIndex
                        });
                        
                        if (issue) {
                            issues.push(issue);
                        }
                    }
                });
            }
        });
        
        return issues;
    }

    analyzeTextRun(textRun, options) {
        const { styles, text } = textRun;
        const { standard, largeTextThreshold, location, elementIndex, runIndex } = options;
        
        if (!styles.foregroundColor || !styles.backgroundColor) {
            return null; // Skip if no color information
        }
        
        const ratio = this.calculateContrastRatio(
            styles.foregroundColor,
            styles.backgroundColor
        );
        
        if (ratio === 0) return null; // Skip if color parsing failed
        
        const isLarge = this.isLargeText(
            styles.fontSize || 16,
            styles.bold || false,
            largeTextThreshold
        );
        
        const compliance = this.checkCompliance(ratio, standard, isLarge);
        
        if (compliance.passed) return null; // Skip if compliant
        
        return {
            type: 'contrast_ratio',
            severity: compliance.level,
            location: location,
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            foreground: styles.foregroundColor,
            background: styles.backgroundColor,
            ratio: ratio,
            required: compliance.required,
            isLargeText: isLarge,
            fontSize: styles.fontSize || 16,
            isBold: styles.bold || false,
            elementIndex: elementIndex,
            runIndex: runIndex,
            suggestions: this.generateSuggestions(
                styles.foregroundColor,
                styles.backgroundColor,
                compliance.required
            )
        };
    }

    /**
     * Generate summary statistics
     * @param {Array} issues - Array of contrast issues
     * @returns {Object} Summary statistics
     */
    generateSummary(issues) {
        const total = issues.length;
        const failed = issues.filter(issue => issue.severity === 'fail').length;
        const warnings = issues.filter(issue => issue.severity === 'warning').length;
        const passed = total - failed - warnings;
        
        return {
            total,
            failed,
            warnings,
            passed,
            passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : 100
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContrastEngine;
}