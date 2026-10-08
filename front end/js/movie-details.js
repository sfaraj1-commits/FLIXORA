/* ==========================================================================
   FLIXORA — Movie Details View Dynamic Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id") || "m1"; // افتراضي m1

    const movie = getMovieById(movieId);
    if (movie) {
        populateMovieDetails(movie);
    }
});

function getMovieById(id) {
    if (typeof FLIXORA_DATABASE === "undefined" || !FLIXORA_DATABASE.movies) return null;
    return FLIXORA_DATABASE.movies.find(m => String(m.id) === String(id)) || FLIXORA_DATABASE.movies[0];
}

function populateMovieDetails(movie) {
    // 1. Header & Info Elements
    document.title = `FLIXORA — ${movie.title || "تفاصيل الفيلم"}`;

    const heroElem = document.getElementById("movie-hero");
    if (heroElem) {
        heroElem.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    }

    const posterElem = document.getElementById("movie-poster");
    if (posterElem) {
        posterElem.src = movie.poster;
        posterElem.alt = movie.title || "Movie Poster";
    }

    const titleElem = document.getElementById("movie-title");
    if (titleElem) titleElem.innerText = movie.title || "عنوان غير متوفر";

    const ratingElem = document.getElementById("movie-rating");
    if (ratingElem) ratingElem.innerHTML = `<i class="fa-solid fa-star"></i> ${movie.rating || "0.0"}`;

    const yearElem = document.getElementById("movie-year");
    if (yearElem) yearElem.innerText = movie.year || "2024";

    const durationElem = document.getElementById("movie-duration");
    if (durationElem) durationElem.innerText = movie.duration || "2h 15m";

    const genresElem = document.getElementById("movie-genres");
    if (genresElem) {
        genresElem.innerText = Array.isArray(movie.genres) ? movie.genres.join(" • ") : (movie.genres || "أكشن");
    }

    const descElem = document.getElementById("movie-description");
    if (descElem) descElem.innerText = movie.description || "لا يوجد وصف متوفر حالياً.";

    // 2. Action Links
    const btnPlay = document.getElementById("btn-play");
    if (btnPlay) btnPlay.href = `watch.html?id=${movie.id}`;

    const btnParty = document.getElementById("btn-party");
    if (btnParty) btnParty.href = `watch-party.html?create=${movie.id}`;

    // 3. Bookmark Toggle Logic with LocalStorage Integration
    const bookmarkBtn = document.getElementById("btn-bookmark");
    if (bookmarkBtn) {
        // فحص حالة الفيلم في LocalStorage عند تحميل الصفحة
        let myList = JSON.parse(localStorage.getItem("flixora_my_list") || "[]");
        const isBookmarked = myList.includes(movie.id);

        const icon = bookmarkBtn.querySelector("i");
        if (isBookmarked) {
            if (icon) icon.className = "fa-solid fa-bookmark";
            bookmarkBtn.style.color = "var(--gold)";
        }

        bookmarkBtn.addEventListener("click", () => {
            myList = JSON.parse(localStorage.getItem("flixora_my_list") || "[]");
            const index = myList.indexOf(movie.id);

            if (index === -1) {
                myList.push(movie.id);
                if (icon) icon.className = "fa-solid fa-bookmark";
                bookmarkBtn.style.color = "var(--gold)";
                showToast("تمت إضافة الفيلم إلى قائمتك المفضلّة", "success", "fa-bookmark");
            } else {
                myList.splice(index, 1);
                if (icon) icon.className = "fa-regular fa-bookmark";
                bookmarkBtn.style.color = "#fff";
                showToast("تمت إزالة الفيلم من قائمتك", "warning", "fa-bookmark-slash");
            }

            localStorage.setItem("flixora_my_list", JSON.stringify(myList));
        });
    }

    // 4. Populate Stats
    const stats = movie.stats || {};
    const boxOfficeElem = document.getElementById("stat-boxoffice");
    if (boxOfficeElem) boxOfficeElem.innerText = stats.boxOffice || movie.boxOffice || "$150M";

    const directorElem = document.getElementById("stat-director");
    if (directorElem) directorElem.innerText = stats.director || movie.director || "غير معروف";

    const awardsElem = document.getElementById("stat-awards");
    if (awardsElem) awardsElem.innerText = stats.awards || movie.awards || "عدة جوائز عالمية";

    const audienceElem = document.getElementById("stat-audience");
    if (audienceElem) audienceElem.innerText = stats.audience || movie.audienceRating || "90%";

    // 5. Populate Cast Cards
    renderCast(movie.cast);

    // 6. Populate Key Scenes
    renderScenes(movie.scenes);

    // 7. Populate BTS
    const btsElem = document.getElementById("bts-text");
    if (btsElem) {
        btsElem.innerText = movie.bts || movie.behindTheScenes || "تم استخدام تقنيات سينمائية عالية الجودة في إنتاج وتصوير هذا العمل.";
    }
}

function renderCast(castList) {
    const container = document.getElementById("cast-container");
    if (!container) return;

    const defaultCast = [
        { name: "Matthew McConaughey", role: "Cooper", img: "https://i.pravatar.cc/150?img=68" },
        { name: "Anne Hathaway", role: "Brand", img: "https://i.pravatar.cc/150?img=49" },
        { name: "Jessica Chastain", role: "Murph", img: "https://i.pravatar.cc/150?img=45" },
        { name: "Michael Caine", role: "Professor Brand", img: "https://i.pravatar.cc/150?img=13" }
    ];

    const castToRender = (castList && castList.length > 0) ? castList : defaultCast;

    container.innerHTML = castToRender.map(actor => `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 120px; flex-shrink: 0;">
            <img src="${actor.img || actor.image || 'https://i.pravatar.cc/150?img=12'}" alt="${actor.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-gold); margin-bottom: 0.6rem;">
            <h4 style="color: #fff; font-size: 0.9rem; font-weight: 700; margin-bottom: 0.1rem; line-height: 1.2;">${actor.name}</h4>
            <span style="color: var(--text-secondary); font-size: 0.78rem;">${actor.role || actor.character || ''}</span>
        </div>
    `).join("");
}

function renderScenes(scenesList) {
    const container = document.getElementById("scenes-container");
    if (!container) return;

    const defaultScenes = [
        { title: "مشهد الثقب الدودي (Wormhole)", img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600" },
        { title: "الهبوط على كوكب ميلر (Miller's Planet)", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600" },
        { title: "داخل البعد الخامس (Tesseract Scene)", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" }
    ];

    const scenesToRender = (scenesList && scenesList.length > 0) ? scenesList : defaultScenes;

    container.innerHTML = scenesToRender.map((scene, index) => {
        const imgSrc = typeof scene === "string" ? scene : (scene.img || scene.image);
        const title = typeof scene === "object" && scene.title ? scene.title : `مشهد مميز #${index + 1}`;

        return `
            <div class="movie-card" style="height: 160px; position: relative; border-radius: var(--radius-md); overflow: hidden; cursor: pointer;">
                <img src="${imgSrc}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <i class="fa-solid fa-circle-play" style="color: var(--gold); font-size: 1.4rem;"></i>
                        <span style="color: #fff; font-size: 0.88rem; font-weight: 600;">${title}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

/* ==========================================================================
   FLIXORA Toast Notification Engine
   ========================================================================== */

