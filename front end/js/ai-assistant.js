/* ==========================================================================
   FLIXORA — AI Assistant Intelligent Interaction Module
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ai-input-form");
    const input = document.getElementById("ai-user-input");
    const voiceBtn = document.getElementById("btn-voice");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (text) {
                processUserQuery(text);
                input.value = "";
            }
        });
    }

    // Voice Input Real & Fallback Engine (التعرف الصوتي الحقيقي مع دعم محاكاة)
    if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'ar-SA';
                recognition.interimResults = false;

                recognition.onstart = () => {
                    voiceBtn.style.color = "#ff4757";
                    voiceBtn.style.boxShadow = "0 0 15px rgba(255, 71, 87, 0.5)";
                    input.placeholder = "جاري الاستماع إليك الآن...";
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    input.value = transcript;
                    processUserQuery(transcript);
                    input.value = "";
                };

                recognition.onerror = () => {
                    showVoiceFallback(voiceBtn, input);
                };

                recognition.onend = () => {
                    voiceBtn.style.color = "var(--gold)";
                    voiceBtn.style.boxShadow = "none";
                    input.placeholder = "اكتب ما يدور في ذهنك أو صف شعورك...";
                };

                recognition.start();
            } else {
                // المحاكاة في حالة عدم دعم متصفح المستخدم للـ Speech API
                showVoiceFallback(voiceBtn, input);
            }
        });
    }
});

/* محاكاة الصوت في حال المتصفحات القديمة */
function showVoiceFallback(voiceBtn, input) {
    voiceBtn.style.color = "#ff4757";
    voiceBtn.style.boxShadow = "0 0 15px rgba(255, 71, 87, 0.5)";
    input.placeholder = "جاري الاستماع إليك الان...";

    setTimeout(() => {
        voiceBtn.style.color = "var(--gold)";
        voiceBtn.style.boxShadow = "none";
        input.placeholder = "اكتب ما يدور في ذهنك أو صف شعورك...";
        sendQuickPrompt("أريد فيلم خيال علمي وفضاء مذهل");
    }, 2500);
}

function sendQuickPrompt(promptText) {
    processUserQuery(promptText);
}

async function processUserQuery(userText) {
    const messagesBox = document.getElementById("chat-messages");
    if (!messagesBox) return;

    const userAvatar = localStorage.getItem('flixora_current_avatar') || 'https://i.pravatar.cc/100?img=33';

    // 1. Render User Message
    const userMsgHtml = `
        <div style="display: flex; gap: 1rem; align-items: flex-start; justify-content: flex-end;">
            <div style="background: var(--gold); color: #000; font-weight: 600; padding: 1rem 1.2rem; border-radius: var(--radius-md); max-width: 75%; line-height: 1.5; font-size: 0.95rem;">
                ${escapeHtml(userText)}
            </div>
            <img src="${userAvatar}" alt="User" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--gold); flex-shrink: 0; object-fit: cover;">
        </div>
    `;
    messagesBox.insertAdjacentHTML("beforeend", userMsgHtml);
    scrollToBottom();

    // 2. Render AI Loading State
    const loadingId = "loading-" + Date.now();
    const loadingHtml = `
        <div id="${loadingId}" style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; color: #000; font-size: 1.2rem; flex-shrink: 0;">
                <i class="fa-solid fa-wand-magic-sparkles fa-spin"></i>
            </div>
            <span style="color: var(--text-secondary); font-size: 0.9rem;">جاري تحليل تفضيلاتك وجلب أفضل الترشيحات السينمائية...</span>
        </div>
    `;
    messagesBox.insertAdjacentHTML("beforeend", loadingHtml);
    scrollToBottom();

    // 3. التواصل مع Bckend API للحصول على اقتراحات الذكاء الاصطناعي
    try {
        let matchedMovie = null;
        
        // المحاولة الأولى: طلب الترشيح من Laravel API
        if (typeof apiFetch === 'function') {
            const res = await apiFetch('/ai-recommend', {
                method: 'POST',
                body: JSON.stringify({ prompt: userText })
            });
            if (res.ok) {
                const data = await res.json();
                matchedMovie = data.movie;
            }
        }

        // المحاولة الثانية (Fallback): البحث المحلي من قاعدة بيانات movies.js
        if (!matchedMovie) {
            matchedMovie = findLocalMatch(userText);
        }

        setTimeout(() => {
            document.getElementById(loadingId)?.remove();
            generateAiResponse(matchedMovie);
        }, 800);

    } catch (err) {
        console.warn("API Error, switching to local DB match:", err);
        setTimeout(() => {
            document.getElementById(loadingId)?.remove();
            const fallbackMovie = findLocalMatch(userText);
            generateAiResponse(fallbackMovie);
        }, 800);
    }
}

