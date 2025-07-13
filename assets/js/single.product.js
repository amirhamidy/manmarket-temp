document.addEventListener('DOMContentLoaded', function () {
    const galleryTopSwiperEl = document.getElementById('galleryTopSwiper');
    const galleryThumbsSwiperEl = document.getElementById('galleryThumbsSwiper');
    const fullscreenModalEl = document.getElementById('fullscreenGalleryModal');
    const verticalGalleryContentEl = document.getElementById('verticalGalleryContainer');
    const closeModalButton = document.getElementById('modalCloseButton');
    const colorButtonContainer = document.querySelector('.color-selection-buttons');
    const currentYearEl = document.getElementById('currentYear');
    const productSkuEl = document.getElementById('productSku');

    function calculateAndSetTickPathLength() {
        const tickSVGPath = "M4.5 8.5l2.5 2.5 5-5";
        const tempTickSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tempTickSVG.style.visibility = 'hidden';
        tempTickSVG.style.position = 'absolute';
        const tempTickPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempTickPath.setAttribute("d", tickSVGPath);
        tempTickPath.style.strokeWidth = "2.5";
        tempTickPath.style.fill = "none";
        tempTickSVG.appendChild(tempTickPath);
        document.body.appendChild(tempTickSVG);
        const pathLength = tempTickPath.getTotalLength();
        document.body.removeChild(tempTickSVG);
        document.documentElement.style.setProperty('--tick-path-length', pathLength.toFixed(2));
    }
    calculateAndSetTickPathLength();

    const productImages = [
        { main: 'assets/img/iphone/blue/1.webp', thumb: 'assets/img/iphone/blue/1.webp', alt: 'گوشی A15 سرمه‌ای - نما ۱', color: 'navy' },
        { main: 'assets/img/iphone/blue/2.webp', thumb: 'assets/img/iphone/blue/2.webp', alt: 'گوشی A15 سرمه‌ای - نما ۲', color: 'navy' },
        { main: 'assets/img/iphone/blue/3.webp', thumb: 'assets/img/iphone/blue/3.webp', alt: 'گوشی A15 سرمه‌ای - نما ۳', color: 'navy' },
        { main: 'assets/img/iphone/green/1.webp', thumb: 'assets/img/iphone/green/1.webp', alt: 'گوشی A15 آبی روشن - نما ۱', color: 'green' },
        { main: 'assets/img/iphone/green/2.webp', thumb: 'assets/img/iphone/green/2.webp', alt: 'گوشی A15 آبی روشن - نما ۲', color: 'green' },
        { main: 'assets/img/iphone/green/3.webp', thumb: 'assets/img/iphone/green/3.webp', alt: 'گوشی A15 آبی روشن - نما ۳', color: 'green' },
        { main: 'assets/img/iphone/white/1.webp', thumb: 'assets/img/iphone/white/1.webp', alt: 'گوشی A15 سفید - نما ۱', color: 'white' },
        { main: 'assets/img/iphone/white/2.webp', thumb: 'assets/img/iphone/white/2.webp', alt: 'گوشی A15 سفید - نما ۲', color: 'white' },
        { main: 'assets/img/iphone/white/3.webp', thumb: 'assets/img/iphone/white/3.webp', alt: 'گوشی A15 سفید - نما ۳', color: 'white' },
    ];

    let galleryTop, galleryThumbs;
    const BASE_SKU = "SAM-A15";
    const DEFAULT_STORAGE = "256G";

    function initSwiper(initialIndex = 0) {
        if (!galleryTopSwiperEl || !galleryThumbsSwiperEl) {
            console.error("Swiper container elements not found. Check your HTML IDs.");
            return;
        }

        if (galleryThumbs && typeof galleryThumbs.destroy === 'function') {
            galleryThumbs.destroy(true, true);
            galleryThumbs = null;
        }
        if (galleryTop && typeof galleryTop.destroy === 'function') {
            galleryTop.destroy(true, true);
            galleryTop = null;
        }

        const galleryTopWrapper = galleryTopSwiperEl.querySelector('.swiper-wrapper');
        const galleryThumbsWrapper = galleryThumbsSwiperEl.querySelector('.swiper-wrapper');

        if (!galleryTopWrapper || !galleryThumbsWrapper) {
            console.error("Swiper wrapper elements not found. Make sure .swiper-wrapper exists inside your Swiper containers.");
            return;
        }

        galleryTopWrapper.innerHTML = '';
        galleryThumbsWrapper.innerHTML = '';

        if (productImages.length === 0) {
            galleryTopWrapper.innerHTML = '<div class="swiper-slide" style="display:flex; align-items:center; justify-content:center; height:100%;"><p style="text-align:center; padding: 20px;">تصویری برای نمایش موجود نیست.</p></div>';
            return;
        }

        productImages.forEach(imgData => {
            galleryTopWrapper.innerHTML += `<div class="swiper-slide"><img class="position-static" src="${imgData.main}" alt="${imgData.alt || 'تصویر محصول'}"></div>`;
            galleryThumbsWrapper.innerHTML += `<div class="swiper-slide"><img class="position-static" src="${imgData.thumb}" alt="${imgData.alt || 'تصویر بندانگشتی محصول'}"></div>`;
        });

        galleryThumbs = new Swiper(galleryThumbsSwiperEl, {
            spaceBetween: 10,
            slidesPerView: Math.min(4, productImages.length),
            freeMode: true,
            watchSlidesProgress: true,
        });

        galleryTop = new Swiper(galleryTopSwiperEl, {
            spaceBetween: 10,
            slidesPerView: 1,
            thumbs: {
                swiper: galleryThumbs
            },
        });

        if (galleryTop && productImages.length > initialIndex) {
            galleryTop.slideTo(initialIndex, 0);
            if (galleryThumbs) {
                galleryThumbs.slideTo(initialIndex, 0);
            }
        }
    }

    function openFullscreenModal(initialIndex = 0) {
        if (!fullscreenModalEl || !verticalGalleryContentEl) return;

        if (!galleryTop || !galleryTop.slides || galleryTop.slides.length === 0) {
            alert("تصویری برای نمایش در حالت تمام صفحه موجود نیست.");
            return;
        }

        verticalGalleryContentEl.innerHTML = '';
        if (productImages.length > 0) {
            productImages.forEach(imgData => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('gallery-item');
                itemDiv.innerHTML = `<img src="${imgData.main}" alt="${imgData.alt || 'تصویر محصول در حالت تمام صفحه'}">`;
                verticalGalleryContentEl.appendChild(itemDiv);
            });

            fullscreenModalEl.style.display = 'block';
            fullscreenModalEl.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            const actualInitialIndex = Math.min(initialIndex, productImages.length - 1);
            if (verticalGalleryContentEl.children[actualInitialIndex]) {
                setTimeout(() => {
                    verticalGalleryContentEl.children[actualInitialIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
            if(closeModalButton) closeModalButton.focus();
        } else {
            alert("تصویری برای نمایش در حالت تمام صفحه موجود نیست.");
        }
    }

    function closeFullscreenModal() {
        if (!fullscreenModalEl) return;
        fullscreenModalEl.style.display = 'none';
        fullscreenModalEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if(galleryTopSwiperEl) galleryTopSwiperEl.focus();
    }

    function updateSku(selectedColor) {
        if (productSkuEl && selectedColor) {
            productSkuEl.textContent = `${BASE_SKU}-${selectedColor.toUpperCase()}-${DEFAULT_STORAGE}`;
        }
    }

    let initialColor = null;
    let initialIndex = 0;

    if (colorButtonContainer) {
        const colorButtons = colorButtonContainer.querySelectorAll('.btn-color');

        const activeColorButton = colorButtonContainer.querySelector('.btn-color.active-cs');
        if (activeColorButton) {
            initialColor = activeColorButton.dataset.colorValue;
        } else {
            const firstColorButton = colorButtonContainer.querySelector('.btn-color');
            if (firstColorButton) {
                firstColorButton.classList.add('active-cs');
                initialColor = firstColorButton.dataset.colorValue;
            }
        }

        if (initialColor) {
            const tempIndex = productImages.findIndex(img => img.color === initialColor);
            initialIndex = (tempIndex !== -1) ? tempIndex : 0;
            updateSku(initialColor);
        } else if (productImages.length > 0) {
            updateSku(productImages[0].color);
        }

        initSwiper(initialIndex);

        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                colorButtons.forEach(btn => btn.classList.remove('active-cs'));
                this.classList.add('active-cs');

                const selectedColor = this.dataset.colorValue;
                updateSku(selectedColor);

                const firstImageIndexForSelectedColor = productImages.findIndex(img => img.color === selectedColor);

                if (firstImageIndexForSelectedColor !== -1 && galleryTop && galleryThumbs) {
                    galleryTop.slideTo(firstImageIndexForSelectedColor);
                    galleryThumbs.slideTo(firstImageIndexForSelectedColor);
                } else if (galleryTop && galleryThumbs) {
                    console.warn(`Error: No image found in 'productImages' for color: "${selectedColor}". Sliding to index 0.`);
                    galleryTop.slideTo(0);
                    galleryThumbs.slideTo(0);
                }
            });
        });
    } else {
        initSwiper(0);
        if (productImages.length > 0) {
            updateSku(productImages[0].color);
        }
    }

    if (galleryTopSwiperEl) {
        galleryTopSwiperEl.addEventListener('click', () => {
            if (galleryTop && galleryTop.slides.length > 0 && typeof galleryTop.realIndex !== 'undefined') {
                openFullscreenModal(galleryTop.realIndex);
            } else {
                console.warn("Cannot open fullscreen modal: galleryTop is not initialized or has no slides.");
            }
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeFullscreenModal);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && fullscreenModalEl && fullscreenModalEl.style.display !== 'none') {
            closeFullscreenModal();
        }
    });

    if (fullscreenModalEl) {
        fullscreenModalEl.addEventListener('click', (event) => {
            if (event.target === fullscreenModalEl) {
                closeFullscreenModal();
            }
        });
    }

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    const ShareIcon = document.querySelector('.share-x');
    const HeartIcon = document.querySelector('.heart-x');
    const localOverlay = document.getElementById('sweetalertOverlay');

    const hideAllTooltips = () => {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltipEl => {
            const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipEl);
            if (tooltipInstance) {
                tooltipInstance.hide();
            }
        });
    };

    const showSweetAlertAndOverlay = async (options) => {
        if (localOverlay) {
            localOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            localOverlay.addEventListener('click', () => {
                Swal.close();
            }, { once: true });
        }

        await Swal.fire(options);

        hideAllTooltips();

        if (localOverlay) {
            localOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (ShareIcon) {
        ShareIcon.addEventListener('click', async () => {
            const currentUrl = window.location.href;
            let swalOptions = {};

            try {
                await navigator.clipboard.writeText(currentUrl);
                swalOptions = {
                    title: 'کپی شد!',
                    html: 'لینک صفحه در کلیپ‌بورد شما کپی شد.<br><small style="font-size: 0.8em;">(شما با ارسال این لینک برای دوستانتان می‌توانید محصولات دلخواهتان را به یکدیگر معرفی کنید)</small>',
                    icon: 'success',
                    position: 'center',
                    showConfirmButton: false,
                    customClass: {
                        title: 'swal2-title-small',
                        htmlContainer: 'swal2-html-container-small'
                    }
                };
            } catch (err) {
                swalOptions = {
                    title: 'خطا!',
                    text: 'متأسفانه کپی لینک انجام نشد. لطفاً دوباره امتحان کنید.',
                    icon: 'error',
                    confirmButtonText: 'باشه',
                    position: 'center',
                    customClass: {
                        title: 'swal2-title-small',
                        htmlContainer: 'swal2-html-container-small'
                    }
                };
            }
            await showSweetAlertAndOverlay(swalOptions);
        });
    } else {
        console.warn("هشدار: عنصر ShareIcon (.share-x) برای عملکرد اشتراک‌گذاری پیدا نشد.");
    }

    if (HeartIcon) {
        HeartIcon.addEventListener('click', async () => {
            let success = true;

            let swalOptions = {};
            if (success) {
                swalOptions = {
                    title: 'اضافه شد!',
                    text: 'با موفقیت به علاقه‌مندی‌های شما اضافه شد.',
                    icon: 'success',
                    position: 'center',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    customClass: {
                        title: 'swal2-title-small',
                        htmlContainer: 'swal2-html-container-small'
                    }
                };
            } else {
                swalOptions = {
                    title: 'خطا!',
                    text: 'متأسفانه مشکلی پیش آمد و آیتم به علاقه‌مندی‌ها اضافه نشد.',
                    icon: 'error',
                    confirmButtonText: 'باشه',
                    position: 'center',
                    customClass: {
                        title: 'swal2-title-small',
                        htmlContainer: 'swal2-html-container-small'
                    }
                };
            }
            await showSweetAlertAndOverlay(swalOptions);
        });
    } else {
        console.warn("هشدار: عنصر HeartIcon (.heart-x) برای عملکرد علاقه‌مندی‌ها پیدا نشد.");
    }

    if (!localOverlay) {
        console.warn("هشدار: عنصر Overlay (#sweetalertOverlay) پیدا نشد. عملکرد پوشش صفحه و بستن با کلیک بر روی آن غیرفعال خواهد بود.");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const starRatingInput = document.querySelector('.SH-HS-star-rating-input');
    if (starRatingInput) {
        const stars = Array.from(starRatingInput.querySelectorAll('i'));
        const hiddenInput = document.getElementById('userRating');
        let currentRating = parseInt(starRatingInput.dataset.currentRating || 0);

        function fillStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }

        fillStars(currentRating);
        hiddenInput.value = currentRating;

        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = parseInt(this.dataset.value);
                fillStars(currentRating);
                hiddenInput.value = currentRating;
                starRatingInput.dataset.currentRating = currentRating;
            });

            star.addEventListener('mouseover', function() {
                const hoverRating = parseInt(this.dataset.value);
                stars.forEach((s, index) => {
                    if (index < hoverRating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });

            star.addEventListener('mouseout', function() {
                fillStars(currentRating);
            });
        });
    }

    const staticRatingContainers = document.querySelectorAll('.SH-HS-static-rating');
    staticRatingContainers.forEach(container => {
        const rating = parseInt(container.dataset.rating || 0);
        container.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            if (i < rating) {
                star.classList.add('fas', 'fa-star');
            } else {
                star.classList.add('far', 'fa-star');
            }
            container.appendChild(star);
        }
    });

    const colorButtons = document.querySelectorAll('.SH-HS-btn-color');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('active-cs'));
            this.classList.add('active-cs');
        });
    });

    var galleryThumbs = new Swiper('.gallery-thumbs.SH-HS-gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        direction: 'horizontal',
        breakpoints: {
            992: {
                direction: 'vertical',
                slidesPerView: 'auto',
                freeMode: false,
            }
        }
    });

    var galleryTop = new Swiper('.gallery-top.SH-HS-gallery-top', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs
        }
    });

    const galleryTopSwiper = document.querySelector('.SH-HS-gallery-top');
    const fullscreenModal = document.querySelector('.SH-HS-fullscreen-modal');
    const closeModalBtn = document.querySelector('.SH-HS-close-btn');
    const scrollGallery = document.querySelector('.SH-HS-vertical-scroll-gallery');
    const overlay = document.querySelector('.SH-HS-overlay');

    if (galleryTopSwiper) {
        galleryTopSwiper.addEventListener('click', function() {
            scrollGallery.innerHTML = '';
            const mainImages = document.querySelectorAll('.SH-HS-gallery-top .swiper-slide img');
            mainImages.forEach(img => {
                const galleryItem = document.createElement('div');
                galleryItem.classList.add('SH-HS-gallery-item');
                const fullImg = document.createElement('img');
                fullImg.src = img.src;
                fullImg.alt = img.alt;
                galleryItem.appendChild(fullImg);
                scrollGallery.appendChild(galleryItem);
            });

            fullscreenModal.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            fullscreenModal.setAttribute('aria-hidden', 'true');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            fullscreenModal.setAttribute('aria-hidden', 'true');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const callBtn = document.querySelector('.call-btn');
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            var phoneNumber = '0123456789';
            window.location.href = 'tel:' + phoneNumber;
        });
    } else {
        console.warn("هشدار: دکمه تماس با کلاس 'call-btn' پیدا نشد.");
    }
});


