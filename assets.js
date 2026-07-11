document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME INITIALIZATION & TOGGLE ---
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

    // --- 2. LIVE SEARCH FILTERING ---
    const searchInput = document.getElementById('asset-search-input');
    const tableBody = document.getElementById('asset-table-body');

    if (searchInput && tableBody) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                // Table data cells extract kar rahe hain
                const assetName = row.cells[0]?.textContent.toLowerCase() || '';
                const assetCode = row.cells[1]?.textContent.toLowerCase() || '';
                const assetLocation = row.cells[2]?.textContent.toLowerCase() || '';

                // Matching logic
                if (assetName.includes(searchTerm) || 
                    assetCode.includes(searchTerm) || 
                    assetLocation.includes(searchTerm)) {
                    row.style.display = ''; // Show row
                } else {
                    row.style.display = 'none'; // Hide row
                }
            }
        });
    }
});