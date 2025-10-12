/**
 * Google Picker Helper
 * Handles document selection using Google Picker API
 */

class GooglePicker {
    constructor(authInstance) {
        this.authInstance = authInstance;
    }

    createPicker(options = {}) {
        const defaultOptions = {
            includeFolders: false,
            multiselect: false,
            viewId: google.picker.ViewId.DOCS,
            mimeTypes: 'application/vnd.google-apps.document,application/vnd.google-apps.presentation'
        };

        const config = { ...defaultOptions, ...options };
        
        const picker = new google.picker.PickerBuilder()
            .addView(config.viewId)
            .setOAuthToken(this.authInstance.getAccessToken())
            .setCallback(this.handlePickerResponse.bind(this))
            .setOrigin(window.location.protocol + '//' + window.location.host);

        if (config.multiselect) {
            picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
        }

        if (config.includeFolders) {
            picker.enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES);
        }

        if (config.mimeTypes) {
            picker.addView(new google.picker.DocsView(google.picker.ViewId.DOCS)
                .setIncludeFolders(config.includeFolders)
                .setSelectFolderEnabled(false)
                .setMimeTypes(config.mimeTypes));
        }

        return picker.build();
    }

    showDocumentPicker(callback) {
        const picker = this.createPicker({
            viewId: google.picker.ViewId.DOCS,
            mimeTypes: 'application/vnd.google-apps.document'
        });
        
        this.callback = callback;
        picker.setVisible(true);
    }

    showPresentationPicker(callback) {
        const picker = this.createPicker({
            viewId: google.picker.ViewId.PRESENTATIONS,
            mimeTypes: 'application/vnd.google-apps.presentation'
        });
        
        this.callback = callback;
        picker.setVisible(true);
    }

    showMultiTypePicker(callback) {
        const picker = new google.picker.PickerBuilder()
            .addView(google.picker.ViewId.DOCS)
            .addView(google.picker.ViewId.PRESENTATIONS)
            .setOAuthToken(this.authInstance.getAccessToken())
            .setCallback(this.handlePickerResponse.bind(this))
            .setOrigin(window.location.protocol + '//' + window.location.host)
            .build();
        
        this.callback = callback;
        picker.setVisible(true);
    }

    handlePickerResponse(data) {
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
            const documents = data[google.picker.Response.DOCUMENTS];
            const processedDocs = documents.map(doc => this.processDocument(doc));
            
            if (this.callback) {
                this.callback(processedDocs);
            }
        } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
            if (this.callback) {
                this.callback([]);
            }
        }
    }

    processDocument(doc) {
        return {
            id: doc.id,
            name: doc.name,
            type: this.getDocumentType(doc.mimeType),
            mimeType: doc.mimeType,
            url: doc.url,
            iconUrl: doc.iconUrl,
            lastEditedUtc: doc.lastEditedUtc,
            sizeBytes: doc.sizeBytes
        };
    }

    getDocumentType(mimeType) {
        if (mimeType.includes('presentation')) {
            return 'presentation';
        } else if (mimeType.includes('spreadsheet')) {
            return 'spreadsheet';
        } else if (mimeType.includes('form')) {
            return 'form';
        } else {
            return 'document';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GooglePicker;
}