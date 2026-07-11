document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // 1. LocalStorage se saved theme check karein, nahi to default 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // 2. Theme Toggle Button Par Click Event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Theme apply karein aur save karein
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Icon badlein
            updateThemeIcon(newTheme);
        });
    }

    // 3. Icon Change Karne Ka Function
    function updateThemeIcon(theme) {
        const icon = themeToggleBtn?.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'ri-sun-line'; // Dark mode me Sun icon dikhane ke liye
            } else {
                icon.className = 'ri-moon-line'; // Light mode me Moon icon dikhane ke liye
            }
        }
    }
});