/**
 * دالة إظهار الإشعارات التفاعلية
 * @param {string} msg النص المراد عرضه
 * @param {string} type نوع الإشعار: 'success' | 'warning' | 'danger' | 'info'
 * @param {string} iconClass (اختياري) كلاس FontAwesome للأيقونة
 * @param {number} duration مدة بقاء الإشعار بالمللي ثانية
 */
function showToast(msg, type = "success", iconClass = null, duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const config = {
        success: { icon: "fa-circle-check" },
        warning: { icon: "fa-triangle-exclamation" },
        danger:  { icon: "fa-circle-xmark" },
        info:    { icon: "fa-circle-info" }
    };

    const currentConfig = config[type] || config.success;
    const finalIcon = iconClass || currentConfig.icon;

    const toast = document.createElement("div");
    toast.className = `flixora-toast flixora-toast-${type}`;
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fa-solid ${finalIcon} toast-icon"></i>
            <span class="toast-message">${msg}</span>
        </div>
        <button class="toast-close" onclick="dismissToast(this.parentElement)">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    const timer = setTimeout(() => {
        dismissToast(toast);
    }, duration);

    toast.dataset.timerId = timer;
}

function dismissToast(toastElement) {
    if (!toastElement || toastElement.classList.contains("hide")) return;
    
    if (toastElement.dataset.timerId) {
        clearTimeout(Number(toastElement.dataset.timerId));
    }

    toastElement.classList.add("hide");

    setTimeout(() => {
        toastElement.remove();
    }, 300);
}