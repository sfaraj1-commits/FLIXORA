/* ==========================================================================
   FLIXORA — Admin Dashboard Interactivity Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardTable();

    const form = document.getElementById("add-movie-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            addNewMovie();
        });
    }
});

/* Load Movies Table dynamically */
function loadDashboardTable() {
    const tableBody = document.getElementById("dashboard-movies-table");
    if (!tableBody || typeof FLIXORA_DATABASE === "undefined") return;

    const allItems = [...FLIXORA_DATABASE.movies, ...FLIXORA_DATABASE.series];

    tableBody.innerHTML = allItems.map(item => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 0.8rem; display: flex; align-items: center; gap: 0.8rem;">
                <img src="${item.poster}" alt="${item.title}" style="width: 35px; height: 50px; object-fit: cover; border-radius: 4px;">
                <span style="font-weight: 600;">${item.title}</span>
            </td>
            <td style="padding: 0.8rem;">${item.type === 'series' ? 'مسلسل' : 'فيلم'}</td>
            <td style="padding: 0.8rem; color: var(--text-secondary);">${item.genre || 'عام'}</td>
            <td style="padding: 0.8rem; color: var(--gold);"><i class="fa-solid fa-star"></i> ${item.rating}</td>
            <td style="padding: 0.8rem;">
                <button onclick="deleteContent('${item.id}')" style="background: none; border: none; color: #ff4757; cursor: pointer;" title="حذف">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/* Modal Open/Close Controls */
function openAddMovieModal() {
    document.getElementById("add-movie-modal").style.display = "flex";
}

function closeAddMovieModal() {
    document.getElementById("add-movie-modal").style.display = "none";
}

/* Add New Item Handler */
function addNewMovie() {
    const title = document.getElementById("m-title").value;
    const type = document.getElementById("m-type").value;
    const genre = document.getElementById("m-genre").value;
    const rating = document.getElementById("m-rating").value;
    const poster = document.getElementById("m-poster").value;

    const newItem = {
        id: "custom-" + Date.now(),
        title,
        type,
        genre,
        rating,
        poster,
        description: "عمل سينمائي جديد تم إضافته حديثاً عبر لوحة التحكم."
    };

    if (type === 'series') {
        FLIXORA_DATABASE.series.unshift(newItem);
    } else {
        FLIXORA_DATABASE.movies.unshift(newItem);
    }

    closeAddMovieModal();
    loadDashboardTable();
    showToast("تمت إضافة المحتوى الجديد بنجاح!");
}

/* Delete Item Handler */
function deleteContent(id) {
    if (confirm("هل أنت تأكد من حذف هذا العمل من المنصة؟")) {
        FLIXORA_DATABASE.movies = FLIXORA_DATABASE.movies.filter(m => m.id !== id);
        FLIXORA_DATABASE.series = FLIXORA_DATABASE.series.filter(s => s.id !== id);
        loadDashboardTable();
        showToast("تم حذف المحتوى بنجاح");
    }
}

/* Tab Switching Logic */
function switchTab(tabName, element) {
    document.querySelectorAll(".dash-nav-link").forEach(link => link.classList.remove("active"));
    if (element) element.classList.add("active");
}

/* Toast Message Engine */
function showToast(msg) {
    const toast = document.createElement("div");
    toast.style.cssText = "position: fixed; bottom: 2rem; left: 2rem; background: var(--gold); color: #000; font-weight: 700; padding: 0.8rem 1.5rem; border-radius: var(--radius-sm); z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}