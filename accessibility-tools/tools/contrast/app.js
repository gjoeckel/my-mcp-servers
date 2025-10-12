/**
 * Contrast Checker Application
 * Main application logic for the contrast checking tool
 */

class ContrastCheckerApp {
    constructor() {
        this.auth = null;
        this.picker = null;
        this.docsAPI = null;
        this.slidesAPI = null;
        this.engine = new ContrastEngine();
        this.currentDocument = null;
        this.analysisResults = [];
        this.filteredResults = [];
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            await this.setupGoogleAPIs();
            this.setupEventListeners();
            this.updateUI();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application. Please refresh and try again.');
        }
    }

    async setupGoogleAPIs() {
        // Initialize Google Auth
        this.auth = new GoogleAuth('YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com');
        await this.auth.initialize();
        
        // Setup other APIs
        this.picker = new GooglePicker(this.auth);
        this.docsAPI = new GoogleDocsAPI(this.auth);
        this.slidesAPI = new GoogleSlidesAPI(this.auth);
        
        // Check if already signed in
        if (this.auth.isSignedIn()) {
            this.updateAuthUI(true);
        }
    }

    setupEventListeners() {
        // Auth button
        document.getElementById('authBtn').addEventListener('click', () => this.handleAuth());
        
        // Document selection
        document.getElementById('selectDocBtn').addEventListener('click', () => this.selectDocument());
        
        // Analysis
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeDocument());
        
        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportReport());
        
        // Filter and sort
        document.getElementById('filterBtn').addEventListener('click', () => this.showFilterModal());
        document.getElementById('sortBtn').addEventListener('click', () => this.sortResults());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearResults());
        
        // Modal controls
        document.getElementById('applyFilter').addEventListener('click', () => this.applyFilter());
        document.getElementById('clearFilter').addEventListener('click', () => this.clearFilter());
        document.querySelector('.modal-close').addEventListener('click', () => this.hideFilterModal());
        
        // Settings changes
        document.getElementById('wcagStandard').addEventListener('change', () => this.updateSettings());
        document.getElementById('textSizeThreshold').addEventListener('change', () => this.updateSettings());
        document.getElementById('includeGradients').addEventListener('change', () => this.updateSettings());
        document.getElementById('includeImages').addEventListener('change', () => this.updateSettings());
    }

    async handleAuth() {
        try {
            if (this.auth.isSignedIn()) {
                await this.auth.signOut();
                this.updateAuthUI(false);
            } else {
                await this.auth.signIn();
                this.updateAuthUI(true);
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showError('Authentication failed. Please try again.');
        }
    }

    updateAuthUI(isSignedIn) {
        const authBtn = document.getElementById('authBtn');
        const selectDocBtn = document.getElementById('selectDocBtn');
        
        if (isSignedIn) {
            authBtn.textContent = 'Sign Out';
            authBtn.className = 'btn btn-outline';
            selectDocBtn.disabled = false;
        } else {
            authBtn.textContent = 'Sign In with Google';
            authBtn.className = 'btn btn-outline';
            selectDocBtn.disabled = true;
            this.clearDocument();
        }
    }

    async selectDocument() {
        if (!this.auth.isSignedIn()) {
            this.showError('Please sign in first.');
            return;
        }

        try {
            this.picker.showMultiTypePicker((documents) => {
                if (documents.length > 0) {
                    this.setCurrentDocument(documents[0]);
                }
            });
        } catch (error) {
            console.error('Document selection error:', error);
            this.showError('Failed to select document. Please try again.');
        }
    }

    setCurrentDocument(document) {
        this.currentDocument = document;
        this.updateDocumentUI();
        this.updateUI();
    }

    updateDocumentUI() {
        const documentInfo = document.getElementById('documentInfo');
        const noDocument = document.getElementById('noDocument');
        const documentName = document.getElementById('documentName');
        const documentType = document.getElementById('documentType');
        const documentId = document.getElementById('documentId');
        
        if (this.currentDocument) {
            documentName.textContent = this.currentDocument.name;
            documentType.textContent = `Type: ${this.currentDocument.type}`;
            documentId.textContent = `ID: ${this.currentDocument.id}`;
            
            documentInfo.classList.remove('hidden');
            noDocument.classList.add('hidden');
        } else {
            documentInfo.classList.add('hidden');
            noDocument.classList.remove('hidden');
        }
    }

    async analyzeDocument() {
        if (!this.currentDocument) {
            this.showError('Please select a document first.');
            return;
        }

        try {
            this.showLoading(true);
            this.clearResults();
            
            const options = this.getAnalysisOptions();
            let elements = [];
            
            // Get document content based on type
            if (this.currentDocument.type === 'document') {
                elements = await this.docsAPI.getDocumentContent(this.currentDocument.id);
            } else if (this.currentDocument.type === 'presentation') {
                const content = await this.slidesAPI.getPresentationContent(this.currentDocument.id);
                elements = this.flattenSlidesContent(content);
            }
            
            // Analyze elements for contrast issues
            this.analysisResults = this.engine.analyzeElements(elements, options);
            this.filteredResults = [...this.analysisResults];
            
            this.displayResults();
            this.updateSummaryStats();
            this.updateUI();
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Failed to analyze document. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    getAnalysisOptions() {
        return {
            standard: document.getElementById('wcagStandard').value,
            largeTextThreshold: parseInt(document.getElementById('textSizeThreshold').value),
            includeGradients: document.getElementById('includeGradients').checked,
            includeImages: document.getElementById('includeImages').checked
        };
    }

    flattenSlidesContent(content) {
        const elements = [];
        
        content.slides.forEach(slide => {
            slide.elements.forEach(element => {
                if (element.text) {
                    elements.push({
                        type: 'paragraph',
                        text: element.text.text,
                        elements: element.text.parts ? element.text.parts.map(part => ({
                            text: part.text,
                            styles: part.styles
                        })) : []
                    });
                }
            });
        });
        
        return elements;
    }

    displayResults() {
        const resultsList = document.getElementById('resultsList');
        const noResults = document.getElementById('noResults');
        
        if (this.filteredResults.length === 0) {
            resultsList.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        resultsList.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        resultsList.innerHTML = this.filteredResults.map(result => this.createResultHTML(result)).join('');
    }

    createResultHTML(result) {
        const severityClass = result.severity;
        const ratioPercent = Math.min((result.ratio / result.required) * 100, 100);
        
        return `
            <div class="result-item ${severityClass}">
                <div class="result-header">
                    <div class="result-location">${result.location}</div>
                    <div class="result-severity ${severityClass}">${severityClass.toUpperCase()}</div>
                </div>
                <div class="result-content">
                    <div class="result-description">
                        <strong>Text:</strong> "${result.text}"
                    </div>
                    <div class="result-details">
                        <div class="result-detail">
                            <div class="result-detail-label">Foreground</div>
                            <div class="color-swatch">
                                <div class="color-preview" style="background-color: ${result.foreground}"></div>
                                <span class="color-value">${result.foreground}</span>
                            </div>
                        </div>
                        <div class="result-detail">
                            <div class="result-detail-label">Background</div>
                            <div class="color-swatch">
                                <div class="color-preview" style="background-color: ${result.background}"></div>
                                <span class="color-value">${result.background}</span>
                            </div>
                        </div>
                        <div class="result-detail">
                            <div class="result-detail-label">Contrast Ratio</div>
                            <div class="contrast-ratio">
                                <span class="ratio-value">${result.ratio.toFixed(2)}:1</span>
                                <div class="ratio-bar">
                                    <div class="ratio-fill" style="width: ${ratioPercent}%"></div>
                                    <div class="ratio-threshold" style="left: ${(result.required / 21) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="result-detail">
                            <div class="result-detail-label">Required</div>
                            <div class="result-detail-value">${result.required}:1 (${result.isLargeText ? 'Large' : 'Normal'} text)</div>
                        </div>
                    </div>
                    ${this.createSuggestionsHTML(result.suggestions)}
                </div>
            </div>
        `;
    }

    createSuggestionsHTML(suggestions) {
        if (!suggestions || suggestions.length === 0) return '';
        
        return `
            <div class="suggestion-box">
                <div class="suggestion-title">💡 Suggestions for Better Contrast</div>
                <div class="suggestion-text">
                    Try these color adjustments to meet WCAG requirements:
                </div>
                <div class="suggestion-colors">
                    ${suggestions.map(suggestion => `
                        <div class="suggestion-color" data-color="${suggestion.color}" data-ratio="${suggestion.ratio}">
                            <div class="color-preview" style="background-color: ${suggestion.color}"></div>
                            <div>
                                <div class="color-value">${suggestion.color}</div>
                                <div class="text-xs">${suggestion.ratio.toFixed(2)}:1</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateSummaryStats() {
        const summary = this.engine.generateSummary(this.filteredResults);
        
        document.getElementById('totalChecks').textContent = summary.total;
        document.getElementById('passedChecks').textContent = summary.passed;
        document.getElementById('warningChecks').textContent = summary.warnings;
        document.getElementById('failedChecks').textContent = summary.failed;
        
        const summaryStats = document.getElementById('summaryStats');
        summaryStats.classList.remove('hidden');
    }

    showFilterModal() {
        document.getElementById('filterModal').classList.remove('hidden');
    }

    hideFilterModal() {
        document.getElementById('filterModal').classList.add('hidden');
    }

    applyFilter() {
        const showFailed = document.getElementById('filterFailed').checked;
        const showWarning = document.getElementById('filterWarning').checked;
        const showPassed = document.getElementById('filterPassed').checked;
        const minRatio = parseFloat(document.getElementById('minRatio').value) || 0;
        const maxRatio = parseFloat(document.getElementById('maxRatio').value) || 21;
        
        this.filteredResults = this.analysisResults.filter(result => {
            const severityMatch = 
                (showFailed && result.severity === 'fail') ||
                (showWarning && result.severity === 'warning') ||
                (showPassed && result.severity === 'pass');
            
            const ratioMatch = result.ratio >= minRatio && result.ratio <= maxRatio;
            
            return severityMatch && ratioMatch;
        });
        
        this.displayResults();
        this.updateSummaryStats();
        this.hideFilterModal();
    }

    clearFilter() {
        document.getElementById('filterFailed').checked = true;
        document.getElementById('filterWarning').checked = true;
        document.getElementById('filterPassed').checked = false;
        document.getElementById('minRatio').value = '';
        document.getElementById('maxRatio').value = '';
        
        this.filteredResults = [...this.analysisResults];
        this.displayResults();
        this.updateSummaryStats();
    }

    sortResults() {
        // Simple sort by severity (fail > warning > pass) then by ratio
        this.filteredResults.sort((a, b) => {
            const severityOrder = { 'fail': 0, 'warning': 1, 'pass': 2 };
            const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
            
            if (severityDiff !== 0) return severityDiff;
            return b.ratio - a.ratio; // Higher ratio first within same severity
        });
        
        this.displayResults();
    }

    clearResults() {
        this.analysisResults = [];
        this.filteredResults = [];
        this.displayResults();
        document.getElementById('summaryStats').classList.add('hidden');
    }

    updateSettings() {
        // Re-analyze if we have results
        if (this.analysisResults.length > 0) {
            this.analyzeDocument();
        }
    }

    updateUI() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const exportBtn = document.getElementById('exportBtn');
        
        analyzeBtn.disabled = !this.currentDocument;
        exportBtn.disabled = this.analysisResults.length === 0;
    }

    showLoading(show) {
        const loadingResults = document.getElementById('loadingResults');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (show) {
            loadingResults.classList.remove('hidden');
            resultsContainer.style.position = 'relative';
        } else {
            loadingResults.classList.add('hidden');
            resultsContainer.style.position = 'static';
        }
    }

    clearDocument() {
        this.currentDocument = null;
        this.updateDocumentUI();
        this.clearResults();
        this.updateUI();
    }

    exportReport() {
        if (this.analysisResults.length === 0) {
            this.showError('No results to export.');
            return;
        }
        
        const report = this.generateReport();
        this.downloadReport(report);
    }

    generateReport() {
        const summary = this.engine.generateSummary(this.analysisResults);
        const timestamp = new Date().toISOString();
        
        return {
            metadata: {
                generatedAt: timestamp,
                document: this.currentDocument,
                settings: this.getAnalysisOptions(),
                summary: summary
            },
            results: this.analysisResults.map(result => ({
                location: result.location,
                severity: result.severity,
                text: result.text,
                foreground: result.foreground,
                background: result.background,
                ratio: result.ratio,
                required: result.required,
                isLargeText: result.isLargeText,
                suggestions: result.suggestions
            }))
        };
    }

    downloadReport(report) {
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `contrast-report-${this.currentDocument.name}-${Date.now()}.json`;
        link.click();
    }

    showError(message) {
        // Simple error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #FF3B30;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContrastCheckerApp();
});