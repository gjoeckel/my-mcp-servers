/**
 * Color Contrast Checker - Main Application
 * WCAG compliance testing for color contrast ratios
 */

class ContrastChecker {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.loadSavedData();
    }

    initializeApp() {
        this.elements = {
            foregroundInput: document.getElementById('foreground-color'),
            backgroundInput: document.getElementById('background-color'),
            foregroundHex: document.getElementById('foreground-hex'),
            backgroundHex: document.getElementById('background-hex'),
            contrastRatio: document.getElementById('contrast-ratio'),
            wcagAA: document.getElementById('wcag-aa'),
            wcagAAA: document.getElementById('wcag-aaa'),
            largeTextAA: document.getElementById('large-text-aa'),
            largeTextAAA: document.getElementById('large-text-aaa'),
            resultContainer: document.getElementById('result-container'),
            swapButton: document.getElementById('swap-colors'),
            randomButton: document.getElementById('random-colors'),
            saveButton: document.getElementById('save-test'),
            loadButton: document.getElementById('load-test')
        };

        this.currentTest = {
            foreground: '#000000',
            background: '#ffffff',
            timestamp: null
        };
    }

    bindEvents() {
        // Color input changes
        this.elements.foregroundInput.addEventListener('input', (e) => {
            this.updateFromColorInput('foreground', e.target.value);
        });

        this.elements.backgroundInput.addEventListener('input', (e) => {
            this.updateFromColorInput('background', e.target.value);
        });

        // Hex input changes
        this.elements.foregroundHex.addEventListener('input', (e) => {
            this.updateFromHexInput('foreground', e.target.value);
        });

        this.elements.backgroundHex.addEventListener('input', (e) => {
            this.updateFromHexInput('background', e.target.value);
        });

        // Action buttons
        this.elements.swapButton.addEventListener('click', () => this.swapColors());
        this.elements.randomButton.addEventListener('click', () => this.generateRandomColors());
        this.elements.saveButton.addEventListener('click', () => this.saveTest());
        this.elements.loadButton.addEventListener('click', () => this.loadTest());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveTest();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.loadTest();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.generateRandomColors();
                        break;
                }
            }
        });
    }

    updateFromColorInput(type, colorValue) {
        const hex = this.rgbToHex(colorValue);
        this.updateColor(type, hex);
    }

    updateFromHexInput(type, hexValue) {
        const hex = this.normalizeHex(hexValue);
        this.updateColor(type, hex);
    }

    updateColor(type, hex) {
        if (!this.isValidHex(hex)) return;

        this.currentTest[type] = hex;
        
        // Update UI
        if (type === 'foreground') {
            this.elements.foregroundInput.value = this.hexToRgb(hex);
            this.elements.foregroundHex.value = hex;
        } else {
            this.elements.backgroundInput.value = this.hexToRgb(hex);
            this.elements.backgroundHex.value = hex;
        }

        this.calculateContrast();
        this.updatePreview();
    }

    calculateContrast() {
        const fgLuminance = this.getLuminance(this.currentTest.foreground);
        const bgLuminance = this.getLuminance(this.currentTest.background);
        
        const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                     (Math.min(fgLuminance, bgLuminance) + 0.05);
        
        this.displayResults(ratio);
    }

    getLuminance(hex) {
        const rgb = this.hexToRgbArray(hex);
        const [r, g, b] = rgb.map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    displayResults(ratio) {
        this.elements.contrastRatio.textContent = ratio.toFixed(2);
        
        // WCAG AA (4.5:1 for normal text, 3:1 for large text)
        const passesAA = ratio >= 4.5;
        const passesLargeAA = ratio >= 3.0;
        
        // WCAG AAA (7:1 for normal text, 4.5:1 for large text)
        const passesAAA = ratio >= 7.0;
        const passesLargeAAA = ratio >= 4.5;
        
        this.updateWCAGStatus('wcag-aa', passesAA, '4.5:1');
        this.updateWCAGStatus('wcag-aaa', passesAAA, '7:1');
        this.updateWCAGStatus('large-text-aa', passesLargeAA, '3:1');
        this.updateWCAGStatus('large-text-aaa', passesLargeAAA, '4.5:1');
        
        // Update result container styling
        this.elements.resultContainer.className = `result-container ${passesAA ? 'pass' : 'fail'}`;
    }

    updateWCAGStatus(elementId, passes, threshold) {
        const element = document.getElementById(elementId);
        element.className = `wcag-status ${passes ? 'pass' : 'fail'}`;
        element.innerHTML = `
            <span class="status-icon">${passes ? '✅' : '❌'}</span>
            <span class="threshold">${threshold}</span>
        `;
    }

    updatePreview() {
        const preview = document.getElementById('color-preview');
        if (preview) {
            preview.style.color = this.currentTest.foreground;
            preview.style.backgroundColor = this.currentTest.background;
        }
    }

    swapColors() {
        const temp = this.currentTest.foreground;
        this.currentTest.foreground = this.currentTest.background;
        this.currentTest.background = temp;
        
        this.updateColor('foreground', this.currentTest.foreground);
        this.updateColor('background', this.currentTest.background);
    }

    generateRandomColors() {
        const fg = this.randomColor();
        const bg = this.randomColor();
        
        this.updateColor('foreground', fg);
        this.updateColor('background', bg);
    }

    randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    saveTest() {
        const testData = {
            ...this.currentTest,
            timestamp: new Date().toISOString(),
            contrastRatio: parseFloat(this.elements.contrastRatio.textContent)
        };
        
        const savedTests = JSON.parse(localStorage.getItem('contrastTests') || '[]');
        savedTests.push(testData);
        
        // Keep only last 10 tests
        if (savedTests.length > 10) {
            savedTests.splice(0, savedTests.length - 10);
        }
        
        localStorage.setItem('contrastTests', JSON.stringify(savedTests));
        this.showNotification('Test saved successfully!', 'success');
    }

    loadTest() {
        const savedTests = JSON.parse(localStorage.getItem('contrastTests') || '[]');
        
        if (savedTests.length === 0) {
            this.showNotification('No saved tests found', 'info');
            return;
        }
        
        // Show test selection modal (simplified - just load the most recent)
        const latestTest = savedTests[savedTests.length - 1];
        this.loadTestData(latestTest);
        this.showNotification('Test loaded successfully!', 'success');
    }

    loadTestData(testData) {
        this.updateColor('foreground', testData.foreground);
        this.updateColor('background', testData.background);
    }

    loadSavedData() {
        // Load from mobile agent if available
        const lastTestData = localStorage.getItem('lastTestData');
        if (lastTestData) {
            try {
                const data = JSON.parse(lastTestData);
                if (data.tool === 'contrast') {
                    // Extract colors from document if possible
                    this.showNotification('Mobile test data detected', 'info');
                }
            } catch (e) {
                console.log('No valid mobile test data found');
            }
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Utility functions
    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    normalizeHex(hex) {
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        return hex.toUpperCase();
    }

    hexToRgb(hex) {
        const rgb = this.hexToRgbArray(hex);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    hexToRgbArray(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        if (!result || result.length !== 3) return '#000000';
        
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContrastChecker();
});