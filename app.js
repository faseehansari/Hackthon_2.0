// --- 1. SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = 'https://rrwbwvbretpqncuqojgi.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_q9iQPNkoLXYzOmdV7lUr_g_uPS5S-t1'; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');
    const submitBtn = document.getElementById('btn-login-submit');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Verifying Logins...';
            }

            try {
                console.log("Checking for:", email, password); // Console checking

                // Supabase database se email aur password check karna
                const { data: userProfile, error } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password); // Removed .single() temporarily for debugging

                if (error) {
                    throw error;
                }

                // Agar record hi na mile
                if (!userProfile || userProfile.length === 0) {
                    throw new Error('Invalid Email or Password! User record not found.');
                }

                // Pehla matched user record pakrein
                const user = userProfile[0];
                console.log("User found successfully:", user);

                // Browser session state me role store karein
                localStorage.setItem('userRole', user.role);

                // Role-based Access Routing
                if (user.role === 'user') {
                    window.location.href = 'report.html';
                } else if (user.role === 'maintenance') {
                    window.location.href = 'maintenance.html';
                } else if (user.role === 'admin') {
                    window.location.href = 'dashboard.html';
                }

            } catch (err) {
                console.error("Full Login Error:", err);
                alert('Login Failed: ' + err.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Secure Login';
                }
            }
        });
    }
});