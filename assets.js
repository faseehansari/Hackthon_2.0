// --- 1. SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = 'https://rrwbwvbretpqncuqojgi.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q9iQPNkoLXYzOmdV7lUr_g_uPS5S-t1'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // --- 2. MODAL CONTROLS (OPEN / CLOSE FORM) ---
    const modal = document.getElementById('add-asset-modal');
    const openModalBtn = document.getElementById('open-add-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
    }
    [closeModalBtn, cancelModalBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', () => modal.style.display = 'none');
    });

    // --- 3. UI SE NAYA ASSET ADD KARNA ---
    const addAssetForm = document.getElementById('form-add-asset');

    if (addAssetForm) {
        addAssetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const assetName = document.getElementById('asset-name').value;
            const assetLocation = document.getElementById('asset-location').value;
            const submitBtn = addAssetForm.querySelector('button[type="submit"]');

            // Unique Asset Code generator (e.g., #AST-8472)
            const randomCode = '#AST-' + Math.floor(1000 + Math.random() * 9000);

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Adding Asset...';
            }

            try {
                const { error } = await supabaseClient
                    .from('assets')
                    .insert([{
                        code: randomCode,
                        name: assetName,
                        location: assetLocation,
                        status: 'Operational'
                    }]);

                if (error) throw error;

                modal.style.display = 'none'; // Form close karein
                addAssetForm.reset();
                loadAssetsTable(); // Live refresh table

            } catch (err) {
                console.error('Failed to add asset:', err.message);
                alert('Error adding asset: ' + err.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Asset';
                }
            }
        });
    }

    // --- 4. DATABASE SE ASSETS FETCH KARKE TABLE MEIN DIKHANA ---
    const assetsTableBody = document.getElementById('assets-table-body');

    async function loadAssetsTable() {
        if (!assetsTableBody) return;

        try {
            const { data: assets, error } = await supabaseClient
                .from('assets')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;

            assetsTableBody.innerHTML = '';

            assets.forEach(asset => {
                const row = document.createElement('tr');
                
                let statusClass = 'badge-success';
                if (asset.status === 'Issue Reported') statusClass = 'badge-danger';

                // UPDATE: Yahan href ko dynamic bana diya hai taake URL mein code chala jaye
                row.innerHTML = `
                    <td><strong>${asset.name}</strong></td>
                    <td><code>${asset.code}</code></td>
                    <td>${asset.location}</td>
                    <td><span class="badge ${statusClass}">${asset.status}</span></td>
                    <td><a href="details.html?code=${encodeURIComponent(asset.code)}" class="btn btn-sm btn-outline"><i class="ri-qr-code-line"></i> View QR</a></td>
                `;
                assetsTableBody.appendChild(row);
            });

        } catch (err) {
            console.error('Error rendering assets table:', err.message);
        }
    }

    loadAssetsTable();
});