document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GLOBAL THEME SYNC ---
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

    // --- 2. CLIPBOARD COPY FUNCTIONALITY ---
    const copyLinkBtn = document.getElementById('btn-copy-asset-link');

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const currentURL = window.location.href;

            navigator.clipboard.writeText(currentURL).then(() => {
                // Button state updates temporarily to show success
                const originalText = copyLinkBtn.innerHTML;
                copyLinkBtn.innerHTML = '<i class="ri-checkbox-circle-line"></i> Copied!';
                copyLinkBtn.style.backgroundColor = 'var(--success)';
                
                setTimeout(() => {
                    copyLinkBtn.innerHTML = originalText;
                    copyLinkBtn.style.backgroundColor = 'var(--primary)';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy link: ', err);
            });
        });
    }
});