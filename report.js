document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GLOBAL THEME MANAGER ---
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

    // --- 2. FORM INTERACTION & SUBMISSION ---
    const reportForm = document.getElementById('form-report-issue');

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Page reload ko rokne ke liye

            // Form data values extract kar rahe hain
            const titleInput = reportForm.querySelector('.form-input').value;
            const prioritySelect = reportForm.querySelector('.form-select').value;
            const submitBtn = reportForm.querySelector('.btn-primary');

            // Payload structure banate hain
            const incidentPayload = {
                title: titleInput,
                priority: prioritySelect,
                timestamp: new Date().toISOString(),
                reportedBy: 'Alex Carter'
            };

            console.log('Dispatching Incident Payload:', incidentPayload);

            // Submission visual feedback
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Payload Dispatched!';
                submitBtn.style.backgroundColor = 'var(--success)';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = 'var(--primary)';
                    submitBtn.disabled = false;
                    reportForm.reset(); // Form clear karne ke liye
                }, 2500);
            }
        });
    }
});