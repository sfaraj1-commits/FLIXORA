/* ==========================================================================
   FLIXORA — Home View Dynamic Logic & Interactions
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initMoodSelector();
    renderContinueWatching();
    renderRecommended();
    renderTrending();
});

/* 1. Mood Selector Render & Filter Logic */
function initMoodSelector() {
    const container = document.getElementById("mood-selector-container");
    if (!container || !FLIXORA_DATABASE.moods) return;

    container.innerHTML = FLIXORA_DATABASE.moods.map((mood, index) => `
        <button class="btn btn-secondary mood-btn ${index === 0 ? 'active-mood' : ''}" 
                data-mood="${mood.id}" 
                onclick="handleMoodClick('${mood.id}', this)"
                style="padding: 0.75rem 1.6rem; border-radius: var(--radius-full); white-space: nowrap; cursor: pointer; transition: var(--transition);">
            <i class="fa-solid ${mood.icon}" style="color: var(--gold);"></i> ${mood.label}
        </button>
    `).join("");
}

function handleMoodClick(moodId, element) {
    document.querySelectorAll(".mood-btn").forEach(btn => {
        btn.style.background = "rgba(255, 255, 255, 0.05)";
        btn.style.borderColor = "var(--border-light)";
        btn.style.color = "var(--text-primary)";
    });

    element.style.background = "var(--gold)";
    element.style.borderColor = "var(--gold)";
    element.style.color = "#000";

    filterMoviesByMood(moodId);
}

function filterMoviesByMood(moodId) {
    const recommendedGrid = document.getElementById("recommended-grid");
    if (!recommendedGrid) return;

    const filtered = FLIXORA_DATABASE.movies.filter(m => m.moods && m.moods.includes(moodId));

    if (filtered.length === 0) {
        recommendedGrid.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">لا توجد نتائج مطابقة لمزاجك الحالي في العرض التجريبي.</p>`;
        return;
    }

    renderMovieGrid(recommendedGrid, filtered);
}

/* 2. Render Continue Watching Cards */
function renderContinueWatching() {
    const grid = document.getElementById("continue-watching-grid");
    if (!grid) return;

    const continueItems = [
        { ...FLIXORA_DATABASE.movies[0], progress: "65%", lastEpisode: "01:45:20" },
        { ...FLIXORA_DATABASE.movies[1], progress: "30%", lastEpisode: "00:42:10" }
    ];

    grid.innerHTML = continueItems.map(item => `
        <div class="movie-card" onclick="window.location.href='watch.html?id=${item.id}'">
            <img src="${item.poster}" alt="${item.title}">
            <div class="card-overlay">
                <span class="badge-gold" style="width: fit-content; margin-bottom: 0.4rem;">
                    <i class="fa-solid fa-play"></i> استكمال المشاهدة
                </span>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff;">${item.title}</h3>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.6rem;">المتبقي: ${item.lastEpisode}</span>
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${item.progress}; height: 100%; background: var(--gold); box-shadow: 0 0 10px var(--gold);"></div>
                </div>
            </div>
        </div>
    `).join("");
}

/* 3. Render Recommended Grid */
function renderRecommended() {
    const grid = document.getElementById("recommended-grid");
    if (!grid) return;
    renderMovieGrid(grid, FLIXORA_DATABASE.movies);
}

/* 4. Render Trending Grid */
function renderTrending() {
    const grid = document.getElementById("trending-grid");
    if (!grid) return;
    renderMovieGrid(grid, [...FLIXORA_DATABASE.movies, ...FLIXORA_DATABASE.series]);
}

/* Generic Movie Card Builder */
function renderMovieGrid(container, items) {
    container.innerHTML = items.map(item => `
        <div class="movie-card" onclick="window.location.href='${item.type === 'series' ? 'series-details.html' : 'movie-details.html'}?id=${item.id}'">
            <img src="${item.poster}" alt="${item.title}">
            <div class="card-overlay">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <span class="badge-gold"><i class="fa-solid fa-star"></i> ${item.rating}</span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">${item.year || ''}</span>
                </div>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.2rem;">${item.title}</h3>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${item.genres ? item.genres.join(' • ') : ''}</span>
            </div>
        </div>
    `).join("");
}