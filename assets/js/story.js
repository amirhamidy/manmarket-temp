document.addEventListener('DOMContentLoaded', () => {
    const storiesWrapper = document.querySelector('.story-module-stories-wrapper');
    const storyItems = document.querySelectorAll('.story-module-story-item');
    const modal = document.querySelector('.story-module-story-modal');
    const modalContent = modal.querySelector('.story-module-modal-content');
    const modalHeaderAvatar = modal.querySelector('.story-module-story-header-avatar');
    const modalHeaderUsername = modal.querySelector('.story-module-story-header-username');
    const modalHeaderTime = modal.querySelector('.story-module-story-header-time');
    // const closeModalBtn = modal.querySelector('.story-module-modal-close'); // این خط حذف شد
    const modalProgressBarContainer = modal.querySelector('.story-module-modal-progress-bar-container');
    const modalMediaContainer = modal.querySelector('.story-module-modal-story-media');
    const modalNavPrevBtn = modalContent.querySelector('.story-module-nav-button-prev');
    const modalNavNextBtn = modalContent.querySelector('.story-module-nav-button-next');

    const externalCaptionElement = modalContent.querySelector('#story-module-external-caption');
    const captionTextElement = externalCaptionElement.querySelector('#story-module-caption-text');
    captionTextElement.setAttribute('href' , '')
    captionTextElement.setAttribute('target' , '_blank')
    captionTextElement.style.cursor = 'pointer'

    captionTextElement.addEventListener('click' , ()=>{
        window.location.href = '../../single.product.html'
    })


    let currentStoryUserIndex = 0;
    let currentStoryMediaIndex = 0;
    let storyInterval;
    let progressBarElements = [];
    let currentMediaElement = null;
    let loaderElement = null;
    let videoPlayer = null;

    let isMobile = window.matchMedia("(max-width: 768px)").matches;

    let isDragging = false;
    let startPos = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function showLoader() {
        if (!loaderElement) {
            loaderElement = document.createElement('div');
            loaderElement.classList.add('story-module-loader');
            modalMediaContainer.appendChild(loaderElement);
        }
        loaderElement.style.display = 'block';
    }

    function hideLoader() {
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }
    }

    function pauseCurrentMedia() {
        clearInterval(storyInterval);
        if (videoPlayer) {
            videoPlayer.pause();
        }
        pauseProgressBar();
    }

    function resumeCurrentMedia() {
        resumeProgressBar();
        if (currentMediaElement && currentMediaElement.tagName === 'IMG') {
            const mediaDuration = parseInt(currentMediaElement.getAttribute('data-duration'));
            const currentProgressBar = progressBarElements[currentStoryMediaIndex];
            const innerBar = currentProgressBar.querySelector('.story-module-progress-inner');
            let remainingDuration;

            if (innerBar) {
                const currentWidthPx = parseFloat(window.getComputedStyle(innerBar).width);
                const totalWidthPx = parseFloat(window.getComputedStyle(currentProgressBar).width);
                const progressRatio = currentWidthPx / totalWidthPx;
                remainingDuration = mediaDuration * (1 - progressRatio);
                if (remainingDuration < 0) remainingDuration = 0;
            } else {
                remainingDuration = mediaDuration;
            }
            storyInterval = setTimeout(nextStory, remainingDuration);
        } else if (videoPlayer) {
            videoPlayer.play().catch(error => console.warn("Autoplay resume prevented:", error));
        }
    }

    function openStoryModal(userIndex, mediaIndex = 0) {
        currentStoryUserIndex = userIndex;
        currentStoryMediaIndex = mediaIndex;

        modal.classList.add('story-module-active');

        modalContent.style.transform = isMobile ? 'translateY(100vh)' : 'scale(0.9)';
        modal.style.opacity = '0';

        void modalContent.offsetWidth;

        requestAnimationFrame(() => {
            modalContent.style.transform = 'translateY(0) scale(1)';
            modal.style.opacity = '1';
        });

        renderStory();

        const currentUserItem = storyItems[currentStoryUserIndex];
        const userStoryItemBorder = currentUserItem.querySelector('.story-module-story-gradient-border');
        if (userStoryItemBorder) {
            userStoryItemBorder.classList.add('story-module-story-seen');
        }
    }

    function closeStoryModal() {
        clearInterval(storyInterval);
        if (videoPlayer) {
            videoPlayer.dispose();
            videoPlayer = null;
        }
        hideLoader();



        modalContent.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
        modal.style.transition = 'opacity 0.3s ease-in';

        if (isMobile) {
            modalContent.style.transform = `translateY(${window.innerHeight}px)`;
            modal.style.opacity = '0';
        } else {
            modalContent.style.transform = 'scale(0.9)';
            modal.style.opacity = '0';
        }

        setTimeout(() => {
            modal.classList.remove('story-module-active');
            modalContent.style.transform = '';
            modalContent.style.transition = '';
            modal.style.opacity = '';
            modal.style.transition = '';
            modalMediaContainer.style.transform = '';
            resetProgressBars();
            currentMediaElement = null;
            if (captionTextElement) {
                captionTextElement.textContent = '';
            }
            externalCaptionElement.classList.add('story-module-d-none');

        }, 300);
    }

    function resetProgressBars() {
        modalProgressBarContainer.innerHTML = '';
        progressBarElements = [];
    }

    async function renderStory() {
        clearInterval(storyInterval);
        if (videoPlayer) {
            videoPlayer.dispose();
            videoPlayer = null;
        }
        hideLoader();

        const currentUserItem = storyItems[currentStoryUserIndex];
        if (!currentUserItem) {
            closeStoryModal();
            return;
        }

        const mediaListContainer = currentUserItem.querySelector('.story-module-media-list');
        const mediaElements = Array.from(mediaListContainer.children);

        if (mediaElements.length === 0 || currentStoryMediaIndex >= mediaElements.length || currentStoryMediaIndex < 0) {
            nextStory();
            return;
        }

        const currentMediaOriginal = mediaElements[currentStoryMediaIndex];

        modalHeaderAvatar.src = currentUserItem.getAttribute('data-avatar');
        modalHeaderUsername.textContent = currentUserItem.getAttribute('data-username');
        modalHeaderTime.textContent = '';

        const captionText = currentMediaOriginal.getAttribute('data-caption');
        if (captionTextElement) {
            captionTextElement.textContent = captionText || '';
            externalCaptionElement.classList.remove('story-module-d-none');
        } else {
            externalCaptionElement.classList.add('story-module-d-none');
        }


        modalMediaContainer.innerHTML = '';
        modalMediaContainer.style.transition = 'none';
        modalMediaContainer.style.transform = 'translateX(0)';

        const clonedMedia = currentMediaOriginal.cloneNode(true);
        clonedMedia.classList.remove('story-module-d-none');
        clonedMedia.classList.add('story-module-fade-in');

        if (clonedMedia.tagName === 'VIDEO') {
            clonedMedia.classList.add('video-js');
            clonedMedia.classList.add('vjs-default-skin');
        }

        modalMediaContainer.appendChild(clonedMedia);
        currentMediaElement = clonedMedia;

        const mediaDuration = parseInt(clonedMedia.getAttribute('data-duration'));

        setupProgressBars(mediaElements.length);

        if (clonedMedia.tagName === 'VIDEO') {
            showLoader();
            videoPlayer = videojs(clonedMedia, {
                autoplay: true,
                muted: false,
                controls: true,
                preload: 'auto',
                playsinline: true,
                liveui: true,
                fullscreen: {
                    exitFullScreenOnEnd: false,
                    enterFullScreenOnPlay: false
                },
                controlBar: {
                    fullscreenToggle: false,
                    pictureInPictureToggle: false,
                    children: [
                        'playToggle',
                        'volumePanel',
                        'currentTimeDisplay',
                        'timeDivider',
                        'durationDisplay',
                        'progressControl',
                        'spacer',
                        'chaptersButton',
                        'fullscreenToggle'
                    ]
                },
                userActions: {
                    doubleClick: false,
                    hotkeys: false,
                }
            }, function() {
                this.on('loadedmetadata', function() {
                    hideLoader();
                    startProgressBar(this.duration() * 1000);
                    modalHeaderTime.textContent = formatTime(this.duration());
                });

                this.on('timeupdate', function() {
                    const progress = (this.currentTime() / this.duration());
                    const innerBar = progressBarElements[currentStoryMediaIndex].querySelector('.story-module-progress-inner');
                    if (innerBar) {
                        innerBar.style.width = `${progress * 100}%`;
                        innerBar.style.transition = 'none';
                    }
                });

                this.on('ended', function() {
                    nextStory();
                });

                this.on('error', function(e) {
                    console.error("Video.js Error:", e);
                    hideLoader();
                    nextStory();
                });

                this.play().catch(error => {
                    console.warn("Autoplay was prevented:", error);
                });
            });

        } else if (clonedMedia.tagName === 'IMG') {
            showLoader();
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = clonedMedia.src;
                    img.onload = () => { hideLoader(); resolve(); };
                    img.onerror = (e) => { hideLoader(); reject(new Error(`Image load error for: ${img.src}`)); };
                });
                startProgressBar(mediaDuration);
                storyInterval = setTimeout(nextStory, mediaDuration);

                let remainingTime = mediaDuration;
                const updateHeaderTime = () => {
                    modalHeaderTime.textContent = formatTime(remainingTime / 1000);
                    if (remainingTime > 0 && storyInterval) {
                        remainingTime -= 1000;
                        setTimeout(updateHeaderTime, 1000);
                    }
                };
                updateHeaderTime();

            } catch (error) {
                hideLoader();
                nextStory();
            }
        }
    }

    function setupProgressBars(count) {
        modalProgressBarContainer.innerHTML = '';
        progressBarElements = [];
        for (let i = 0; i < count; i++) {
            const bar = document.createElement('div');
            bar.classList.add('story-module-modal-progress-bar');
            modalProgressBarContainer.appendChild(bar);
            progressBarElements.push(bar);
        }
        for (let i = 0; i < currentStoryMediaIndex; i++) {
            if (progressBarElements[i]) {
                progressBarElements[i].classList.add('story-module-completed');
            }
        }
    }

    function startProgressBar(duration) {
        if (progressBarElements[currentStoryMediaIndex]) {
            const currentProgressBar = progressBarElements[currentStoryMediaIndex];
            const innerBar = document.createElement('span');
            innerBar.classList.add('story-module-progress-inner');
            currentProgressBar.innerHTML = '';
            currentProgressBar.appendChild(innerBar);

            innerBar.style.transition = 'none';
            innerBar.style.width = '0%';
            void innerBar.offsetWidth;

            innerBar.style.transition = `width ${duration / 1000}s linear`;
            innerBar.style.width = '100%';
        }
    }

    function pauseProgressBar() {
        if (progressBarElements[currentStoryMediaIndex]) {
            const currentProgressBar = progressBarElements[currentStoryMediaIndex];
            const innerBar = currentProgressBar.querySelector('.story-module-progress-inner');
            if (innerBar) {
                const currentWidth = window.getComputedStyle(innerBar).width;
                innerBar.style.transition = 'none';
                innerBar.style.width = currentWidth;
            }
        }
    }

    function resumeProgressBar() {
        if (progressBarElements[currentStoryMediaIndex]) {
            const currentProgressBar = progressBarElements[currentStoryMediaIndex];
            const innerBar = currentProgressBar.querySelector('.story-module-progress-inner');
            if (innerBar) {
                let totalDuration;
                if (currentMediaElement.tagName === 'VIDEO' && videoPlayer && videoPlayer.duration()) {
                    totalDuration = videoPlayer.duration() * 1000;
                    const elapsedRatio = videoPlayer.currentTime() / videoPlayer.duration();
                    innerBar.style.transition = 'none';
                    innerBar.style.width = `${elapsedRatio * 100}%`;
                    void innerBar.offsetWidth;

                    let remainingTimeInSeconds = videoPlayer.duration() - videoPlayer.currentTime();
                    if (remainingTimeInSeconds < 0) remainingTimeInSeconds = 0;

                    innerBar.style.transition = `width ${remainingTimeInSeconds}s linear`;
                    innerBar.style.width = '100%';

                } else {
                    totalDuration = parseInt(currentMediaElement.getAttribute('data-duration'));
                    const currentWidthPx = parseFloat(window.getComputedStyle(innerBar).width);
                    const totalWidthPx = parseFloat(window.getComputedStyle(currentProgressBar).width);
                    const progressRatio = currentWidthPx / totalWidthPx;
                    let remainingDuration = totalDuration * (1 - progressRatio);
                    if (remainingDuration < 0) remainingDuration = 0;

                    innerBar.style.transition = `width ${remainingDuration / 1000}s linear`;
                    innerBar.style.width = '100%';
                }
            }
        }
    }

    function nextStory() {
        pauseCurrentMedia();

        if (currentStoryUserIndex < storyItems.length && progressBarElements[currentStoryMediaIndex]) {
            progressBarElements[currentStoryMediaIndex].classList.add('story-module-completed');
            const innerBar = progressBarElements[currentStoryMediaIndex].querySelector('.story-module-progress-inner');
            if (innerBar) {
                innerBar.style.transition = 'none';
                innerBar.style.width = '100%';
            }
        }

        currentStoryMediaIndex++;

        const currentUserItem = storyItems[currentStoryUserIndex];
        let mediaElements = [];
        if (currentUserItem) {
            const mediaListContainer = currentUserItem.querySelector('.story-module-media-list');
            if (mediaListContainer) {
                mediaElements = Array.from(mediaListContainer.children);
            }
        }

        if (currentStoryMediaIndex < mediaElements.length) {
            renderStory();
        } else {
            currentStoryUserIndex++;
            currentStoryMediaIndex = 0;

            if (currentStoryUserIndex < storyItems.length) {
                openStoryModal(currentStoryUserIndex);
            } else {
                closeStoryModal();
            }
        }
    }

    function prevStory() {
        pauseCurrentMedia();

        if (currentStoryUserIndex < storyItems.length && progressBarElements[currentStoryMediaIndex]) {
            progressBarElements[currentStoryMediaIndex].classList.remove('story-module-completed');
            const innerBar = progressBarElements[currentStoryMediaIndex].querySelector('.story-module-progress-inner');
            if (innerBar) {
                innerBar.style.transition = 'none';
                innerBar.style.width = '0%';
            }
        }

        currentStoryMediaIndex--;

        const currentUserItem = storyItems[currentStoryUserIndex];
        let mediaElements = [];
        if (currentUserItem) {
            const mediaListContainer = currentUserItem.querySelector('.story-module-media-list');
            if (mediaListContainer) {
                mediaElements = Array.from(mediaListContainer.children);
            }
        }

        if (currentStoryMediaIndex >= 0) {
            if (currentStoryUserIndex < storyItems.length && progressBarElements[currentStoryMediaIndex]) {
                progressBarElements[currentStoryMediaIndex].classList.remove('story-module-completed');
                const innerBar = progressBarElements[currentStoryMediaIndex].querySelector('.story-module-progress-inner');
                if (innerBar) {
                    innerBar.style.transition = 'none';
                    innerBar.style.width = '0%';
                }
            }
            renderStory();
        } else {
            currentStoryUserIndex--;
            if (currentStoryUserIndex >= 0) {
                const prevUserItem = storyItems[currentStoryUserIndex];
                const prevMediaListContainer = prevUserItem.querySelector('.story-module-media-list');
                const prevMediaElements = Array.from(prevMediaListContainer.children);
                currentStoryMediaIndex = prevMediaElements.length - 1;

                const userStoryItemBorder = prevUserItem.querySelector('.story-module-story-gradient-border');
                if (userStoryItemBorder && userStoryItemBorder.classList.contains('story-module-story-seen')) {
                    userStoryItemBorder.classList.remove('story-module-story-seen');
                }

                openStoryModal(currentStoryUserIndex, currentStoryMediaIndex);
            } else {
                closeStoryModal();
            }
        }
    }

    storyItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (hasDragged) {
                hasDragged = false;
                return;
            }
            openStoryModal(index);
        });
    });


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeStoryModal();
        }
    });
    let CloseStoryInMB = document.getElementById('close-btn-story')
    CloseStoryInMB.addEventListener('click' , ()=>{
        closeStoryModal();
    })
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('story-module-active')) {
            closeStoryModal();

        }
        if (e.key === 'ArrowRight' && modal.classList.contains('story-module-active')) {
            prevStory();
        }
        if (e.key === 'ArrowLeft' && modal.classList.contains('story-module-active')) {
            nextStory();
        }
    });

    if (modalNavPrevBtn) {
        modalNavPrevBtn.addEventListener('click', () => {
            prevStory();
        });
    }

    if (modalNavNextBtn) {
        modalNavNextBtn.addEventListener('click', () => {
            nextStory();
        });
    }

    window.addEventListener('resize', () => {
        isMobile = window.matchMedia("(max-width: 768px)").matches;
    });

    storiesWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasDragged = false;
        startPos = e.pageX - storiesWrapper.offsetLeft;
        scrollLeft = storiesWrapper.scrollLeft;
        storiesWrapper.classList.add('is-dragging');
    });

    storiesWrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - storiesWrapper.offsetLeft;
        const walk = (x - startPos) * 1.5;

        if (Math.abs(walk) > 5) {
            hasDragged = true;
        }

        storiesWrapper.scrollLeft = scrollLeft - walk;
    });

    storiesWrapper.addEventListener('mouseup', () => {
        isDragging = false;
        storiesWrapper.classList.remove('is-dragging');
    });

    storiesWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            storiesWrapper.classList.remove('is-dragging');
        }
    });

    storiesWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        hasDragged = false;
        startPos = e.touches[0].pageX - storiesWrapper.offsetLeft;
        scrollLeft = storiesWrapper.scrollLeft;
    });

    storiesWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - storiesWrapper.offsetLeft;
        const walk = (x - startPos) * 1.5;

        if (Math.abs(walk) > 5) {
            hasDragged = true;
        }

        storiesWrapper.scrollLeft = scrollLeft - walk;
    }, { passive: false });

    storiesWrapper.addEventListener('touchend', () => {
        isDragging = false;
    });

    function scrollStories(direction) {
        const itemWidth = storyItems[0].offsetWidth + 20;
        let currentScroll = storiesWrapper.scrollLeft;
        let targetScroll;

        if (direction === 'left') {
            targetScroll = currentScroll + itemWidth * 3;
        } else if (direction === 'right') {
            targetScroll = currentScroll - itemWidth * 3;
        }

        targetScroll = Math.max(0, targetScroll);
        targetScroll = Math.min(storiesWrapper.scrollWidth - storiesWrapper.clientWidth, targetScroll);

        storiesWrapper.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }
});

const hrefSlides = document.querySelectorAll('.href-slide');

hrefSlides.forEach(link => {
    link.setAttribute('target', '_blank');
});




