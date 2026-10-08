/* ==========================================================================
   FLIXORA — Custom Video Player Logic & Control Interface
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("main-video");
    const playBtn = document.getElementById("btn-play");
    const rewindBtn = document.getElementById("btn-rewind");
    const forwardBtn = document.getElementById("btn-forward");
    const volumeBtn = document.getElementById("btn-volume");
    const volumeSlider = document.getElementById("volume-slider");
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const timeDisplay = document.getElementById("time-display");
    const fullscreenBtn = document.getElementById("btn-fullscreen");
    const container = document.getElementById("player-container");
    const header = document.getElementById("player-header");
    const controls = document.getElementById("player-controls");

    let hideControlsTimeout;

    // Load Movie Data from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id") || "m1";
    if (typeof FLIXORA_DATABASE !== "undefined") {
        const movie = FLIXORA_DATABASE.movies.find(m => m.id === movieId);
        if (movie) {
            document.getElementById("video-title").innerText = movie.title;
            document.getElementById("btn-watch-party").href = `watch-party.html?create=${movie.id}`;
        }
    }

    // Play / Pause Toggle
    function togglePlay() {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        } else {
            video.pause();
            playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        }
    }

    playBtn.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    // Rewind / Forward 10 seconds
    rewindBtn.addEventListener("click", () => video.currentTime -= 10);
    forwardBtn.addEventListener("click", () => video.currentTime += 10);

    // Volume Controls
    volumeSlider.addEventListener("input", (e) => {
        video.volume = e.target.value;
        video.muted = (video.volume === 0);
        updateVolumeIcon();
    });

    volumeBtn.addEventListener("click", () => {
        video.muted = !video.muted;
        volumeSlider.value = video.muted ? 0 : video.volume;
        updateVolumeIcon();
    });

    function updateVolumeIcon() {
        if (video.muted || video.volume === 0) {
            volumeBtn.innerHTML = `<i class="fa-solid fa-volume-xmark" style="color: var(--text-muted);"></i>`;
        } else {
            volumeBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        }
    }

    // Update Progress Bar & Time
    video.addEventListener("timeupdate", () => {
        const current = video.currentTime;
        const duration = video.duration || 0;
        const pct = (current / duration) * 100;
        progressBar.style.width = `${pct}%`;

        timeDisplay.innerText = `${formatTime(current)} / ${formatTime(duration)}`;
    });

    // Seek Click on Progress Bar
    progressContainer.addEventListener("click", (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });

    // Fullscreen Toggle
    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => alert(err.message));
            fullscreenBtn.innerHTML = `<i class="fa-solid fa-compress"></i>`;
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = `<i class="fa-solid fa-expand"></i>`;
        }
    });

    // Auto Hide UI Controls on Idle
    function showControls() {
        header.style.opacity = "1";
        controls.style.opacity = "1";
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            if (!video.paused) {
                header.style.opacity = "0";
                controls.style.opacity = "0";
                closeAllMenus();
            }
        }, 3500);
    }

    container.addEventListener("mousemove", showControls);
    container.addEventListener("touchstart", showControls);

    // Format Seconds to MM:SS
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }
});

/* Toggle Custom Popover Menus (Audio, Subtitles, Quality) */
function toggleMenu(menuId) {
    const target = document.getElementById(menuId);
    const isVisible = target.style.display === "block";
    closeAllMenus();
    if (!isVisible) {
        target.style.display = "block";
    }
}

function closeAllMenus() {
    document.querySelectorAll(".player-popover").forEach(el => el.style.display = "none");
}
/* ==========================================================================
   FLIXORA — Advanced Player Engine (Keyboard Shortcuts & Resume Watch)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("main-player");
    if (!video) return;

    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('id') || 'default-media';

    // 1. استرجاع نقطة التوقف السابقة تلقائياً
    const savedTime = localStorage.getItem(`flixora_pos_${mediaId}`);
    if (savedTime && parseFloat(savedTime) > 5) {
        video.currentTime = parseFloat(savedTime);
        showToast(`تم استكمال المشاهدة من الدقيقة ${Math.floor(savedTime / 60)}:${Math.floor(savedTime % 60)}`);
    }

    // 2. حفظ وقت المشاهدة كل 5 ثوانٍ
    video.addEventListener("timeupdate", () => {
        if (video.currentTime > 5) {
            localStorage.setItem(`flixora_pos_${mediaId}`, video.currentTime);
        }
        
        // إظهار وإخفاء زر تخطي المقدمة (Skip Intro) في أول دقيقتين
        const skipBtn = document.getElementById("skip-intro-btn");
        if (skipBtn) {
            if (video.currentTime >= 10 && video.currentTime <= 110) {
                skipBtn.style.display = "flex";
            } else {
                skipBtn.style.display = "none";
            }
        }
    });

    // 3. دعم اختصارات لوحة المفاتيح (Keyboard Shortcuts)
    document.addEventListener("keydown", (e) => {
        // تجنب الاختصارات إذا كان المستخدم يكتب في حقل مدخلات
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

        switch (e.code) {
            case "Space":
                e.preventDefault();
                video.paused ? video.play() : video.pause();
                break;
            case "ArrowRight": // تقديم 10 ثوانٍ
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                showToast("+10 ثوانٍ");
                break;
            case "ArrowLeft": // إرجاع 10 ثوانٍ
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 10);
                showToast("-10 ثوانٍ");
                break;
            case "KeyF": // الشاشة الكاملة
                e.preventDefault();
                if (!document.fullscreenElement) {
                    video.requestFullscreen().catch(err => console.log(err));
                } else {
                    document.exitFullscreen();
                }
                break;
            case "KeyM": // كتم / إطلاق الصوت
                e.preventDefault();
                video.muted = !video.muted;
                showToast(video.muted ? "تم كتم الصوت" : "تم تشغيل الصوت");
                break;
        }
    });
});

/* وظيفة تخطي المقدمة */
function skipIntro() {
    const video = document.getElementById("main-player");
    if (video) {
        video.currentTime += 85; // تخطي 85 ثانية
        showToast("تم تخطي المقدمة");
    }
}

function showToast(msg) {
    let toast = document.getElementById("player-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "player-toast";
        toast.style.cssText = "position: fixed; bottom: 5rem; right: 2rem; background: rgba(212,175,55,0.9); color: #000; font-weight: 700; padding: 0.6rem 1.2rem; border-radius: 20px; z-index: 1000; font-size: 0.85rem; pointer-events: none; transition: opacity 0.3s;";
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.opacity = "1";
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}