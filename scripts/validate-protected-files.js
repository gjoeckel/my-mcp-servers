const fs = require('fs');
const path = require('path');

// Store the original hash of checklist.css
let ORIGINAL_CHECKLIST_CSS_HASH = 'YOUR_ORIGINAL_HASH_HERE'; // Replace with actual hash after first run

function calculateFileHash(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function validateChecklistCSS() {
    const filePath = path.join(__dirname, '..', 'checklist.css');
    
    if (!fs.existsSync(filePath)) {
        console.error('Error: checklist.css not found');
        process.exit(1);
    }

    const currentHash = calculateFileHash(filePath);
    
    // If this is the first run, set the original hash
    if (ORIGINAL_CHECKLIST_CSS_HASH === 'YOUR_ORIGINAL_HASH_HERE') {
        console.log('Setting original hash for checklist.css');
        console.log('Please update the ORIGINAL_CHECKLIST_CSS_HASH in this file with:');
        console.log(currentHash);
        ORIGINAL_CHECKLIST_CSS_HASH = currentHash;
        return;
    }
    
    if (currentHash !== ORIGINAL_CHECKLIST_CSS_HASH) {
        console.error('Error: checklist.css has been modified');
        console.error('This file is protected and should not be changed');
        console.error('Please use multiple.css for new styles');
        process.exit(1);
    }
}

// Run validation
validateChecklistCSS(); 