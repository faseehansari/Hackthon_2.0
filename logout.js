// ==========================================
// 🛡️ MAINTANIQ AUTH GUARD & LOGOUT ENGINE
// ==========================================

// 1. PAGE LOAD HONE SE PEHLE SECURITY CHECK (Bina delay ke block karne ke liye)
(function() {
    const userRole = localStorage.getItem('userRole');
    
    // Agar user logged in nahi hai aur login page par bhi nahi hai, toh bhagao yahan se
    if (!userRole && !window.location.pathname.includes('login.html')) {
        window.location.href = './login.html';
    }
})();

// 2. DOMContentLoaded Events (Buttons aur Sidebar handles)
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    const logoutBtn = document.getElementById('btn-logout-id');

    // --- A. LOGOUT CLICK LOGIC ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Confirmation alert taake ghalti se click hone par direct logout na ho
            const confirmLogout = confirm('Are you sure you want to logout from MaintainIQ?');
            
            if (confirmLogout) {
                // Supabase local storage tokens aur roles clear karein
                localStorage.removeItem('userRole');
                
                // Supabase auth standard local entries ko bhi saaf kar dete hain
                for (let key in localStorage) {
                    if (key.startsWith('sb-')) {
                        localStorage.removeItem(key);
                    }
                }

                // Redirect back to login screen
                window.location.href = './index.html';
            }
        });
    }

    // --- B. SIDEBAR MENU FILTERING BASED ON ROLES ---
    // Taake kisi user ko woh link dikhe hi na jo uske liye blocked hai
    document.querySelectorAll('.sidebar-nav ul li a').forEach(link => {
        const href = link.getAttribute('href');
        
        if (userRole === 'user' && !href.includes('report.html')) {
            link.parentElement.style.display = 'none'; // User ko sirf report issue dikhe
        }
        if (userRole === 'maintenance' && !href.includes('maintenance.html')) {
            link.parentElement.style.display = 'none'; // Tech ko sirf maintenance dikhe
        }
        if (userRole === 'admin' && href.includes('maintenance.html')) {
            link.parentElement.style.display = 'none'; // Admin ko baki sab dikhe, maintenance nahi
        }
    });
});