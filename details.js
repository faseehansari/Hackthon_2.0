// --- 1. SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = 'https://rrwbwvbretpqncuqojgi.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q9iQPNkoLXYzOmdV7lUr_g_uPS5S-t1'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // --- 2. GET ASSET CODE FROM URL PARAMETERS ---
    const urlParams = new URLSearchParams(window.location.search);
    const assetCode = urlParams.get('code');

    if (!assetCode) {
        alert("URL mein koi asset code nahi mila!");
        window.location.href = "./assets.html";
        return;
    }

    // DOM Elements Mapping
    const headerCode = document.getElementById('asset-header-code');
    const nameElem = document.getElementById('asset-name');
    const locElem = document.getElementById('asset-location');
    const statusElem = document.getElementById('asset-status');
    const qrOutput = document.getElementById('qr-code-output');
    const copyBtn = document.getElementById('btn-copy-asset-link');

    // --- 3. FETCH ASSET FROM SUPABASE BY CODE ---
    try {
        const { data: asset, error } = await supabaseClient
            .from('assets')
            .select('*')
            .eq('code', assetCode)
            .single(); // Hamein single object chahiye

        if (error) throw error;

        if (asset) {
            // UI Update Sequence
            if (headerCode) headerCode.textContent = `Passport Node: ${asset.code}`;
            if (nameElem) nameElem.textContent = asset.name;
            if (locElem) locElem.textContent = asset.location;
            
            if (statusElem) {
                statusElem.textContent = asset.status;
                statusElem.className = 'badge'; // clear dynamic settings
                if (asset.status === 'Operational') {
                    statusElem.classList.add('badge-success');
                } else {
                    statusElem.classList.add('badge-danger');
                }
            }

            // --- 4. GENERATE DYNAMIC QR CODE ---
            if (qrOutput) {
                qrOutput.innerHTML = ''; // Loading static text reset
                
                // QR scan karne par click karne wale ko seedha is asset ke report page par bheja ja sake
                const scanUrl = `${window.location.origin}/report.html?preloadCode=${encodeURIComponent(asset.code)}`;
                
                new QRCode(qrOutput, {
                    text: scanUrl,
                    width: 160,
                    height: 160,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }

            // --- 5. COPY LINK BUTTON CONFIGURATION ---
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        const originalHtml = copyBtn.innerHTML;
                        copyBtn.innerHTML = `<i class="ri-check-line"></i> Copied Link!`;
                        setTimeout(() => {
                            copyBtn.innerHTML = originalHtml;
                        }, 2000);
                    }).catch(err => console.error("Link copy failed: ", err));
                });
            }
        }
    } catch (err) {
        console.error('Error fetching details from database:', err.message);
        alert('Database error or asset not found: ' + err.message);
    }
});