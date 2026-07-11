document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GLOBAL PREFERENCE THEME STATE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn?.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'ri-sun-line';
            } else {
                icon.className = 'ri-moon-line';
            }
        }
    }

    // --- 2. INTERACTIVE SUBMISSION ENGINE INTERCEPTOR ---
    const ledgerForm = document.querySelector('.interactive-form');
    
    if (ledgerForm) {
        ledgerForm.addEventListener('submit', () => {
            const notesArea = ledgerForm.querySelector('textarea').value;
            console.log('Dispatching Field Logs to Core Engine:', {
                notes: notesArea,
                timestamp: new Date().toLocaleTimeString()
            });
            // Native inline form trigger operates automatically right after this intercept
        });
    }
});