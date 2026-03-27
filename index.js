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
        navExplore.addEventListener('click', () => {
            homeView.classList.add('hidden');
            exploreView.classList.remove('hidden');
        });

        navHome.addEventListener('click', () => {
            exploreView.classList.add('hidden');
            homeView.classList.remove('hidden');
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
});
