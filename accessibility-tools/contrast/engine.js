/**
 * Color Contrast Engine
 * Core algorithms for WCAG contrast calculations and color analysis
 */

class ContrastEngine {
    constructor() {
        this.wcagStandards = {
            aa: {
                normal: 4.5,
                large: 3.0
            },
            aaa: {
                normal: 7.0,
                large: 4.5
            }
        };
        
        this.colorBlindnessTypes = [
            'protanopia',
            'deuteranopia', 
            'tritanopia',
            'protanomaly',
            'deuteranomaly',
            'tritanomaly'
        ];
    }

    /**
     * Calculate contrast ratio between two colors
     * @param {string} color1 - First color in hex format
     * @param {string} color2 - Second color in hex format
     * @returns {number} Contrast ratio
     */
    calculateContrastRatio(color1, color2) {
        const lum1 = this.getRelativeLuminance(color1);
        const lum2 = this.getRelativeLuminance(color2);
        
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Calculate relative luminance of a color
     * @param {string} hex - Color in hex format
     * @returns {number} Relative luminance (0-1)
     */
    getRelativeLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        const [r, g, b] = rgb.map(c => this.sRGBToLinear(c / 255));
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Convert sRGB value to linear RGB
     * @param {number} c - sRGB component (0-1)
     * @returns {number} Linear RGB component
     */
    sRGBToLinear(c) {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    /**
     * Check WCAG compliance for a contrast ratio
     * @param {number} ratio - Contrast ratio
     * @param {boolean} isLargeText - Whether text is large (18pt+ or 14pt+ bold)
     * @returns {object} WCAG compliance results
     */
    checkWCAGCompliance(ratio, isLargeText = false) {
        const size = isLargeText ? 'large' : 'normal';
        
        return {
            aa: ratio >= this.wcagStandards.aa[size],
            aaa: ratio >= this.wcagStandards.aaa[size],
            ratio: ratio,
            level: this.getWCAGLevel(ratio, isLargeText)
        };
    }

    /**
     * Get WCAG compliance level
     * @param {number} ratio - Contrast ratio
     * @param {boolean} isLargeText - Whether text is large
     * @returns {string} Compliance level
     */
    getWCAGLevel(ratio, isLargeText) {
        const size = isLargeText ? 'large' : 'normal';
        
        if (ratio >= this.wcagStandards.aaa[size]) {
            return 'AAA';
        } else if (ratio >= this.wcagStandards.aa[size]) {
            return 'AA';
        } else {
            return 'Fail';
        }
    }

    /**
     * Suggest color adjustments to meet WCAG standards
     * @param {string} fgHex - Foreground color
     * @param {string} bgHex - Background color
     * @param {string} target - Target WCAG level ('AA' or 'AAA')
     * @param {boolean} isLargeText - Whether text is large
     * @returns {object} Color adjustment suggestions
     */
    suggestAdjustments(fgHex, bgHex, target = 'AA', isLargeText = false) {
        const currentRatio = this.calculateContrastRatio(fgHex, bgHex);
        const size = isLargeText ? 'large' : 'normal';
        const requiredRatio = target === 'AAA' ? 
            this.wcagStandards.aaa[size] : 
            this.wcagStandards.aa[size];
        
        if (currentRatio >= requiredRatio) {
            return {
                needsAdjustment: false,
                currentRatio,
                requiredRatio,
                message: `Already meets WCAG ${target} standards`
            };
        }
        
        const fgLum = this.getRelativeLuminance(fgHex);
        const bgLum = this.getRelativeLuminance(bgHex);
        
        const suggestions = [];
        
        // Try darkening the darker color
        if (fgLum < bgLum) {
            const newFg = this.adjustLuminance(fgHex, -0.1);
            const newRatio = this.calculateContrastRatio(newFg, bgHex);
            if (newRatio >= requiredRatio) {
                suggestions.push({
                    type: 'darken_foreground',
                    color: newFg,
                    ratio: newRatio,
                    description: 'Darken foreground color'
                });
            }
        } else {
            const newBg = this.adjustLuminance(bgHex, -0.1);
            const newRatio = this.calculateContrastRatio(fgHex, newBg);
            if (newRatio >= requiredRatio) {
                suggestions.push({
                    type: 'darken_background',
                    color: newBg,
                    ratio: newRatio,
                    description: 'Darken background color'
                });
            }
        }
        
        // Try lightening the lighter color
        if (fgLum > bgLum) {
            const newFg = this.adjustLuminance(fgHex, 0.1);
            const newRatio = this.calculateContrastRatio(newFg, bgHex);
            if (newRatio >= requiredRatio) {
                suggestions.push({
                    type: 'lighten_foreground',
                    color: newFg,
                    ratio: newRatio,
                    description: 'Lighten foreground color'
                });
            }
        } else {
            const newBg = this.adjustLuminance(bgHex, 0.1);
            const newRatio = this.calculateContrastRatio(fgHex, newBg);
            if (newRatio >= requiredRatio) {
                suggestions.push({
                    type: 'lighten_background',
                    color: newBg,
                    ratio: newRatio,
                    description: 'Lighten background color'
                });
            }
        }
        
        return {
            needsAdjustment: true,
            currentRatio,
            requiredRatio,
            suggestions: suggestions.slice(0, 3) // Limit to 3 suggestions
        };
    }

    /**
     * Adjust luminance of a color
     * @param {string} hex - Color in hex format
     * @param {number} adjustment - Luminance adjustment (-1 to 1)
     * @returns {string} Adjusted color in hex format
     */
    adjustLuminance(hex, adjustment) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb);
        
        // Adjust lightness
        hsl[2] = Math.max(0, Math.min(100, hsl[2] + (adjustment * 50)));
        
        const newRgb = this.hslToRgb(hsl);
        return this.rgbToHex(newRgb);
    }

