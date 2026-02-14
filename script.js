/* ============================================
   VALENTINE'S DAY CARD DECK - VANILLA JS
   Elite Frontend Architecture
   ============================================ */

// App State
const AppState = {
    currentCard: 0,
    totalCards: 5,
    isAnimating: false,
    decodedMessages: [
        "You make every day brighter just by being you.",
        "You have this incredible skill way of making me feel so happy.",
        "You're brilliant, kind, and endlessly creative.",
        "Time with you is always the best part of my day.",
        "You see the beauty in things others overlook.",
        "Your energy is absolutely magnetic.",
        "You make the ordinary feel extraordinary.",
        "You're the kind of person everyone hopes to have in their life."
    ],
    usedMessages: []
};

// DOM Elements
const cards = document.querySelectorAll('.glass-card');
const dots = document.querySelectorAll('.dot');
const decodeBtn = document.getElementById('decodeBtn');
const decodedText = document.getElementById('decodedText');
const nextBtn3 = document.getElementById('nextBtn3');

// ============================================
// CARD NAVIGATION SYSTEM
// ============================================

function navigateToCard(targetIndex) {
    if (AppState.isAnimating || targetIndex === AppState.currentCard || targetIndex < 0 || targetIndex >= AppState.totalCards) {
        return;
    }

    AppState.isAnimating = true;

    // Get current and target cards
    const currentCardEl = cards[AppState.currentCard];
    const targetCardEl = cards[targetIndex];

    // Add exiting animation to current card
    currentCardEl.classList.add('exiting');

    // Wait for exit animation, then swap
    setTimeout(() => {
        currentCardEl.classList.remove('active', 'exiting');
        targetCardEl.classList.add('active');

        // Update state
        AppState.currentCard = targetIndex;
        updateProgressDots();

        // Re-enable animations after transition
        setTimeout(() => {
            AppState.isAnimating = false;
        }, 100);
    }, 600);
}

function updateProgressDots() {
    dots.forEach((dot, index) => {
        if (index === AppState.currentCard) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ============================================
// DECODE ANIMATION SYSTEM (Card 4)
// ============================================

function getRandomMessage() {
    // If all messages used, reset the pool
    if (AppState.usedMessages.length === AppState.decodedMessages.length) {
        AppState.usedMessages = [];
    }

    // Get available messages
    const availableMessages = AppState.decodedMessages.filter(
        msg => !AppState.usedMessages.includes(msg)
    );

    // Pick random message
    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selectedMessage = availableMessages[randomIndex];

    // Mark as used
    AppState.usedMessages.push(selectedMessage);

    return selectedMessage;
}

function generateRandomChars(length) {
    const chars = '█▓▒░ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function decodeMessage() {
    const targetMessage = getRandomMessage();
    const messageLength = targetMessage.length;

    decodedText.classList.add('decoding');
    decodeBtn.disabled = true;
    decodeBtn.style.opacity = '0.6';
    decodeBtn.style.cursor = 'not-allowed';

    // Phase 1: Rapid scramble (400ms)
    const scrambleFrames = 20;
    const scrambleInterval = 20;

    for (let i = 0; i < scrambleFrames; i++) {
        await sleep(scrambleInterval);
        decodedText.textContent = generateRandomChars(messageLength);
    }

    // Phase 2: Progressive decode (1200ms)
    const decodeFrames = 40;
    const decodeInterval = 30;
    let decoded = '';

    for (let i = 0; i <= messageLength; i++) {
        await sleep(decodeInterval);
        decoded = targetMessage.substring(0, i);
        const remaining = messageLength - i;
        const scrambled = generateRandomChars(remaining);
        decodedText.textContent = decoded + scrambled;
    }

    // Phase 3: Final reveal
    await sleep(200);
    decodedText.textContent = targetMessage;
    decodedText.classList.remove('decoding');

    // Show next button after decode
    await sleep(800);
    nextBtn3.classList.remove('hidden');
    nextBtn3.style.animation = 'fadeIn 0.5s ease';

    // Re-enable decode button for another try
    await sleep(1000);
    decodeBtn.disabled = false;
    decodeBtn.style.opacity = '1';
    decodeBtn.style.cursor = 'pointer';
    decodeBtn.innerHTML = '<span class="decode-icon">↻</span> Decode Another';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// EVENT LISTENERS
// ============================================

// Next button click handlers
document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') === 'next') {
        const nextCard = AppState.currentCard + 1;
        if (nextCard < AppState.totalCards) {
            navigateToCard(nextCard);
        }
    }
});

// Decode button
if (decodeBtn) {
    decodeBtn.addEventListener('click', () => {
        if (!decodeBtn.disabled) {
            decodeMessage();
        }
    });
}

// Keyboard navigation (optional enhancement)
document.addEventListener('keydown', (e) => {
    if (AppState.isAnimating) return;

    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const nextCard = AppState.currentCard + 1;
        if (nextCard < AppState.totalCards) {
            navigateToCard(nextCard);
        }
    } else if (e.key === 'ArrowLeft') {
        const prevCard = AppState.currentCard - 1;
        if (prevCard >= 0) {
            navigateToCard(prevCard);
        }
    }
});

