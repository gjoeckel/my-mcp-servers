/**
 * Modal Actions - Unified modal confirmation logic
 * 
 * REPLACES:
 * - Modal logic scattered in buildPrinciples.js
 * - Modal logic scattered in main.js
 * 
 * RESPONSIBILITIES:
 * - Reset task confirmations
 * - Delete report row confirmations
 * - Unified modal wrapper around window.modalManager
 */

class ModalActions {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  /**
   * Show reset task confirmation modal
   * @param {string} taskId - The ID of the task to reset
   * @param {string} taskText - The text of the task (for display)
   * @param {HTMLElement} taskRow - The DOM row element
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  resetTask(taskId, taskText, taskRow) {
    return this.showModal({
      title: 'Reset Task',
      message: 'Do you want to reset this Task?',
      confirmText: 'Reset',
      confirmColor: 'green',
      onConfirm: () => {
        this.stateManager.resetTask(taskId, taskRow);
      }
    });
  }

  /**
   * Show delete report row confirmation modal
   * @param {string} rowId - The ID of the row to delete
   * @param {string} rowText - The text of the row (for display)
   * @param {HTMLElement} row - The DOM row element
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  deleteReportRow(rowId, rowText, row) {
    return this.showModal({
      title: 'Delete Task',
      message: 'Do you want to delete this Task?',
      confirmText: 'Delete',
      confirmColor: 'green',
      onConfirm: () => {
        this.stateManager.deleteReportRow(rowId, row);
      }
    });
  }

  /**
   * Unified modal display wrapper
   * @param {Object} options - Modal configuration
   * @param {string} options.title - Modal title
   * @param {string} options.message - Modal message
   * @param {string} options.confirmText - Confirm button text
   * @param {string} options.confirmColor - Confirm button color
   * @param {Function} options.onConfirm - Callback for confirmation
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  showModal(options) {
    return new Promise((resolve) => {
      if (!window.modalManager) {
        console.error('Modal manager not found');
        resolve(false);
        return;
      }

      window.modalManager.showConfirmation({
        title: options.title,
        message: options.message,
        confirmText: options.confirmText,
        confirmColor: options.confirmColor || 'green',
        cancelText: 'Cancel',
        onConfirm: () => {
          options.onConfirm();
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        }
      });
    });
  }
}

// Global instance (initialized after stateManager is ready)
window.modalActions = null;

// Initialize after DOM is ready and stateManager exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.unifiedStateManager) {
      window.modalActions = new ModalActions(window.unifiedStateManager);
      console.log('Modal Actions initialized');
    }
  });
} else {
  if (window.unifiedStateManager) {
    window.modalActions = new ModalActions(window.unifiedStateManager);
    console.log('Modal Actions initialized');
  }
}

export { ModalActions };