    /**
     * Simulate color blindness
     * @param {string} hex - Color in hex format
     * @param {string} type - Type of color blindness
     * @returns {string} Simulated color in hex format
     */
    simulateColorBlindness(hex, type) {
        const rgb = this.hexToRgb(hex);
        const matrix = this.getColorBlindnessMatrix(type);
        
        const newRgb = [
            Math.round(matrix[0][0] * rgb[0] + matrix[0][1] * rgb[1] + matrix[0][2] * rgb[2]),
            Math.round(matrix[1][0] * rgb[0] + matrix[1][1] * rgb[1] + matrix[1][2] * rgb[2]),
            Math.round(matrix[2][0] * rgb[0] + matrix[2][1] * rgb[1] + matrix[2][2] * rgb[2])
        ];
        
        return this.rgbToHex(newRgb);
    }

    /**
     * Get color blindness simulation matrix
     * @param {string} type - Type of color blindness
     * @returns {Array} 3x3 transformation matrix
     */
    getColorBlindnessMatrix(type) {
        const matrices = {
            protanopia: [
                [0.567, 0.433, 0],
                [0.558, 0.442, 0],
                [0, 0.242, 0.758]
            ],
            deuteranopia: [
                [0.625, 0.375, 0],
                [0.7, 0.3, 0],
                [0, 0.3, 0.7]
            ],
            tritanopia: [
                [0.95, 0.05, 0],
                [0, 0.433, 0.567],
                [0, 0.475, 0.525]
            ]
        };
        
        return matrices[type] || matrices.protanopia;
    }

    /**
     * Analyze color palette for accessibility
     * @param {Array} colors - Array of hex colors
     * @returns {object} Palette analysis results
     */
    analyzePalette(colors) {
        const results = {
            totalColors: colors.length,
            accessiblePairs: [],
            problematicPairs: [],
            recommendations: []
        };
        
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const ratio = this.calculateContrastRatio(colors[i], colors[j]);
                const compliance = this.checkWCAGCompliance(ratio);
                
                const pair = {
                    color1: colors[i],
                    color2: colors[j],
                    ratio: ratio,
                    compliance: compliance
                };
                
                if (compliance.aa) {
                    results.accessiblePairs.push(pair);
                } else {
                    results.problematicPairs.push(pair);
                }
            }
        }
        
        // Generate recommendations
        if (results.problematicPairs.length > 0) {
            results.recommendations.push('Consider adjusting colors with low contrast ratios');
        }
        
        if (results.accessiblePairs.length < 3) {
            results.recommendations.push('Add more color combinations that meet WCAG standards');
        }
        
        return results;
    }

    // Utility functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    rgbToHex(rgb) {
        return '#' + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }

    rgbToHsl(rgb) {
        const [r, g, b] = rgb.map(c => c / 255);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    }

    hslToRgb(hsl) {
        const [h, s, l] = hsl.map((c, i) => i === 0 ? c : c / 100);
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;

        if (0 <= h && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (60 <= h && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (120 <= h && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (180 <= h && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (240 <= h && h < 300) {
            [r, g, b] = [x, 0, c];
        } else if (300 <= h && h < 360) {
            [r, g, b] = [c, 0, x];
        }

        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContrastEngine;
} else {
    window.ContrastEngine = ContrastEngine;
}