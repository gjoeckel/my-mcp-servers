/**
 * buildPrinciples.js
 * 
 * This script is responsible for:
 * 1. Fetching the JSON data
 * 2. Generating principle sections dynamically
 * 3. Building tables for each principle
 */

// buildReportsSection import removed - reports now handled on separate page

// Old modal HTML removed - now using DRY modal-manager.js

// Table configuration
const TABLE_CONFIG = {
    headers: [
        { text: 'Tasks', class: 'task-cell' },
        { text: 'Info', class: 'info-cell' },
        { text: 'Notes', class: 'notes-cell' },
        { text: 'Status', class: 'status-cell' }
    ]
};

// State management functions
function saveState(id, state) {
    const currentState = getState() || {};
    currentState[id] = state;
    sessionStorage.setItem('checklistState', JSON.stringify(currentState));
}

function getState() {
    const state = sessionStorage.getItem('checklistState');
    return state ? JSON.parse(state) : null;
}

// Function to create a principle section
function createPrincipleSection(principleId, data) {
    const section = document.createElement('section');
    section.id = principleId;
    section.className = `principle-section ${principleId}`;

    // Create heading with number icon
    const heading = document.createElement('h2');
    heading.id = `${principleId}-caption`;
    
    // Set aria-label to combine table number and caption
    let tableNumber;
    if (principleId === 'checklist-1') {
        tableNumber = '1';
    } else if (principleId === 'checklist-2') {
        tableNumber = '2';
    } else if (principleId === 'checklist-3') {
        tableNumber = '3';
    } else if (principleId === 'checklist-4') {
        tableNumber = '4';
    } else {
        // Default to empty string if principle ID is not recognized
        tableNumber = '';
        console.warn(`Unknown principle ID: ${principleId}`);
    }
    
    // Only set aria-label if we have a valid table number
    if (tableNumber) {
        heading.setAttribute('aria-label', `Table ${tableNumber}: ${data.caption}`);
    } else {
        heading.setAttribute('aria-label', data.caption);
    }
    
    // Create container for heading content
    const headingContent = document.createElement('div');
    headingContent.className = 'heading-content';
    
    // Add number icon based on principle, but only if we have a valid table number
    if (tableNumber) {
        const numberIcon = document.createElement('img');
        numberIcon.alt = `table ${tableNumber}`;
        numberIcon.src = window.getImagePath(`number-${tableNumber}-1.svg`);
        numberIcon.width = 36;
        numberIcon.height = 36;
        headingContent.appendChild(numberIcon);
    }
    
    // Add caption text
    const captionText = document.createElement('span');
    captionText.textContent = data.caption;
  captionText.setAttribute('tabindex', '-1');
    
    // Assemble heading
    headingContent.appendChild(captionText);
    heading.appendChild(headingContent);
    section.appendChild(heading);

    // Create container
    const container = document.createElement('div');
    container.className = 'guidelines-container';
    section.appendChild(container);

    return section;
}