document.addEventListener('DOMContentLoaded', function () {
    console.log('Splide initialization script is running!');

    var splide = new Splide('.SH-HS-related-splide', {
        type: 'slide',
        perPage: 4,
        gap: '10px',
        direction: 'rtl',
        arrows: false,
        pagination: true,
        autoplay: true,
        interval: 3500,
        pauseOnHover: true,
        pauseOnFocus: true,

        breakpoints: {
            575: {
                perPage: 1,
                gap: '10px',
            },
            991: {
                perPage: 3,
                gap: '15px',
            },
            1199: {
                perPage: 7,
                gap: '20px',
            },
        },
    });
    splide.mount();
});

document.addEventListener('DOMContentLoaded', () => {
    const messagesInner = document.querySelector('.not-rot-notification-messages-inner');
    const emojiElement = document.getElementById('notRotEmoji');
    const messageItems = document.querySelectorAll('.not-rot-message-item');
    let currentIndex = 0;
    const intervalTime = 3000;
    const messageHeight = 24;

    const contents = [
        { text: 'تعداد بازدید در 24 ساعت اخیر 1000  +', icon: 'assets/img/seenz.png' },
        { text: 'موجود در سبد خرید 56 نفر دیگر', icon: 'assets/img/money.soney.png' },
        { text: '3 عدد در انبار موجود است', icon: 'assets/img/ananan.png' },
    ];

    messageItems.forEach((item, index) => {
        if (contents[index]) {
            item.innerHTML = contents[index].text;
        }
    });

    function showMessage(index) {
        messagesInner.style.top = `-${index * messageHeight}px`;

        if (contents[index] && contents[index].icon) {
            emojiElement.style.transform = 'scale(0.5)';
            emojiElement.style.opacity = '0';

            setTimeout(() => {
                const iconContent = contents[index].icon;

                while (emojiElement.firstChild) {
                    emojiElement.removeChild(emojiElement.firstChild);
                }

                if (typeof iconContent === 'string' && (iconContent.endsWith('.png') || iconContent.endsWith('.jpg') || iconContent.endsWith('.jpeg') || iconContent.endsWith('.gif'))) {
                    const imgElement = document.createElement('img');
                    imgElement.src = iconContent;
                    imgElement.alt = "Notification Icon";
                    emojiElement.appendChild(imgElement);
                } else {
                    const spanElement = document.createElement('span');
                    spanElement.textContent = iconContent;
                    emojiElement.appendChild(spanElement);
                }

                emojiElement.style.transform = 'scale(1)';
                emojiElement.style.opacity = '1';
            }, 200);
        }
    }

    function nextMessage() {
        currentIndex = (currentIndex + 1) % contents.length;
        showMessage(currentIndex);
    }

    showMessage(currentIndex);

    setInterval(nextMessage, intervalTime);
});


document.querySelector('.alll-cs').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.nav-tabs button').forEach(el => el.classList.remove('active'));
    const targetButton = document.getElementById('description-tab2');
    targetButton.classList.add('active');
    targetButton.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});
document.querySelectorAll('.alll-cs').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = '#descriptionPane2'
        const tabBtnSelector = '#description-tab2'
        document.querySelectorAll('#productTab button').forEach(tab => tab.classList.remove('active'))
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'))
        const tabBtn = document.querySelector(tabBtnSelector)
        tabBtn.classList.add('active')
        const tabPane = document.querySelector(tabId)
        tabPane.classList.add('show', 'active')
        tabPane.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
})


