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

    const feedTimeline = document.querySelector('.feed-timeline');

    let tweetStates = {};
    try {
        tweetStates = JSON.parse(localStorage.getItem('tweetStates') || '{}');
    } catch {
        tweetStates = {};
    }

    let customFeedItems = [];
    try {
        const parsed = JSON.parse(localStorage.getItem('customFeedItems') || '[]');
        customFeedItems = Array.isArray(parsed) ? parsed : [];
    } catch {
        customFeedItems = [];
    }

    const saveCustomFeed = () => {
        localStorage.setItem('customFeedItems', JSON.stringify(customFeedItems));
    };

    const loadCustomFeed = () => {
        if (!feedTimeline) {
            return;
        }
        for (let i = customFeedItems.length - 1; i >= 0; i--) {
            const itemHtml = customFeedItems[i];
            if (typeof itemHtml === 'string' && itemHtml.trim()) {
                feedTimeline.insertAdjacentHTML('afterbegin', itemHtml);
            }
        }
    };

    const saveTweetStates = () => {
        localStorage.setItem('tweetStates', JSON.stringify(tweetStates));
    };

    const ensureTweetState = (id) => {
        if (!id) {
            return;
        }
        if (!tweetStates[id]) {
            tweetStates[id] = { liked: false, reposted: false, bookmarked: false };
        }
    };

    const applySavedStates = () => {
        if (!feedTimeline) {
            return;
        }
        feedTimeline.querySelectorAll(':scope > .tweet[data-tweet-id]').forEach((tweet) => {
            const id = tweet.getAttribute('data-tweet-id');
            if (!id || !tweetStates[id]) {
                return;
            }
            const s = tweetStates[id];
            const likeBtn = tweet.querySelector('.tweet-footer > .footer-action.action-like');
            const repostBtn = tweet.querySelector('.tweet-footer > .footer-action.action-repost');
            const bookmarkBtn = tweet.querySelector('.footer-action.action-bookmark');
            if (likeBtn && s.liked) {
                likeBtn.classList.add('is-liked');
            }
            if (repostBtn && s.reposted) {
                repostBtn.classList.add('is-reposted');
            }
            if (bookmarkBtn && s.bookmarked) {
                bookmarkBtn.classList.add('is-bookmarked');
            }
        });
    };

    loadCustomFeed();
    applySavedStates();

    if (feedTimeline) {
        feedTimeline.addEventListener('click', (e) => {
            const bookmarkBtn = e.target.closest('.action-bookmark');
            if (bookmarkBtn) {
                e.stopPropagation();
                bookmarkBtn.classList.toggle('is-bookmarked');
                const tweet = bookmarkBtn.closest('.tweet');
                const tid = tweet?.getAttribute('data-tweet-id');
                if (tid) {
                    ensureTweetState(tid);
                    tweetStates[tid].bookmarked = bookmarkBtn.classList.contains('is-bookmarked');
                    saveTweetStates();
                }
                return;
            }
            const likeBtn = e.target.closest('.action-like');
            if (likeBtn) {
                e.stopPropagation();
                likeBtn.classList.toggle('is-liked');
                const tweet = likeBtn.closest('.tweet');
                const tid = tweet?.getAttribute('data-tweet-id');
                if (tid) {
                    ensureTweetState(tid);
                    tweetStates[tid].liked = likeBtn.classList.contains('is-liked');
                    saveTweetStates();
                }
            }
        });
    }

    const retweetDropdown = document.getElementById('retweet-dropdown');
    const quoteModalOverlay = document.getElementById('quote-modal-overlay');
    const quoteEmbeddedTweet = document.getElementById('quote-embedded-tweet');
    const quoteCloseBtn = document.querySelector('.quote-close');
    const submitQuoteBtn = document.getElementById('submit-quote-btn');
    const quoteTextarea = document.getElementById('quote-textarea');
    const feedContainer = document.querySelector('.feed-timeline') || document.getElementById('home-view');
    const actionRepostMenu = document.getElementById('action-repost');
    const actionQuoteMenu = document.getElementById('action-quote');

    let activeTweetToClone = null;

    document.addEventListener('click', (e) => {
        const retweetBtn = e.target.closest('.footer-action.action-repost');
        if (retweetBtn && feedTimeline && feedTimeline.contains(retweetBtn)) {
            const rect = retweetBtn.getBoundingClientRect();
            if (retweetDropdown) {
                retweetDropdown.style.top = `${rect.bottom + 5}px`;
                retweetDropdown.style.left = `${rect.left}px`;
                retweetDropdown.classList.remove('hidden');
            }
            activeTweetToClone = retweetBtn.closest('.tweet');
            e.stopPropagation();
        } else if (!e.target.closest('#retweet-dropdown')) {
            retweetDropdown?.classList.add('hidden');
        }
    });

    if (actionRepostMenu) {
        actionRepostMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTweetToClone && feedContainer) {
                const clonedTweet = activeTweetToClone.cloneNode(true);
                clonedTweet.setAttribute(
                    'data-tweet-id',
                    `tweet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
                );
                const tweetContent = clonedTweet.querySelector('.tweet-content');
                if (tweetContent) {
                    const ctxSvg =
                        '<svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"></path></g></svg>';
                    let ctx = tweetContent.querySelector('.tweet-context');
                    if (!ctx) {
                        ctx = document.createElement('div');
                        ctx.className = 'tweet-context';
                        tweetContent.insertBefore(ctx, tweetContent.firstChild);
                    }
                    ctx.innerHTML = `${ctxSvg} You reposted`;
                }
                feedContainer.prepend(clonedTweet);
                const originalRepostBtn = activeTweetToClone.querySelector('.action-repost');
                if (originalRepostBtn) {
                    originalRepostBtn.classList.add('is-reposted');
                }
                const repostTweetId = activeTweetToClone.getAttribute('data-tweet-id');
                if (repostTweetId) {
                    ensureTweetState(repostTweetId);
                    tweetStates[repostTweetId].reposted = true;
                    saveTweetStates();
                }
                customFeedItems.unshift(clonedTweet.outerHTML);
                saveCustomFeed();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            retweetDropdown?.classList.add('hidden');
        });
    }

    if (actionQuoteMenu) {
        actionQuoteMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTweetToClone && quoteEmbeddedTweet) {
                const clonedTweet = activeTweetToClone.cloneNode(true);
                clonedTweet.removeAttribute('data-tweet-id');
                clonedTweet.style.border = 'none';
                clonedTweet.style.margin = '0';
                quoteEmbeddedTweet.innerHTML = '';
                quoteEmbeddedTweet.appendChild(clonedTweet);
                quoteModalOverlay?.classList.remove('hidden');
                quoteTextarea?.focus();
            }
            retweetDropdown?.classList.add('hidden');
        });
    }

    if (quoteCloseBtn && quoteModalOverlay && quoteTextarea) {
        quoteCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            quoteModalOverlay.classList.add('hidden');
            quoteTextarea.value = '';
        });

        quoteModalOverlay.addEventListener('click', (e) => {
            if (e.target === quoteModalOverlay) {
                quoteModalOverlay.classList.add('hidden');
                quoteTextarea.value = '';
            }
        });
    }

    if (submitQuoteBtn && quoteTextarea && feedContainer && quoteModalOverlay) {
        submitQuoteBtn.addEventListener('click', () => {
            const quoteText = quoteTextarea.value.trim();
            if (!quoteText || !activeTweetToClone) {
                return;
            }

            const sampleTweet = document.querySelector('.feed-timeline .tweet');
            const newTweet = document.createElement('div');
            newTweet.className = 'tweet';
            newTweet.setAttribute(
                'data-tweet-id',
                `tweet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
            );

            const left = document.createElement('div');
            left.className = 'tweet-left';
            const av = document.createElement('div');
            av.className = 'tweet-avatar';
            const img = document.createElement('img');
            img.src = 'resources/imgs/dullz_dp.jpg';
            img.alt = 'dullz';
            av.appendChild(img);
            left.appendChild(av);

            const content = document.createElement('div');
            content.className = 'tweet-content';

            const header = document.createElement('div');
            header.className = 'tweet-header';
            const userInfo = document.createElement('div');
            userInfo.className = 'tweet-user-info';
            const name = document.createElement('span');
            name.className = 'tweet-name';
            name.textContent = 'dullz';
            const handle = document.createElement('span');
            handle.className = 'tweet-handle';
            handle.textContent = '@UncleDullaz';
            const time = document.createElement('span');
            time.className = 'tweet-time';
            time.textContent = ' · Now';
            userInfo.append(name, handle, time);
            const options = document.createElement('div');
            options.className = 'tweet-options';
            options.innerHTML = '<svg viewBox="0 0 24 24"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>';
            header.append(userInfo, options);

            const textEl = document.createElement('div');
            textEl.className = 'tweet-text';
            textEl.textContent = quoteText;

            const embedWrap = document.createElement('div');
            embedWrap.className = 'quoted-tweet-embed';
            const embedClone = activeTweetToClone.cloneNode(true);
            embedClone.removeAttribute('data-tweet-id');
            embedWrap.appendChild(embedClone);

            newTweet.appendChild(left);
            content.append(header, textEl, embedWrap);
            if (sampleTweet) {
                const footerClone = sampleTweet.querySelector('.tweet-footer');
                if (footerClone) {
                    content.appendChild(footerClone.cloneNode(true));
                }
            }
            newTweet.appendChild(content);

            feedContainer.prepend(newTweet);
            const originalRepostBtn = activeTweetToClone.querySelector('.action-repost');
            if (originalRepostBtn) {
                originalRepostBtn.classList.add('is-reposted');
            }
            const repostTweetId = activeTweetToClone.getAttribute('data-tweet-id');
            if (repostTweetId) {
                ensureTweetState(repostTweetId);
                tweetStates[repostTweetId].reposted = true;
                saveTweetStates();
            }
            customFeedItems.unshift(newTweet.outerHTML);
            saveCustomFeed();
            quoteModalOverlay.classList.add('hidden');
            quoteTextarea.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