// Function to build table
function buildTable(rows, principleId) {
    const table = document.createElement('table');
    table.className = 'principles-table';
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Principles Checklist');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const taskHeader = document.createElement('th');
    taskHeader.className = 'task-cell';
    taskHeader.textContent = 'Tasks';
    
    const infoHeader = document.createElement('th');
    infoHeader.className = 'info-cell';
    infoHeader.textContent = 'Info';
    
    const notesHeader = document.createElement('th');
    notesHeader.className = 'notes-cell';
    notesHeader.textContent = 'Notes';
    
    const statusHeader = document.createElement('th');
    statusHeader.className = 'status-cell';
    statusHeader.textContent = 'Status';

    const restartHeader = document.createElement('th');
    restartHeader.className = 'restart-cell';
    restartHeader.textContent = 'Reset';
    
    headerRow.appendChild(taskHeader);
    headerRow.appendChild(infoHeader);
    headerRow.appendChild(notesHeader);
    headerRow.appendChild(statusHeader);
    headerRow.appendChild(restartHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    tbody.setAttribute('role', 'rowgroup');

    // Add rows for each principle
    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        tr.setAttribute('data-id', row.id);
        tr.className = 'principle-row';
        tbody.appendChild(tr);

        // Add cells in correct order
        const cells = [
            { text: row.task, className: 'task-cell' },
            { className: 'info-cell' },
            { className: 'notes-cell' },
            { className: 'status-cell' },
            { className: 'restart-cell' }
        ];

        cells.forEach(cell => {
            const td = document.createElement('td');
            td.className = cell.className;
            td.setAttribute('role', 'cell');
            tr.appendChild(td);

            if (cell.text) {
                td.textContent = cell.text;
            }
        });

        // Add info links to info cell
        const infoCell = tr.querySelector('.info-cell');
        const infoButton = document.createElement('button');
        infoButton.className = 'info-link';
        infoButton.setAttribute('aria-label', `Show example for ${row.task}`);
        
        const infoImg = document.createElement('img');
        infoImg.src = window.getImagePath('info0.svg');
        infoImg.alt = '';
        infoButton.appendChild(infoImg);
        
        // Add hover and focus event listeners
        infoButton.addEventListener('mouseenter', () => {
            infoImg.src = window.getImagePath('info1.svg');
        });
        
        infoButton.addEventListener('mouseleave', () => {
            infoImg.src = window.getImagePath('info0.svg');
        });
        
        infoButton.addEventListener('focus', () => {
            infoImg.src = window.getImagePath('info1.svg');
        });
        
        infoButton.addEventListener('blur', () => {
            infoImg.src = window.getImagePath('info0.svg');
        });

        // Add click handler for modal
        infoButton.addEventListener('click', () => {
            // --- Modal Retrieval ---
            const modal = document.getElementById('infoModal');
            const overlay = document.getElementById('modalOverlay');
            const modalTitle = document.getElementById('modalTitle');
            const closeButton = modal.querySelector('.close-modal');
            const modalContent = modal.querySelector('.modal-content');
            // --- End Modal Retrieval ---

            // Truncate title at last complete word within character limit
            const maxLength = 50; // Adjust this value as needed
            const words = row.task.split(' ');
            let truncatedTitle = '';
            
            for (const word of words) {
                if ((truncatedTitle + ' ' + word).length <= maxLength) {
                    truncatedTitle += (truncatedTitle ? ' ' : '') + word;
                } else {
                    break;
                }
            }
            
            // Update modal content
            modalTitle.textContent = truncatedTitle;
            modalTitle.classList.add('visible');

            // Set ARIA attributes
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'modalTitle');
            modal.setAttribute('aria-describedby', 'modalContent');
            modal.setAttribute('aria-hidden', 'false');
            
            // Set overlay attributes
            overlay.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('role', 'presentation');

            // Show modal and overlay
            modal.style.display = 'block';
            overlay.style.display = 'block';

            // Focus management
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            // Focus close button
            closeButton.focus();

            // Handle close button click
            const closeModal = () => {
                modal.setAttribute('aria-hidden', 'true');
                overlay.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
                overlay.style.display = 'none';
                infoButton.focus(); // Return focus to the button that opened the modal
            };

            closeButton.onclick = closeModal;
            overlay.onclick = closeModal;

            // Handle keyboard navigation
            const handleKeyDown = (event) => {
                if (event.key === 'Escape') {
                    closeModal();
                } else if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            event.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            event.preventDefault();
                            firstFocusableElement.focus();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            // Clean up event listeners when modal is closed
            const cleanup = () => {
                document.removeEventListener('keydown', handleKeyDown);
                closeButton.removeEventListener('click', cleanup);
                overlay.removeEventListener('click', cleanup);
            };

            closeButton.addEventListener('click', cleanup, { once: true });
            overlay.addEventListener('click', cleanup, { once: true });
        });
        
        infoCell.appendChild(infoButton);

        // Add notes textarea
        const notesCell = tr.querySelector('.notes-cell');
        const textarea = document.createElement('textarea');
        textarea.className = 'notes-textarea';
        textarea.setAttribute('aria-label', `Notes for ${row.task}`);
        textarea.id = `textarea-${row.id}`;
        notesCell.appendChild(textarea);

        // Add status button
        const statusCell = tr.querySelector('.status-cell');
        const statusButton = document.createElement('button');
        statusButton.className = 'status-button';
        statusButton.setAttribute('data-state', 'pending');
        statusButton.setAttribute('aria-label', 'Task status: Pending');
        statusButton.setAttribute('data-id', row.id);
        statusButton.id = `status-${row.id}`;
        const pendingImgPath = window.getImagePath('pending.svg');
        statusButton.innerHTML = `<img src="${pendingImgPath}" alt="">`;
        statusCell.appendChild(statusButton);

        // Add restart button
        const restartCell = tr.querySelector('.restart-cell');
        const restartButton = document.createElement('button');
        restartButton.className = 'restart-button';
        restartButton.type = 'button';
        restartButton.setAttribute('aria-label', 'Reset task to pending');
        restartButton.setAttribute('data-id', row.id);
        restartButton.id = `restart-${row.id}`;
        const restartImgPath = window.getImagePath('restart.svg');
        restartButton.innerHTML = `<img src="${restartImgPath}" alt="Reset task" width="36" height="36">`;
        restartButton.style.display = 'none'; // Initially hidden
        restartCell.appendChild(restartButton);

        // Event handlers removed - now handled by StateEvents.js global event delegation
        // Status button clicks, textarea input, and reset button clicks are managed centrally
    });

    table.appendChild(tbody);
    
    // Create Add Row button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'principles-buttons';
    
    // Create Add Row button
    const addButton = document.createElement('button');
    addButton.className = 'principles-button';
    addButton.id = `addRow-${principleId}`;
    addButton.setAttribute('data-principle', principleId);
    addButton.setAttribute('aria-label', `Add new task to ${principleId}`);
    
    // Create image element with color-coded icon for each checklist
    const img = document.createElement('img');
    const iconMap = {
        'checklist-1': 'add-1.svg', // Blue
        'checklist-2': 'add-2.svg', // Green
        'checklist-3': 'add-3.svg', // Orange
        'checklist-4': 'add-4.svg'  // Dark Blue/Purple
    };
    
    const iconName = iconMap[principleId] || 'add0.svg';
    img.src = window.getImagePath ? window.getImagePath(iconName) : `/images/${iconName}`;
    img.alt = 'Add Row';
    addButton.appendChild(img);
    
    // Add button to container
    buttonContainer.appendChild(addButton);
    
    // Event listener will be attached by initializePrincipleAddRowButtons() in addRow.js
    // This ensures proper initialization timing and prevents duplicate event listeners
    
    // Create wrapper div to contain both table and button
    const wrapper = document.createElement('div');
    wrapper.className = 'principles-table-wrapper';
    wrapper.appendChild(table);
    wrapper.appendChild(buttonContainer);
    
    return wrapper;
}

