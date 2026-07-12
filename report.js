// User and Admin Guard
const currentRole = localStorage.getItem('userRole');
if (currentRole !== 'user' && currentRole !== 'admin') {
    alert('Access Denied! You do not have permission to view this page.');
    window.location.href = './index.html';
}
// --- 1. SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = 'https://rrwbwvbretpqncuqojgi.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q9iQPNkoLXYzOmdV7lUr_g_uPS5S-t1'; 

// Variable ka naam change kar ke supabaseClient kar diya taake conflict na ho
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // --- 2. GLOBAL THEME MANAGER ---
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

    // --- 3. DYNAMICALLY LOAD ASSETS FROM SUPABASE DB ---
    const assetSelect = document.getElementById('report-asset-select');

    async function loadAssetsFromSupabase() {
        try {
            // Corrected to use supabaseClient
            const { data: assets, error } = await supabaseClient
                .from('assets')
                .select('code, name');

            if (error) throw error;

            // Dropdown option loading sequence
            if (assets && assetSelect) {
                assetSelect.innerHTML = '<option value="" disabled selected>Select an asset...</option>';
                assets.forEach(asset => {
                    const option = document.createElement('option');
                    option.value = asset.code;
                    option.textContent = `${asset.name} (${asset.code})`;
                    assetSelect.appendChild(option);
                });
            }
        } catch (err) {
            console.error('Error fetching assets from Supabase:', err.message);
        }
    }

    // Initialize asset dropdown loading
    loadAssetsFromSupabase();

    // --- 4. FORM SUBMISSION WITH REAL DATABASE TRANSACTION ---
    const reportForm = document.getElementById('form-report-issue');

    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const selectedAssetCode = document.getElementById('report-asset-select').value;
            const titleInput = document.getElementById('report-title').value;
            const categoryInput = document.getElementById('report-category').value;
            const prioritySelect = document.getElementById('report-priority').value;
            const descInput = document.getElementById('report-desc').value;
            const submitBtn = reportForm.querySelector('.btn-primary');

            // Unique Ticket ID generator (e.g., TKT-123456)
            const uniqueTicketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

            if (submitBtn) {
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
            }

            try {
                // Corrected to use supabaseClient - Task A: Tickets table mein insert
                const { error: ticketError } = await supabaseClient
                    .from('tickets')
                    .insert([{
                        ticket_id: uniqueTicketId,
                        asset_code: selectedAssetCode,
                        title: titleInput,
                        category: categoryInput,
                        priority: prioritySelect,
                        description: descInput,
                        status: 'Reported',
                        reported_by: 'Alex Carter'
                    }]);

                if (ticketError) throw ticketError;

                // Corrected to use supabaseClient - Task B: Assets status update[cite: 1]
                const { error: assetUpdateError } = await supabaseClient
                    .from('assets')
                    .update({ status: 'Issue Reported' })
                    .eq('code', selectedAssetCode);

                if (assetUpdateError) throw assetUpdateError;

                console.log(`Ticket ${uniqueTicketId} created successfully!`);

                // Visual Success Feedback
                if (submitBtn) {
                    submitBtn.textContent = 'Dispatched to Database!';
                    submitBtn.style.backgroundColor = 'var(--success)';
                }

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.style.backgroundColor = 'var(--primary)';
                        submitBtn.disabled = false;
                    }
                    reportForm.reset();
                    // Successfully submit hone ke baad assets page par redirect
                    window.location.href = './assets.html';
                }, 1500);

            } catch (err) {
                console.error('Supabase Transaction Failed:', err.message);
                alert('Database Error: ' + err.message);
                if (submitBtn) {
                    submitBtn.textContent = 'Dispatch Incident Payload';
                    submitBtn.disabled = false;
                }
            }
        });
    }
});