// ============================================
// TOUCH SWIPE SUPPORT
// ============================================

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleSwipe() {
    const swipeThreshold = 50;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) {
            // Swiped left - go to next card
            const nextCard = AppState.currentCard + 1;
            if (nextCard < AppState.totalCards) {
                navigateToCard(nextCard);
            }
        } else {
            // Swiped right - go to previous card
            const prevCard = AppState.currentCard - 1;
            if (prevCard >= 0) {
                navigateToCard(prevCard);
            }
        }
    }
}

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

// ============================================
// 3D TILT EFFECT FOR CARD 2
// ============================================

const tiltCard = document.querySelector('.tilt-card');
let tiltCardElement = null;

// Find the glass card containing the tilt card
cards.forEach(card => {
    if (card.querySelector('.tilt-card')) {
        tiltCardElement = card;
    }
});

if (tiltCardElement && window.matchMedia("(hover: hover)").matches) {
    tiltCardElement.addEventListener('mousemove', (e) => {
        if (!tiltCardElement.classList.contains('active')) return;

        const rect = tiltCardElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        const tiltContent = tiltCardElement.querySelector('.tilt-card');
        if (tiltContent) {
            tiltContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }
    });

    tiltCardElement.addEventListener('mouseleave', () => {
        const tiltContent = tiltCardElement.querySelector('.tilt-card');
        if (tiltContent) {
            tiltContent.style.transform = '';
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

function initApp() {
    console.log('💖 Valentine\'s Day Experience Initialized');

    // Ensure first card is active
    cards[0].classList.add('active');
    updateProgressDots();

    // Add fade-in animation for buttons
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Preload images for smoother experience
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.loading = 'eager';
        }
    });
});

// Prevent pull-to-refresh on mobile
document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Disable double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// --- Secret Click Tracking ---
// --- Secret Click Tracking & Custom Form ---
const smsBtn = document.getElementById('sms-btn');
const emailBtn = document.getElementById('email-btn');
const buttonGroup = document.getElementById('button-group');
const customMessageBox = document.getElementById('custom-message-box');
const sendCustomMsgBtn = document.getElementById('send-custom-msg-btn');
const customMsgText = document.getElementById('custom-msg-text');
const successMsg = document.getElementById('success-msg');

const formspreeUrl = "https://formspree.io/f/xwvvednz"; // Keep your real Formspree ID here

// 1. SMS Silent Ping
if (smsBtn) {
    smsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        fetch(formspreeUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "🚨 ALERT: She tapped the SMS (Absolutely! 💖) button!" })
        }).then(() => {
            window.location.href = this.href;
        }).catch(() => {
            window.location.href = this.href;
        });
    });
}

// 2. "Email" button reveals the text box
if (emailBtn) {
    emailBtn.addEventListener('click', function (e) {
        e.preventDefault();
        buttonGroup.style.display = 'none'; // Hide buttons
        customMessageBox.style.display = 'block'; // Show typing area
    });
}

// 3. Send the custom message directly via Formspree
if (sendCustomMsgBtn) {
    sendCustomMsgBtn.addEventListener('click', function () {
        const userMessage = customMsgText.value.trim();

        if (userMessage === "") {
            alert("Please type a message first! 💕");
            return;
        }

        // Change text so she knows it's loading
        sendCustomMsgBtn.innerText = "Sending...";

        fetch(formspreeUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "💌 HER REPLY: " + userMessage
            })
        }).then(() => {
            // Hide the text box and show success message
            sendCustomMsgBtn.style.display = 'none';
            customMsgText.style.display = 'none';
            successMsg.style.display = 'block';
        }).catch(() => {
            alert("Oops, something went wrong. Try again!");
            sendCustomMsgBtn.innerText = "Send Message 🚀";
        });
    });
}