/**
 * Handles adding a new row to a principles table
 * @param {string} principleId - The ID of the principle (e.g., 'checklist-1')
 */
function handleAddPrincipleRow(principleId) {
    console.log(`Adding new row to ${principleId}`);
    
    if (!window.unifiedStateManager) {
        console.error('StateManager not available - cannot add principle row');
        return;
    }
    
    // Use StateManager method for consistent data creation
    const newRowData = window.unifiedStateManager.createPrincipleRowData({
        principleId: principleId,
        task: '',
        notes: '',
        status: 'pending',
        isManual: true
    });
    
    // Add using StateManager method
    window.unifiedStateManager.addPrincipleRow(newRowData, true);
    
    // Set focus on the task textarea for manual rows
    setTimeout(() => {
        const currentTable = document.querySelector(`#${principleId} .principles-table tbody`);
        if (currentTable) {
            const newRow = currentTable.querySelector(`tr[data-id="${newRowData.id}"]`);
            if (newRow) {
                const taskTextarea = newRow.querySelector('.task-input');
                if (taskTextarea) {
                    taskTextarea.focus();
                }
            }
        }
    }, 100);
}

// Make function globally available
window.handleAddPrincipleRow = handleAddPrincipleRow;

// createReportSection function removed - reports now handled on separate page

// storeCompletedTask function removed - now handled by StateEvents.js

// Function to build all content
async function buildContent(data) {
    console.log('Starting to build content');
    try {
        console.log('Building content with data:', data);
        
        const main = document.querySelector('main');
        if (!main) {
            throw new Error('Main element not found');
        }
        console.log('Found main element:', main);
        
        // Clear existing content
        console.log('Clearing existing content');
        main.innerHTML = '';

        // Create principle sections
        console.log('Creating principle sections');
        Object.entries(data).forEach(([principleId, principleData]) => {
            if (principleId !== 'report' && principleId !== 'type' && principleId !== 'showRobust') {  // Skip report section, type field, and showRobust flag
                console.log(`Creating section for principle: ${principleId}`);
                const section = createPrincipleSection(principleId, principleData);
                if (section) {
                    console.log(`Building table for principle: ${principleId}`);
                    const tableWrapper = buildTable(principleData.table, principleId);
                    section.querySelector('.guidelines-container').appendChild(tableWrapper);
                    main.appendChild(section);
                    console.log(`Section for ${principleId} added to main`);
                }
            }
        });

        // Add Report section (consistent across all checklist types)
        // TEMPORARILY COMMENTED OUT - Report functionality is interfering with principle rows
        // console.log('Adding Report section');
        // const reportSection = createReportSection();
        // main.appendChild(reportSection);
        // console.log('Report section added to main');

        // Dispatch event to signal content is built
        console.log('Content built, dispatching contentBuilt event');
        const contentBuiltEvent = new CustomEvent('contentBuilt');
        document.dispatchEvent(contentBuiltEvent);
        console.log('contentBuilt event dispatched');

    } catch (error) {
        console.error('Error building content:', error);
        throw error; // Re-throw to be caught by initializeApp
    }
}

// Export the function
export { buildContent }; 