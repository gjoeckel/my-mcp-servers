// Color Contrast Engine - WCAG 2.1 Compliance
// Ported from Google Apps Script implementation

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color in hex format (#RRGGBB)
 * @param {string} color2 - Second color in hex format (#RRGGBB)
 * @returns {number} Contrast ratio (1-21)
 */
function calculateContrast(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    if (lum1 === null || lum2 === null) {
        console.error('Invalid color format provided to calculateContrast');
        return 0;
    }
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Get relative luminance of a color
 * @param {string} hex - Color in hex format (#RRGGBB)
 * @returns {number|null} Relative luminance (0-1) or null if invalid
 */
function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    // Convert to relative luminance
    const a = rgb.map(v => {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Convert hex color to RGB array
 * @param {string} hex - Color in hex format (#RRGGBB or #RGB)
 * @returns {number[]|null} RGB array [r, g, b] or null if invalid
 */
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle both 3 and 6 character hex codes
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
}

/**
 * Check WCAG compliance for a contrast ratio
 * @param {number} ratio - Contrast ratio
 * @param {string} textSize - 'normal' or 'large'
 * @returns {Object} WCAG compliance results
 */
function checkWCAGCompliance(ratio, textSize = 'normal') {
    const isLarge = textSize === 'large';
    
    return {
        ratio: ratio,
        aa: {
            required: isLarge ? 3.0 : 4.5,
            passes: ratio >= (isLarge ? 3.0 : 4.5),
            level: ratio >= (isLarge ? 3.0 : 4.5) ? 'pass' : 'fail'
        },
        aaa: {
            required: isLarge ? 4.5 : 7.0,
            passes: ratio >= (isLarge ? 4.5 : 7.0),
            level: ratio >= (isLarge ? 4.5 : 7.0) ? 'pass' : 'fail'
        }
    };
}

/**
 * Get comprehensive contrast analysis
 * @param {string} foreground - Foreground color in hex format
 * @param {string} background - Background color in hex format
 * @returns {Object} Complete contrast analysis
 */
function analyzeContrast(foreground, background) {
    const ratio = calculateContrast(foreground, background);
    const normalCompliance = checkWCAGCompliance(ratio, 'normal');
    const largeCompliance = checkWCAGCompliance(ratio, 'large');
    
    return {
        foreground: foreground,
        background: background,
        ratio: ratio,
        luminance: {
            foreground: getLuminance(foreground),
            background: getLuminance(background)
        },
        wcag: {
            normal: normalCompliance,
            large: largeCompliance
        },
        recommendations: getRecommendations(ratio, normalCompliance, largeCompliance)
    };
}

/**
 * Get accessibility recommendations based on contrast analysis
 * @param {number} ratio - Contrast ratio
 * @param {Object} normalCompliance - Normal text compliance
 * @param {Object} largeCompliance - Large text compliance
 * @returns {string[]} Array of recommendations
 */
function getRecommendations(ratio, normalCompliance, largeCompliance) {
    const recommendations = [];
    
    if (ratio < 3.0) {
        recommendations.push('❌ Very low contrast - not accessible for any text size');
        recommendations.push('💡 Consider using darker/lighter colors for better contrast');
    } else if (ratio < 4.5) {
        if (normalCompliance.aa.passes) {
            recommendations.push('⚠️ Meets WCAG AA for large text only');
            recommendations.push('💡 Use larger font sizes (18pt+) for better accessibility');
        } else {
            recommendations.push('❌ Does not meet WCAG AA standards');
            recommendations.push('💡 Increase contrast by adjusting colors');
        }
    } else if (ratio < 7.0) {
        recommendations.push('✅ Meets WCAG AA standards');
        recommendations.push('💡 Consider higher contrast for WCAG AAA compliance');
    } else {
        recommendations.push('✅ Excellent contrast - meets WCAG AAA standards');
    }
    
    return recommendations;
}

/**
 * Generate color suggestions for better contrast
 * @param {string} baseColor - Base color in hex format
 * @param {string} targetColor - Target color in hex format
 * @param {number} targetRatio - Target contrast ratio
 * @returns {Object} Color suggestions
 */
function suggestColors(baseColor, targetColor, targetRatio = 4.5) {
    const baseRgb = hexToRgb(baseColor);
    const targetRgb = hexToRgb(targetColor);
    
    if (!baseRgb || !targetRgb) {
        return { error: 'Invalid color format' };
    }
    
    // Simple algorithm to adjust target color for better contrast
    const suggestions = [];
    
    // Try lighter/darker versions
    for (let factor of [0.1, 0.2, 0.3, 0.5, 0.7, 0.9]) {
        const adjusted = targetRgb.map(component => 
            Math.round(component * factor)
        );
        const adjustedHex = rgbToHex(adjusted[0], adjusted[1], adjusted[2]);
        const ratio = calculateContrast(baseColor, adjustedHex);
        
        if (ratio >= targetRatio) {
            suggestions.push({
                color: adjustedHex,
                ratio: ratio,
                method: factor < 1 ? 'darkened' : 'lightened'
            });
        }
    }
    
    return {
        original: {
            color: targetColor,
            ratio: calculateContrast(baseColor, targetColor)
        },
        suggestions: suggestions.slice(0, 3) // Return top 3 suggestions
    };
}

/**
 * Convert RGB values to hex color
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {string} Hex color (#RRGGBB)
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Validate hex color format
 * @param {string} hex - Color in hex format
 * @returns {boolean} True if valid hex color
 */
function isValidHexColor(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    // Browser environment
    window.contrastEngine = {
        calculateContrast,
        getLuminance,
        hexToRgb,
        checkWCAGCompliance,
        analyzeContrast,
        getRecommendations,
        suggestColors,
        rgbToHex,
        isValidHexColor
    };
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        calculateContrast,
        getLuminance,
        hexToRgb,
        checkWCAGCompliance,
        analyzeContrast,
        getRecommendations,
        suggestColors,
        rgbToHex,
        isValidHexColor
    };
}