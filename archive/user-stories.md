Now I have a complete picture of the save/restore functionality. Here are the comprehensive user stories based on the actual implementation:

> SRD note: Until manual save is verified, auto‑save is explicitly disabled (see Story 11).

Status: Auto-save gated = yes (manual save-first). See implementation plan in `refine-save-restore.md`.

Related: API contract and rollback are defined in `refine-save-restore.md`.

## **Primary Save/Restore User Stories**

### **Story 1: Automatic Session Creation**
**As a** new user visiting the accessibility checklist  
**I want** the system to create a session automatically  
**So that** my work is saved without requiring any setup  

**Acceptance Criteria:**
- If no session parameter exists, system defaults to '000'
- If session is invalid (wrong length/characters), system generates a new 3-character alphanumeric ID
- Session ID is uppercase and alphanumeric only
- URL parameters are processed to extract session information
- Session ID is used for all save/restore operations

### **Story 2: Progressive Data Restoration**
**As a** returning user  
**I want** my previous work to be restored gradually as the page loads  
**So that** I can see my progress being rebuilt and don't lose context  

**Acceptance Criteria:**
- Loading overlay shows "Loading your checklist..." during restoration
- System waits for DOM elements to be available before restoring
- Textareas are restored with retry logic (up to 10 attempts every 500ms)
- Status icons are restored with their correct states and images
- Restart buttons visibility is restored for completed tasks
- Side panel state (expanded/collapsed and active section) is restored
- System scrolls to the last active section automatically
- Loading overlay is dismissed after restoration completes

### **Story 3: Automatic Save During Interaction**
**As a** user working on tasks  
**I want** my changes to be saved automatically as I work  
**So that** I never lose progress due to unexpected issues  

**Acceptance Criteria:**
- Auto-save triggers after 1 second of inactivity (debounced)
- Saves trigger when I type in notes textareas
- Saves trigger when I change task status
- Saves trigger when I toggle side panel
- Saves trigger when I click on different sections
- Auto-saves are silent (no user notification)
- System marks session as "dirty" when changes occur

### **Story 4: Manual Save with Feedback**
**As a** user who wants control over saving  
**I want** to manually save my work and get confirmation  
**So that** I know my work is definitely saved at important moments  

**Acceptance Criteria:**
- Save button appears in header when functionality initializes
- Clicking Save button triggers immediate save
- Save button shows "aria-busy=true" during save operation
- Footer status shows "Saved" message for 3 seconds after manual save
- Save button is reset after successful save
- Error messages appear in footer for failed saves
 - API response must have `success === true` (see API contract); failures keep dirty state and prompt retry

### **Story 5: Report Table State Management**
**As a** user building a report  
**I want** all my report entries to be saved and restored accurately  
**So that** I can continue building my compliance documentation  

**Acceptance Criteria:**
- Report table state is maintained in `window.reportTableState.rows`
- Each row includes: id, date, task, notes, isManual, status, taskDisabled, notesDisabled
- Manual rows can be added with today's date automatically
- Manual rows start with empty task/notes and "pending" status
- Manual rows can be deleted by clicking delete button
- Completed tasks from principles automatically appear in report
- Status changes in report rows trigger immediate save
- Report table re-renders when state changes

### **Story 6: Task Completion Workflow**
**As a** user marking tasks complete  
**I want** completed tasks to automatically flow to my report  
**So that** I can track my accomplished work  

**Acceptance Criteria:**
- When I mark a principle task as "completed", it appears in report table
- Completed tasks in report show completion date
- Completed tasks preserve task description and my notes
- Duplicate entries are prevented (same task ID cannot appear twice)
- Manual report entries can be marked completed with status button
- Completed manual entries become read-only with overlay text
- Status cycling works: pending → in-progress → completed

### **Story 7: Session Data Persistence**
**As a** user with a specific session ID  
**I want** all my data to persist across browser sessions  
**So that** I can return to my work later  

**Acceptance Criteria:**
- Data is saved to PHP backend using session key
- Save data includes: textareas, reportRows, statusIcons, visibleRestartButtons, sidePanelState
- Timestamp and checklist type are included in save data
- Data format is JSON with consistent structure
- Session key validation ensures 3-character alphanumeric format
- Save directory is created automatically if it doesn't exist

### **Story 8: Error Handling and Recovery**
**As a** user experiencing technical issues  
**I want** clear feedback when saves fail  
**So that** I know when my work might not be saved  

**Acceptance Criteria:**
- Network errors show "Error saving changes" in footer
- Save failures are logged to console for debugging
- StatusManager displays persistent error messages
- Save button indicates error state when saves fail
- System gracefully handles missing DOM elements during restore
- Retry logic handles timing issues with dynamic content
- Loading overlay shows appropriate error messages

### **Story 9: Side Panel State Preservation**
**As a** user navigating between sections  
**I want** my navigation state to be remembered  
**So that** I return to where I was working  

**Acceptance Criteria:**
- Side panel expanded/collapsed state is saved
- Active section (which link is highlighted) is saved
- Visual state of navigation icons matches saved state
- System scrolls to saved active section on restore
- Side panel toggles trigger auto-save
- Navigation between sections triggers auto-save

### **Story 10: Unsaved Changes Protection**
**As a** user with unsaved changes  
**I want** to be warned before leaving the page  
**So that** I don't accidentally lose my work  

**Acceptance Criteria:**
- Browser shows "beforeunload" prompt when `isDirty` is true
- Dirty state is set when content changes
- Dirty state is cleared after successful save
- Warning appears for page refresh, navigation, or tab close
- Manual saves clear the dirty state immediately

### **Story 11: Auto‑Save Gated Behind Manual Save**
**As a** developer maintaining reliability  
**I want** auto‑save disabled until manual save is proven  
**So that** we avoid compounding failures and keep the flow simple and reliable

**Acceptance Criteria:**
- Auto‑save timers and listeners are disabled by default.
- Manual save (happy and failure paths) passes all unit and integration tests.
- A single feature flag enables auto‑save after manual save passes (documented in refine-save-restore.md).
- Enabling auto‑save does not change the manual save UX contract.

## **Critical Technical Issues Identified**

### **Multiple Path Configuration Systems**
The save-restore.js file shows the same path duplication issues:
- Line 307: Uses complex ternary fallback pattern for API paths
- Lines 366, 418: Uses same complex pattern for image paths
- This contradicts the path utility consolidation you're implementing

### **Missing Event Delegation**
Lines 753-798 contain commented-out event delegation code that appears to be critical for auto-save functionality. This suggests the auto-save may not be working properly for principle table interactions.

### **Race Condition Issues**
The retry logic (lines 343-365) indicates timing problems between content building and restoration, suggesting the load order issues I identified earlier are causing real user experience problems.

These user stories reflect the actual implementation and reveal that while the save/restore system is comprehensive, it's suffering from the same DRY violations and technical debt identified in your analysis.