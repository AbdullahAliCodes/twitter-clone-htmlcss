const rootElement = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    rootElement.setAttribute('data-theme', 'dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            rootElement.setAttribute('data-theme', 'dark');
        } else {
            rootElement.removeAttribute('data-theme');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileProfileBtn = document.querySelector('.mobile-profile-btn');
    const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');

    if (mobileProfileBtn && mobileDrawerOverlay) {
        mobileProfileBtn.addEventListener('click', () => {
            mobileDrawerOverlay.classList.add('active');
        });

        mobileDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === mobileDrawerOverlay) {
                mobileDrawerOverlay.classList.remove('active');
            }
        });
    }

    const navHome = document.getElementById('nav-home');
    const navExplore = document.getElementById('nav-explore');
    const homeView = document.getElementById('home-view');
    const exploreView = document.getElementById('explore-view');

    if (navHome && navExplore && homeView && exploreView) {
        navExplore.addEventListener('click', function () {
            homeView.classList.add('hidden');
            exploreView.classList.remove('hidden');
            navHome.classList.remove('active-nav');
            navExplore.classList.add('active-nav');
            this.blur();
        });

        navHome.addEventListener('click', function () {
            exploreView.classList.add('hidden');
            homeView.classList.remove('hidden');
            navExplore.classList.remove('active-nav');
            navHome.classList.add('active-nav');
            this.blur();
        });
    }

    const exploreTabs = document.querySelectorAll('.explore-tab');
    const exploreContents = document.querySelectorAll('.explore-tab-content');

    exploreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            exploreTabs.forEach(t => t.classList.remove('active'));
            exploreContents.forEach(c => c.classList.add('hidden'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const currentTheme = rootElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                rootElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                rootElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            this.blur();
        });
    }

    const grokFab = document.getElementById('fab-grok');
    const grokOverlay = document.getElementById('grok-modal-overlay');

    if (grokFab && grokOverlay) {
        grokFab.addEventListener('click', () => {
            grokOverlay.classList.remove('hidden');
        });

        grokOverlay.addEventListener('click', (e) => {
            if (e.target === grokOverlay) {
                grokOverlay.classList.add('hidden');
            }
        });

        const grokModalClose = document.getElementById('grok-modal-close');
        if (grokModalClose) {
            grokModalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                grokOverlay.classList.add('hidden');
            });
        }

        const grokInput = document.querySelector('.grok-input');
        const grokActionBtn = document.getElementById('grok-action-btn');
        const iconMic = grokActionBtn.querySelector('.icon-mic');
        const iconSend = grokActionBtn.querySelector('.icon-send');

        const submitToGrok = () => {
            const query = grokInput.value.trim();
            if (query) {
                const encodedQuery = encodeURIComponent(query);
                const targetUrl = `https://grok.com/?q=${encodedQuery}`;
                window.open(targetUrl, '_blank');
                grokInput.value = '';
                iconSend.classList.add('hidden');
                iconMic.classList.remove('hidden');
                grokOverlay.classList.add('hidden');
            }
        };

        grokInput.addEventListener('input', (e) => {
            if (e.target.value.trim().length > 0) {
                iconMic.classList.add('hidden');
                iconSend.classList.remove('hidden');
            } else {
                iconSend.classList.add('hidden');
                iconMic.classList.remove('hidden');
            }
        });

        grokInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitToGrok();
            }
        });

        grokActionBtn.addEventListener('click', () => {
            if (grokInput.value.trim().length > 0) {
                submitToGrok();
            } else {
                console.log('Voice input activated');
            }
        });
    }

    const chatFab = document.getElementById('fab-chat');
    const chatOverlay = document.getElementById('chat-modal-overlay');
    const chatCloseIcon = document.getElementById('chat-close-icon');

    if (chatFab && chatOverlay) {
        chatFab.addEventListener('click', () => {
            chatOverlay.classList.remove('hidden');
        });

        chatOverlay.addEventListener('click', (e) => {
            if (e.target === chatOverlay) {
                chatOverlay.classList.add('hidden');
            }
        });

        if (chatCloseIcon) {
            chatCloseIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                chatOverlay.classList.add('hidden');
            });
        }
    }
});
