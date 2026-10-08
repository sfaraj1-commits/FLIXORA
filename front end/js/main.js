/* ==========================================================================
   FLIXORA — Main General Controller & API Bridge
   ========================================================================== */

// 1. رابط الـ API الخاص بـ Laravel
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 2. دالة عامة لإرسال الطلبات للباك إند مع التعامل مع الأخطاء وتوفير توكن افتراضي للمعاينة
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('flixora_token') || 'demo_token_123';
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            console.warn(`API Request failed for ${endpoint}: Status ${response.status}`);
        }

        return response;
    } catch (error) {
        console.warn(`Backend Offline: Unable to reach ${API_BASE_URL}${endpoint}. Running in offline/demo mode.`);
        return {
            ok: false,
            json: async () => ({ message: "Backend unreachable", data: [] })
        };
    }
}

// 3. تأمين الجلسة افتراضياً لمنع التوجيه التلقائي غير المرغوب
(function initAuthGuard() {
    if (!localStorage.getItem('isLoggedIn')) {
        localStorage.setItem('isLoggedIn', 'true');
    }
    if (!localStorage.getItem('flixora_token')) {
        localStorage.setItem('flixora_token', 'demo_token_123');
    }
})();

// 4. تأثيرات الواجهة التشغيلية (UI Effects)
document.addEventListener("DOMContentLoaded", () => {
    console.log("🎬 FLIXORA Platform Initialized Successfully.");

    // Navbar Scroll Blur Effect
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(6, 6, 8, 0.95)";
                navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.8)";
            } else {
                navbar.style.background = "rgba(6, 6, 8, 0.85)";
                navbar.style.boxShadow = "none";
            }
        });
    }

    // تحديث صورة الشخصية تلقائياً في الهيدر إن وجدت
    const avatar = localStorage.getItem('flixora_current_avatar');
    if (avatar) {
        document.querySelectorAll('#header-avatar, #nav-profile-avatar').forEach(img => {
            img.src = avatar;
        });
    }
});