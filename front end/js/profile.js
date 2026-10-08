/* ==========================================================================
   FLIXORA — Profile & Account Management Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // 1. جلب البروفايلات عند تحميل الصفحة
    await loadUserProfiles();

    // 2. معالجة مفاتيح التبديل (Toggles) وحفظ التفضيلات
    const toggles = document.querySelectorAll(".setting-toggle input");
    toggles.forEach(toggle => {
        toggle.addEventListener("change", async (e) => {
            const settingKey = e.target.id || 'preference';
            const isChecked = e.target.checked;

            try {
                // إرسال التحديث إلى الباك إند
                await apiFetch('/settings', {
                    method: 'POST',
                    body: JSON.stringify({ [settingKey]: isChecked })
                });
                showToast("تم حفظ التفضيلات الجديدة بنجاح");
            } catch (err) {
                console.error("فشل حفظ التفضيلات:", err);
                showToast("حدث خطأ أثناء حفظ التفضيلات");
            }
        });
    });
});

/* جلب البروفايلات من الباك إند وربط الضغط عليها */
async function loadUserProfiles() {
    try {
        const res = await apiFetch('/profiles');
        if (res.ok) {
            const profiles = await res.json();
            console.log("Profiles loaded:", profiles);
            bindProfileCards();
        } else if (res.status === 401) {
            window.location.href = "login.html";
        }
    } catch (err) {
        console.error("خطأ في الاتصال بالباك إند:", err);
    }
}

/* ربط الضغط على بطاقات البروفايلات */
function bindProfileCards() {
    const profileCards = document.querySelectorAll(".profile-card:not(.add-new)");
    profileCards.forEach(card => {
        card.addEventListener("click", () => {
            profileCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            const nameEl = card.querySelector("span") || card.querySelector("h3");
            const profileName = nameEl ? nameEl.innerText : "البروفايل";

            localStorage.setItem('flixora_current_user', profileName);
            showToast(`تم التبديل إلى ملف: ${profileName}`);
        });
    });
}

/* تسجيل الخروج الحقيقي عبر Laravel API */
async function logoutUser() {
    if (confirm("هل أنت تأكد من تسجيل الخروج من منصة FLIXORA؟")) {
        try {
            await apiFetch('/logout', { method: 'POST' });
        } catch (e) {
            console.warn("تعذر الوصول لرسالة تسجيل الخروج من السيرفر:", e);
        } finally {
            // مسح التوكن والبيانات المحلية والتحويل لصفحة الدخول
            localStorage.removeItem('flixora_token');
            localStorage.removeItem('flixora_current_user');
            localStorage.removeItem('flixora_current_avatar');
            window.location.href = "login.html";
        }
    }
}

/* Toast Message Engine (إشعارات منبثقة) */
function showToast(msg) {
    // إزالة أي إشعار سابق إن وجد
    const oldToast = document.querySelector(".flixora-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "flixora-toast";
    toast.style.cssText = "position: fixed; bottom: 2rem; left: 2rem; background: var(--gold, #d4af37); color: #000; font-weight: 700; padding: 0.8rem 1.5rem; border-radius: 8px; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: inherit;";
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}