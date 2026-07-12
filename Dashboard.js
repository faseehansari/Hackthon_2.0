// Strict Admin Guard
const currentRole = localStorage.getItem('userRole');
if (currentRole !== 'admin') {
    alert('Access Denied! Only Admin can access this page.');
    window.location.href = './index.html';
}
// --- 1. SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = 'https://rrwbwvbretpqncuqojgi.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q9iQPNkoLXYzOmdV7lUr_g_uPS5S-t1'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // --- 2. THEME TOGGLE LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // LocalStorage se saved theme check karein, nahi to default 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Theme Toggle Button Par Click Event
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

    // Icon Change Karne Ka Function
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

    // --- 3. DYNAMIC DATABASE METRICS & ALERTS LOGIC ---
    // DOM Counters Mapping
    const totalAssetsElem = document.getElementById('count-total-assets');
    const activeNodesElem = document.getElementById('count-active-nodes');
    const openTicketsElem = document.getElementById('count-open-tickets');
    const alertsTableBody = document.getElementById('dashboard-alerts-body');

    // Fetch counts and render stats
    async function loadDashboardMetrics() {
        try {
            // A. Fetch Total Assets Count
            const { count: totalAssets, error: totalErr } = await supabaseClient
                .from('assets')
                .select('*', { count: 'exact', head: true });
            
            if (totalErr) throw totalErr;
            if (totalAssetsElem) totalAssetsElem.textContent = totalAssets;

            // B. Fetch Active Nodes Count (Status: Operational)
            const { count: activeNodes, error: activeErr } = await supabaseClient
                .from('assets')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Operational');
            
            if (activeErr) throw activeErr;
            if (activeNodesElem) activeNodesElem.textContent = activeNodes;

            // C. Fetch Open Tickets Count (Status NOT equal to Resolved)
            const { count: openTickets, error: ticketErr } = await supabaseClient
                .from('tickets')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'Resolved');
            
            if (ticketErr) throw ticketErr;
            if (openTicketsElem) openTicketsElem.textContent = openTickets;

        } catch (err) {
            console.error('Error fetching dashboard counts:', err.message);
        }
    }

    // Load Critical Active Alerts Table
    async function loadActiveAlertsTable() {
        if (!alertsTableBody) return;

        try {
            // Get all tickets that are not resolved yet
            const { data: activeTickets, error } = await supabaseClient
                .from('tickets')
                .select('*')
                .neq('status', 'Resolved')
                .order('id', { ascending: false });

            if (error) throw error;

            alertsTableBody.innerHTML = '';

            if (activeTickets.length === 0) {
                alertsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: green; font-weight:600;">✅ System Nominal. No active alerts!</td></tr>`;
                return;
            }

            activeTickets.forEach(ticket => {
                const row = document.createElement('tr');
                
                // Priority badges setting
                let priorityClass = 'badge-warning';
                if (ticket.priority === 'High' || ticket.priority === 'Critical') priorityClass = 'badge-danger';

                // Status badges setting
                let statusClass = 'badge-warning';
                if (ticket.status === 'Reported') statusClass = 'badge-danger';

                row.innerHTML = `
                    <td><strong>${ticket.asset_code || '#AST-N/A'}</strong></td>
                    <td>${ticket.title}</td>
                    <td><span class="badge ${priorityClass}">${ticket.priority}</span></td>
                    <td><span class="badge ${statusClass}">${ticket.status}</span></td>
                `;
                alertsTableBody.appendChild(row);
            });

        } catch (err) {
            console.error('Error loading alerts table:', err.message);
        }
    }

    // Run dashboard core sequence
    loadDashboardMetrics();
    loadActiveAlertsTable();
});