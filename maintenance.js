// --- 1. SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = 'https://rrwbwvbretpqncuqojgi.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q9iQPNkoLXYzOmdV7lUr_g_uPS5S-t1'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const ticketsTableBody = document.getElementById('tickets-table-body');
    const updateForm = document.getElementById('form-update-maintenance');
    const ticketIdInput = document.getElementById('selected-ticket-id');
    const ticketLabel = document.getElementById('selected-ticket-label');
    const statusSelect = document.getElementById('maintenance-status');
    const notesTextarea = document.getElementById('diagnosis-notes');
    const submitBtn = document.getElementById('btn-update-status');
    
    // Global variable to track the current asset code of the selected ticket
    let currentAssetCode = '';

    // --- 2. FETCH AND DISPLAY TICKETS ---
    async function loadTickets() {
        if (!ticketsTableBody) return;

        try {
            const { data: tickets, error } = await supabaseClient
                .from('tickets')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;

            ticketsTableBody.innerHTML = '';

            if (tickets.length === 0) {
                ticketsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No tickets logged yet.</td></tr>`;
                return;
            }

            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                
                let badgeClass = 'badge-warning';
                if (ticket.status === 'Resolved') badgeClass = 'badge-success';
                if (ticket.status === 'Reported') badgeClass = 'badge-danger';

                row.innerHTML = `
                    <td><strong>${ticket.title}</strong></td>
                    <td>${ticket.category || 'N/A'}</td>
                    <td>${ticket.priority}</td>
                    <td><span class="badge ${badgeClass}">${ticket.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline select-ticket-btn" 
                                data-id="${ticket.id}" 
                                data-title="${ticket.title}" 
                                data-status="${ticket.status}"
                                data-asset-code="${ticket.asset_code || ''}"
                                data-notes="${ticket.description || ''}">
                            <i class="ri-edit-line"></i> Manage
                        </button>
                    </td>
                `;
                ticketsTableBody.appendChild(row);
            });

            // Add click events to all "Manage" buttons
            document.querySelectorAll('.select-ticket-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    const id = target.getAttribute('data-id');
                    const title = target.getAttribute('data-title');
                    const status = target.getAttribute('data-status');
                    const notes = target.getAttribute('data-notes');
                    currentAssetCode = target.getAttribute('data-asset-code'); // Track asset code

                    // Activate the form for the selected ticket
                    ticketIdInput.value = id;
                    ticketLabel.textContent = `Selected Ticket: "${title}" (ID: ${id})`;
                    statusSelect.value = status;
                    notesTextarea.value = notes;

                    // Enable inputs
                    statusSelect.disabled = false;
                    notesTextarea.disabled = false;
                    submitBtn.disabled = false;
                    
                    updateForm.scrollIntoView({ behavior: 'smooth' });
                });
            });

        } catch (err) {
            console.error('Error rendering tickets:', err.message);
        }
    }

    // --- 3. UPDATE TICKET AND ASSET STATUS IN DATABASE ---
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const ticketId = ticketIdInput.value;
            const updatedStatus = statusSelect.value;
            const updatedNotes = notesTextarea.value;

            if (!ticketId) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                // 1. Update ticket status
                const { error: ticketError } = await supabaseClient
                    .from('tickets')
                    .update({ 
                        status: updatedStatus,
                        description: updatedNotes 
                    })
                    .eq('id', ticketId);

                if (ticketError) throw ticketError;

                // 2. Dynamic Asset Sync (Agar Resolve ho gaya hai toh status Operational karo, warna Issue Reported)
                if (currentAssetCode) {
                    const nextAssetStatus = (updatedStatus === 'Resolved') ? 'Operational' : 'Issue Reported';
                    
                    const { error: assetError } = await supabaseClient
                        .from('assets')
                        .update({ status: nextAssetStatus })
                        .eq('code', currentAssetCode);

                    if (assetError) throw assetError;
                }

                alert('Ticket and Asset status successfully synced!');
                
                // Reset form fields
                updateForm.reset();
                ticketIdInput.value = '';
                ticketLabel.textContent = 'Select a ticket from the list above to update';
                statusSelect.disabled = true;
                notesTextarea.disabled = true;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Update Overhaul Status';

                // Reload layout
                loadTickets();

            } catch (err) {
                console.error('Failed to update status:', err.message);
                alert('Error updating database: ' + err.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Update Overhaul Status';
            }
        });
    }

    loadTickets();
});