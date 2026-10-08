/* ==========================================================================
   FLIXORA — Personal Watchlist Logic & Rendering Module
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderMyList('all');
});

let currentFilter = 'all';

function renderMyList(filterType) {
    const grid = document.getElementById("my-list-grid");
    const emptyView = document.getElementById("empty-list-view");
    if (!grid) return;

    // Fetch items from Database (or LocalStorage fallback)
    let listData = [];
    if (typeof FLIXORA_DATABASE !== "undefined") {
        listData = [...FLIXORA_DATABASE.movies, ...FLIXORA_DATABASE.series];
    }

    // Apply Filter
    if (filterType === 'movie') {
        listData = listData.filter(item => item.type === 'movie' || !item.episodes);
    } else if (filterType === 'series') {
        listData = listData.filter(item => item.type === 'series' || item.episodes);
    }

    if (listData.length === 0) {
        grid.style.display = "none";
        emptyView.style.display = "block";
        return;
    }

    grid.style.display = "grid";
    emptyView.style.display = "none";

    grid.innerHTML = listData.map(item => `
        <div class="movie-card-item" style="position: relative; background: rgba(18,20,26,0.6); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-light); transition: transform 0.3s ease;">
            
            <button class="movie-card-remove-btn" onclick="removeFromMyList('${item.id}', event)" title="إزالة من القائمة">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <a href="watch.html?id=${item.id}" style="text-decoration: none; color: inherit;">
                <div style="position: relative; aspect-ratio: 2/3; overflow: hidden;">
                    <img src="${item.poster}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.75rem; color: var(--gold); border: 1px solid var(--border-gold);">
                        <i class="fa-solid fa-star"></i> ${item.rating}
                    </div>
                </div>

                <div style="padding: 1rem;">
                    <h4 style="color: #fff; font-size: 0.98rem; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
                    <span style="color: var(--text-muted); font-size: 0.8rem;">${item.genre || 'سينما العالمية'}</span>
                </div>
            </a>
        </div>
    `).join('');
}

function filterMyList(type, btnElement) {
    currentFilter = type;
    document.querySelectorAll(".list-filter-btn").forEach(btn => btn.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
    renderMyList(type);
}

function removeFromMyList(itemId, event) {
    if (event) event.stopPropagation();
    
    // Simulate Removal Animation
    if (typeof FLIXORA_DATABASE !== "undefined") {
        FLIXORA_DATABASE.movies = FLIXORA_DATABASE.movies.filter(m => m.id !== itemId);
        FLIXORA_DATABASE.series = FLIXORA_DATABASE.series.filter(s => s.id !== itemId);
    }
    
    showToast("تمت إزالة العنصر من قائمتك المفضلة");
    renderMyList(currentFilter);
}

function clearMyList() {
    if (confirm("هل أنت تأكد من إخلاء قائمتك المفضلة بالكامل؟")) {
        if (typeof FLIXORA_DATABASE !== "undefined") {
            FLIXORA_DATABASE.movies = [];
            FLIXORA_DATABASE.series = [];
        }
        renderMyList(currentFilter);
        showToast("تم مسح القائمة بالكامل");
    }
}

function showToast(msg) {
    const toast = document.createElement("div");
    toast.style.cssText = "position: fixed; bottom: 2rem; left: 2rem; background: var(--gold); color: #000; font-weight: 700; padding: 0.8rem 1.5rem; border-radius: var(--radius-sm); z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}