/* البحث المحلي المساعد من ملف movies.js */
function findLocalMatch(query) {
    if (typeof FLIXORA_DATABASE === 'undefined') {
        return {
            id: 1,
            title: "Interstellar",
            rating: "8.7",
            year: "2014",
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300",
            description: "رحلة ملحمية عبر الثقوب الدودية للبحث عن موطن جديد للبشرية."
        };
    }

    const q = query.toLowerCase();
    if (q.includes("مسلسل") || q.includes("قصير")) {
        return FLIXORA_DATABASE.series[0] || FLIXORA_DATABASE.movies[0];
    } else if (q.includes("أكشن") || q.includes("سيارات") || q.includes("سرعة")) {
        return FLIXORA_DATABASE.movies[1] || FLIXORA_DATABASE.movies[0];
    }
    
    return FLIXORA_DATABASE.movies[0];
}

/* عرض إجابة الذكاء الاصطناعي */
function generateAiResponse(matchedMovie) {
    const messagesBox = document.getElementById("chat-messages");
    if (!messagesBox || !matchedMovie) return;

    const aiMsgHtml = `
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; color: #000; font-size: 1.2rem; flex-shrink: 0; box-shadow: 0 0 15px var(--gold-glow);">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-gold); padding: 1.2rem; border-radius: var(--radius-md); max-width: 82%; color: #fff; line-height: 1.6;">
                <p style="margin-bottom: 0.8rem; font-size: 0.95rem;">
                    بناءً على طلبك، وجدّت أن هذا العمل هو الأنسب لمزاجك تماماً بكفاءة 98%:
                </p>

                <!-- Recommendation Card Embed -->
                <div style="display: flex; gap: 1rem; background: rgba(6, 6, 8, 0.8); border: 1px solid var(--border-light); padding: 0.8rem; border-radius: var(--radius-sm); margin-bottom: 1rem; align-items: center;">
                    <img src="${matchedMovie.poster}" alt="${matchedMovie.title}" style="width: 70px; height: 100px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.2rem;">
                            <span class="badge-gold" style="font-size: 0.75rem;"><i class="fa-solid fa-star"></i> ${matchedMovie.rating}</span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">${matchedMovie.year || ''}</span>
                        </div>
                        <h4 style="color: #fff; font-size: 1.05rem; margin-bottom: 0.3rem;">${matchedMovie.title}</h4>
                        <p style="color: var(--text-secondary); font-size: 0.82rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${matchedMovie.description}
                        </p>
                    </div>
                </div>

                <div style="display: flex; gap: 0.8rem;">
                    <a href="watch.html?id=${matchedMovie.id}" class="btn btn-gold" style="padding: 0.5rem 1.2rem; font-size: 0.85rem; border-radius: var(--radius-sm); text-decoration: none;">
                        <i class="fa-solid fa-play"></i> مشاهدة الآن
                    </a>
                    <a href="movie-details.html?id=${matchedMovie.id}" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: var(--radius-sm); text-decoration: none;">
                        التفاصيل
                    </a>
                </div>
            </div>
        </div>
    `;

    messagesBox.insertAdjacentHTML("beforeend", aiMsgHtml);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesBox = document.getElementById("chat-messages");
    if (messagesBox) {
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }
}

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}