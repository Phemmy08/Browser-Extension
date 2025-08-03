// Extensions data with their states
const extensions = [
    { id: 'devlens', name: 'DevLens', active: true },
    { id: 'stylespy', name: 'StyleSpy', active: true },
    { id: 'speedboost', name: 'SpeedBoost', active: false },
    { id: 'jsonwizard', name: 'JSONWizard', active: true },
    { id: 'tabmaster', name: 'TabMaster Pro', active: true },
    { id: 'viewportbuddy', name: 'ViewportBuddy', active: false },
    { id: 'markupnotes', name: 'Markup Notes', active: true },
    { id: 'gridguides', name: 'GridGuides', active: false },
    { id: 'palettepicker', name: 'Palette Picker', active: true },
    { id: 'linkchecker', name: 'LinkChecker', active: true },
    { id: 'domsnapshot', name: 'DOM Snapshot', active: false },
    { id: 'consoleplus', name: 'ConsolePlus', active: true }
];

// Current filter state
let currentFilter = 'all';

// Theme state
let isDarkMode = true;

// DOM elements
let tabButtons, extensionCards, toggleSwitches, removeButtons, settingsBtn;

// Initialize the app
function init() {
    // Get DOM elements
    tabButtons = document.querySelectorAll('.tab-btn');
    extensionCards = document.querySelectorAll('.extension-card');
    toggleSwitches = document.querySelectorAll('.toggle-switch');
    removeButtons = document.querySelectorAll('.remove-btn');
    settingsBtn = document.querySelector('.settings-btn');
    
    setupEventListeners();
    updateExtensionStates();
    filterExtensions('all');
    addCustomStyles();
    initializeTheme();
}

// Set up all event listeners
function setupEventListeners() {
    // Tab button listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.textContent.toLowerCase();
            setActiveTab(e.target);
            filterExtensions(filter);
        });
    });

    // Toggle switch listeners
    toggleSwitches.forEach((toggle, index) => {
        toggle.addEventListener('click', () => {
            toggleExtension(index);
        });
    });

    // Remove button listeners
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            removeExtension(index);
        });
    });

    // Settings button (theme toggle) listener
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            toggleTheme();
        });
    }
}

// Set active tab styling
function setActiveTab(activeButton) {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

// Filter extensions based on tab selection
function filterExtensions(filter) {
    currentFilter = filter;
    
    extensionCards.forEach((card, index) => {
        if (index >= extensions.length) return; // Safety check
        
        const extension = extensions[index];
        let shouldShow = true;

        if (filter === 'active') {
            shouldShow = extension.active;
        } else if (filter === 'inactive') {
            shouldShow = !extension.active;
        }

        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });

    updateTabCounts();
}

// Toggle extension active state
function toggleExtension(index) {
    if (index >= extensions.length) return; // Safety check
    
    const extension = extensions[index];
    const toggle = toggleSwitches[index];
    
    extension.active = !extension.active;
    
    if (extension.active) {
        toggle.classList.add('active');
    } else {
        toggle.classList.remove('active');
    }

    // Re-apply current filter to update visibility
    filterExtensions(currentFilter);
    
    // Show notification
    showNotification(`${extension.name} ${extension.active ? 'enabled' : 'disabled'}`);
}

// Remove extension
function removeExtension(index) {
    if (index >= extensions.length) return; // Safety check
    
    const extension = extensions[index];
    const card = extensionCards[index];
    
    // Confirmation dialog
    if (confirm(`Are you sure you want to remove ${extension.name}?`)) {
        card.style.animation = 'fadeOut 0.3s ease-in-out';
        
        setTimeout(() => {
            card.style.display = 'none';
            showNotification(`${extension.name} removed successfully`);
        }, 300);
    }
}

// Update extension states based on data
function updateExtensionStates() {
    toggleSwitches.forEach((toggle, index) => {
        if (index >= extensions.length) return;
        
        const extension = extensions[index];
        if (extension.active) {
            toggle.classList.add('active');
        } else {
            toggle.classList.remove('active');
        }
    });
}

// Update tab button counts
function updateTabCounts() {
    const activeCount = extensions.filter(ext => ext.active).length;
    const inactiveCount = extensions.filter(ext => !ext.active).length;
    const totalCount = extensions.length;

    // Update tab button text with counts
    tabButtons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        const originalText = btn.textContent.split(' (')[0]; // Remove existing count
        
        if (text.includes('all')) {
            btn.textContent = `${originalText} (${totalCount})`;
        } else if (text.includes('active')) {
            btn.textContent = `${originalText} (${activeCount})`;
        } else if (text.includes('inactive')) {
            btn.textContent = `${originalText} (${inactiveCount})`;
        }
    });
}

