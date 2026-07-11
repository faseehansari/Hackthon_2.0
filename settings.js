document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CORE THEME CONTROLLER ---
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

    // --- 2. SWITCH INTERACTION HANDLER ---
    const aiToggleInput = document.querySelector('.switch-toggle-widget input[type="checkbox"]');

    if (aiToggleInput) {
        // Toggle input validation change event handle karne ke liye
        aiToggleInput.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            console.log(`Automated Failure AI Routing state altered to: ${isChecked}`);
            
            // Yahan aap chaho toh localstorage me status key save bhi kar sakte ho:
            localStorage.setItem('ai_routing_enabled', isChecked);
        });

        // App loading state injection mapping from storage
        const savedAiState = localStorage.getItem('ai_routing_enabled');
        if (savedAiState !== null) {
            aiToggleInput.checked = (savedAiState === 'true');
        }
    }
});