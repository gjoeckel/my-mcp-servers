/**
 * Modal Manager - DRY, WCAG-compliant modal dialog system
 * 
 * RESPONSIBILITY: Unified modal management
 * - Create and show modals dynamically
 * - Handle focus management and keyboard trapping
 * - Provide consistent confirm/cancel actions
 * - WCAG 2.1 AA compliant
 */

class ModalManager {
  constructor() {
    this.currentModal = null;
    this.previousFocus = null;
    this.onConfirm = null;
    this.onCancel = null;
  }

  /**
   * Show an info modal with only a close button
   * @param {Object} config - Modal configuration
   * @param {string} config.title - Modal title
   * @param {string} config.content - Modal content (HTML string)
   * @param {Function} config.onClose - Optional callback when closed
   */
  showInfo(config) {
    const { title, content, onClose } = config;

    this.previousFocus = document.activeElement;
    this.onCancel = onClose;

    let modal = document.getElementById('infoModal');
    let overlay = document.getElementById('infoModalOverlay');

    if (!modal) {
      const modalHTML = `
        <div id="infoModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="infoModalTitle" aria-hidden="true">
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="infoModalTitle"></h2>
              <button class="close-modal" aria-label="Close dialog">×</button>
            </div>
            <div class="modal-body">
              <div id="infoModalContent"></div>
            </div>
          </div>
        </div>
        <div id="infoModalOverlay" class="modal-overlay" aria-hidden="true"></div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      modal = document.getElementById('infoModal');
      overlay = document.getElementById('infoModalOverlay');
    }

    // Update content
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalContent').innerHTML = content;

    // Show modal with overlay
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');

    const closeButton = modal.querySelector('.close-modal');
    setTimeout(() => closeButton.focus(), 100);

    // Setup handlers
    const handleClose = () => {
      this.hideModal();
      if (this.onCancel) this.onCancel();
    };

    // Clone to remove old listeners
    const newCloseButton = closeButton.cloneNode(true);
    closeButton.replaceWith(newCloseButton);

    newCloseButton.addEventListener('click', handleClose);
    overlay.addEventListener('click', handleClose);

    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    this.setupFocusTrap(modal);
    this.currentModal = modal;
  }

  /**
   * Show a confirmation modal with custom message and buttons
   * @param {Object} config - Modal configuration
   * @param {string} config.title - Modal title
   * @param {string} config.message - Modal message/description
   * @param {string} config.confirmText - Confirm button text (e.g., "Reset", "Delete")
   * @param {string} config.confirmColor - Confirm button color ("green" or "red")
   * @param {string} config.cancelText - Cancel button text (default: "Cancel")
   * @param {Function} config.onConfirm - Callback when confirmed
   * @param {Function} config.onCancel - Optional callback when cancelled
   */
  showConfirmation(config) {
    const {
      title,
      message,
      confirmText,
      confirmColor = 'green', // "green" or "red"
      cancelText = 'Cancel',
      onConfirm,
      onCancel
    } = config;

    // Store callbacks
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;

    // Store current focus to restore later
    this.previousFocus = document.activeElement;

    // Create modal if it doesn't exist, or reuse existing
    let modal = document.getElementById('confirmModal');
    let overlay = document.getElementById('confirmModalOverlay');

    if (!modal) {
      // Create modal structure
      const modalHTML = `
        <div id="confirmModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle" aria-describedby="confirmModalDescription" aria-hidden="true">
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="confirmModalTitle"></h2>
              <button class="close-modal" aria-label="Close dialog">×</button>
            </div>
            <div class="modal-body">
              <p id="confirmModalDescription"></p>
              <div class="modal-buttons">
                <button id="confirmModalCancel" class="modal-button modal-cancel-button"></button>
                <button id="confirmModalConfirm" class="modal-button modal-confirm-button"></button>
              </div>
            </div>
          </div>
        </div>
        <div id="confirmModalOverlay" class="modal-overlay" aria-hidden="true"></div>
      `;

      // Insert into DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      modal = document.getElementById('confirmModal');
      overlay = document.getElementById('confirmModalOverlay');
    }

    // Update modal content
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalDescription').textContent = message;

    const cancelButton = document.getElementById('confirmModalCancel');
    const confirmButton = document.getElementById('confirmModalConfirm');

    cancelButton.textContent = cancelText;
    confirmButton.textContent = confirmText;

    // Apply button colors (WCAG compliant)
    cancelButton.style.backgroundColor = '#333';
    cancelButton.style.color = 'white';

    if (confirmColor === 'green') {
      confirmButton.style.backgroundColor = '#336600'; // Green
      confirmButton.style.color = 'white';
    } else if (confirmColor === 'red') {
      confirmButton.style.backgroundColor = '#bf1712'; // Red
      confirmButton.style.color = 'white';
    }

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');

    // Set initial focus to Cancel button (safer default)
    setTimeout(() => {
      cancelButton.focus();
    }, 100);

    // Setup event handlers
    this.setupModalHandlers(modal, overlay, cancelButton, confirmButton);

    // Trap focus within modal
    this.setupFocusTrap(modal);

    this.currentModal = modal;
  }

  setupModalHandlers(modal, overlay, cancelButton, confirmButton) {
    // Remove old event listeners by cloning buttons
    const newCancelButton = cancelButton.cloneNode(true);
    const newConfirmButton = confirmButton.cloneNode(true);
    cancelButton.replaceWith(newCancelButton);
    confirmButton.replaceWith(newConfirmButton);

    // Get updated references
    const cancel = document.getElementById('confirmModalCancel');
    const confirm = document.getElementById('confirmModalConfirm');
    const closeButton = modal.querySelector('.close-modal');

    // Cancel actions
    const handleCancel = () => {
      this.hideModal();
      if (this.onCancel) this.onCancel();
    };

    cancel.addEventListener('click', handleCancel);
    closeButton.addEventListener('click', handleCancel);
    overlay.addEventListener('click', handleCancel);

    // Confirm action
    confirm.addEventListener('click', () => {
      // Execute callback BEFORE hiding modal (hideModal clears callbacks)
      if (this.onConfirm) {
        this.onConfirm();
      }
      this.hideModal();
    });

    // Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    modal.addEventListener('keydown', trapHandler);
    modal._focusTrapHandler = trapHandler; // Store for cleanup
  }

  hideModal() {
    if (!this.currentModal) return;

    // Hide both possible overlays
    const confirmOverlay = document.getElementById('confirmModalOverlay');
    const infoOverlay = document.getElementById('infoModalOverlay');

    this.currentModal.setAttribute('aria-hidden', 'true');
    if (confirmOverlay) confirmOverlay.setAttribute('aria-hidden', 'true');
    if (infoOverlay) infoOverlay.setAttribute('aria-hidden', 'true');

    // Remove focus trap
    if (this.currentModal._focusTrapHandler) {
      this.currentModal.removeEventListener('keydown', this.currentModal._focusTrapHandler);
    }

    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    this.currentModal = null;
    this.onConfirm = null;
    this.onCancel = null;
  }
}

// Global instance
window.modalManager = new ModalManager();