// Show notification
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize theme from localStorage or default to dark
function initializeTheme() {
    const savedTheme = localStorage.getItem('extensions-theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
    }
    applyTheme();
}

// Toggle between light and dark mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('extensions-theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
    showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`);
}

// Apply the current theme
function applyTheme() {
    const body = document.body;
    
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
}

// Add custom styles for animations and notifications
function addCustomStyles() {
    const additionalStyles = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 71, 87, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease-in-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .extension-card {
            transition: all 0.3s ease;
        }
        
        .extension-card.hidden {
            opacity: 0;
            transform: scale(0.95);
        }

        /* Light Mode Styles */
        body.light-mode {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            color: #1a202c;
        }

        body.light-mode .header {
            color: #1a202c;
        }

        body.light-mode .logo-text {
            color: #1a202c;
        }

        body.light-mode .section-title {
            color: #1a202c;
        }

        body.light-mode .settings-btn {
            background: rgba(0, 0, 0, 0.1);
        }

        body.light-mode .settings-btn:hover {
            background: rgba(0, 0, 0, 0.15);
        }

        body.light-mode .settings-btn svg {
            fill: rgba(0, 0, 0, 0.7);
        }

        body.light-mode .tab-btn {
            background: rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.7);
        }

        body.light-mode .tab-btn:hover {
            background: rgba(0, 0, 0, 0.15);
            color: rgba(0, 0, 0, 0.9);
        }

        body.light-mode .extension-card {
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }

        body.light-mode .extension-card:hover {
            background: rgba(255, 255, 255, 0.9);
            border-color: rgba(0, 0, 0, 0.2);
        }

        body.light-mode .extension-name {
            color: #1a202c;
        }

        body.light-mode .extension-description {
            color: rgba(0, 0, 0, 0.6);
        }

        body.light-mode .toggle-switch {
            background: rgba(0, 0, 0, 0.2);
        }

        body.light-mode .notification {
            background: rgba(255, 71, 87, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        /* Theme transition */
        body {
            transition: background 0.3s ease, color 0.3s ease;
        }

        .extension-card {
            transition: all 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }

        .settings-btn {
            transition: all 0.2s ease, background 0.3s ease;
        }

        .tab-btn {
            transition: all 0.2s ease, background 0.3s ease, color 0.3s ease;
        }

        .extension-name, .extension-description, .section-title, .logo-text {
            transition: color 0.3s ease;
        }
    `;
    
    // Inject additional styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + 1,2,3 for tab switching
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            if (tabButtons[tabIndex]) {
                tabButtons[tabIndex].click();
            }
        }
        
        // Escape to show all extensions
        if (e.key === 'Escape') {
            if (tabButtons[0]) {
                tabButtons[0].click(); // Click "All" tab
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupKeyboardShortcuts();
    
    // Initial notification
    setTimeout(() => {
        showNotification('Extensions Manager loaded successfully!');
    }, 500);
});

// Export functions for testing (optional)
if (typeof window !== 'undefined') {
    window.ExtensionsManager = {
        filterExtensions,
        toggleExtension,
        removeExtension,
        extensions
    };
}