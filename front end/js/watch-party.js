/* ==========================================================================
   FLIXORA — Watch Party Dynamic Real-Time Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("party-chat-form");
    const chatInput = document.getElementById("party-chat-input");
    const micBtn = document.getElementById("btn-toggle-mic");
    const deafenBtn = document.getElementById("btn-toggle-deafen");

    let isMicOn = true;
    let isDeafenOn = false;

    // Toggle Mic State
    if (micBtn) {
        micBtn.addEventListener("click", () => {
            isMicOn = !isMicOn;
            if (isMicOn) {
                micBtn.classList.add("active");
                micBtn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
                showToast("تم تشغيل الميكروفون");
            } else {
                micBtn.classList.remove("active");
                micBtn.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
                showToast("تم إكتام الميكروفون");
            }
        });
    }

    // Toggle Deafen State
    if (deafenBtn) {
        deafenBtn.addEventListener("click", () => {
            isDeafenOn = !isDeafenOn;
            if (isDeafenOn) {
                deafenBtn.style.color = "#ff4757";
                showToast("تم كتم صوت الغرفة بالكامل");
            } else {
                deafenBtn.style.color = "#fff";
                showToast("تم إعادة تشغيل الصوت");
            }
        });
    }

    // Send Chat Message
    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (text) {
                appendChatMessage("أنت (سوزان)", text, "right");
                chatInput.value = "";
                simulateFriendResponse();
            }
        });
    }
});

/* Append Chat Message Bubble */
function appendChatMessage(author, text, direction) {
    const stream = document.getElementById("party-chat-stream");
    if (!stream) return;

    const bubbleHtml = `
        <div class="chat-bubble ${direction}">
            <span class="chat-author">${author}</span>
            <p class="chat-text">${text}</p>
        </div>
    `;

    stream.insertAdjacentHTML("beforeend", bubbleHtml);
    stream.scrollTop = stream.scrollHeight;
}

/* Floating Emoji Reactions Engine */
function sendEmojiReaction(emoji) {
    const overlay = document.getElementById("reactions-overlay");
    if (!overlay) return;

    const emojiNode = document.createElement("div");
    emojiNode.className = "floating-emoji";
    emojiNode.innerText = emoji;

    // Randomize horizontal starting point
    const randomLeft = Math.floor(Math.random() * 70) + 15;
    emojiNode.style.left = `${randomLeft}%`;

    overlay.appendChild(emojiNode);

    // Auto cleanup after animation
    setTimeout(() => {
        emojiNode.remove();
    }, 2500);

    // Add entry in chat stream
    appendChatMessage("تفاعل أرسل", `${emoji} تفاعل معك في المشهد`, "left");
}

/* Simulate Automatic Interactive Responses from Friends */
function simulateFriendResponse() {
    const responses = [
        { name: "عمر", text: "أتفق معك تماماً! 👍" },
        { name: "سارة", text: "هذا المشهد يُدرس في الإخراج السينمائي! 🔥" },
        { name: "أحمد", text: "دعونا نركز في المقطع القادم 🤫" }
    ];

    setTimeout(() => {
        const randomItem = responses[Math.floor(Math.random() * responses.length)];
        appendChatMessage(randomItem.name, randomItem.text, "left");
    }, 2000);
}

/* Copy Room Share Link */
function copyRoomLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast("تم نسخ رابط الغرفة بنجاح! شاركه مع أصدقائك.");
}

/* Toast Notification Utility */
function showToast(msg) {
    const toast = document.createElement("div");
    toast.style.cssText = "position: fixed; bottom: 2rem; left: 2rem; background: var(--gold); color: #000; font-weight: 700; padding: 0.8rem 1.5rem; border-radius: var(--radius-sm); z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}