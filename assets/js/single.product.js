
document.addEventListener('DOMContentLoaded', function () {
    const galleryTopSwiperEl = document.getElementById('galleryTopSwiper');
    const galleryThumbsSwiperEl = document.getElementById('galleryThumbsSwiper');
    const verticalGalleryContentEl = document.getElementById('verticalGalleryContainer');
    const fullscreenModalEl = document.getElementById('fullscreenModalContainer');
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


        { main: 'assets/img/iphone/green/1.webp', thumb: 'assets/img/iphone/green/1.webp', alt: 'گوشی A15 آبی روشن - نما ۱', color: 'light-blue' },
        { main: 'assets/img/iphone/green/2.webp', thumb: 'assets/img/iphone/green/2.webp', alt: 'گوشی A15 آبی روشن - نما ۲', color: 'light-blue' },
        { main: 'assets/img/iphone/green/3.webp', thumb: 'assets/img/iphone/green/3.webp', alt: 'گوشی A15 آبی روشن - نما ۲', color: 'light-blue' },



        { main: 'assets/img/iphone/white/1.webp', thumb: 'assets/img/iphone/white/1.webp', alt: 'گوشی A15 سفید - نما ۱', color: 'white' },
        { main: 'assets/img/iphone/white/2.webp', thumb: 'assets/img/iphone/white/2.webp', alt: 'گوشی A15 سفید - نما ۱', color: 'white' },
        { main: 'assets/img/iphone/white/3.webp', thumb: 'assets/img/iphone/white/3.webp', alt: 'گوشی A15 سفید - نما ۲', color: 'white' },
    ];
    // ==============================================================================

    let galleryTop, galleryThumbs;
    const BASE_SKU = "SAM-A15";
    const DEFAULT_STORAGE = "256G";

    function initSwiper(imagesToShow = null) {
        if (!galleryTopSwiperEl || !galleryThumbsSwiperEl) {
            return;
        }
        const galleryTopWrapper = galleryTopSwiperEl.querySelector('.swiper-wrapper');
        const galleryThumbsWrapper = galleryThumbsSwiperEl.querySelector('.swiper-wrapper');

        if (!galleryTopWrapper || !galleryThumbsWrapper) return;

        galleryTopWrapper.innerHTML = '';
        galleryThumbsWrapper.innerHTML = '';

        let effectiveImages = imagesToShow;
        if (!effectiveImages || effectiveImages.length === 0) {
            // اگر هیچ تصویری برای نمایش پاس داده نشده (مثلا برای رنگی تصویر نیست)
            // گالری را خالی یا با یک پیام نشان بده
            galleryTopWrapper.innerHTML = '<div class="swiper-slide" style="display:flex; align-items:center; justify-content:center; height:100%;"><p style="text-align:center; padding: 20px;">تصویری برای این رنگ موجود نیست.</p></div>';
            if (galleryThumbs && typeof galleryThumbs.destroy === 'function') galleryThumbs.destroy(true, true);
            if (galleryTop && typeof galleryTop.destroy === 'function') galleryTop.destroy(true, true);
            galleryThumbs = null; //  مطمئن شویم که swiper قبلی پاک شده
            galleryTop = null;
            return; //  ادامه نده اگر تصویری نیست
        }

        effectiveImages.forEach(imgData => {
            galleryTopWrapper.innerHTML += `<div class="swiper-slide"><img class="position-static" src="${imgData.main}" alt="${imgData.alt || 'تصویر محصول'}"></div>`;
            galleryThumbsWrapper.innerHTML += `<div class="swiper-slide"><img class="position-static" src="${imgData.thumb}" alt="${imgData.alt || 'تصویر بندانگشتی محصول'}"></div>`;
        });

        if (galleryThumbs && typeof galleryThumbs.destroy === 'function') galleryThumbs.destroy(true, true);
        galleryThumbs = new Swiper(galleryThumbsSwiperEl, {
            spaceBetween: 10,
            slidesPerView: Math.min(4, effectiveImages.length > 0 ? effectiveImages.length : 1), // حداقل 1 اسلاید حتی اگر خالی
            freeMode: true,
            watchSlidesProgress: true,
        });

        if (galleryTop && typeof galleryTop.destroy === 'function') galleryTop.destroy(true, true);
        galleryTop = new Swiper(galleryTopSwiperEl, {
            spaceBetween: 10,
            slidesPerView: 1,
            thumbs: {
                swiper: (galleryThumbs && galleryThumbs.slides && galleryThumbs.slides.length > 0) ? galleryThumbs : null
            },
        });

        if (!galleryThumbs || !galleryThumbs.slides || galleryThumbs.slides.length === 0) {
            if (galleryTop && galleryTop.params.thumbs) {
                galleryTop.params.thumbs.swiper = null;
            }
            if (galleryTop && galleryTop.slides && galleryTop.slides.length > 0) {
                galleryTop.update(); //  آپدیت swiper اصلی اگر thumbs نیست
            }
        }
    }

    function openFullscreenModal(initialIndex = 0) {
        if (!fullscreenModalEl || !verticalGalleryContentEl) return;
        const currentActiveColor = colorButtonContainer?.querySelector('.btn-color.active-cs')?.dataset.colorValue;
        const imagesForModal = currentActiveColor
            ? productImages.filter(img => img.color === currentActiveColor)
            : productImages;

        verticalGalleryContentEl.innerHTML = '';
        if (imagesForModal.length > 0) {
            imagesForModal.forEach(imgData => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('gallery-item');
                itemDiv.innerHTML = `<img src="${imgData.main}" alt="${imgData.alt || 'تصویر محصول در حالت تمام صفحه'}">`;
                verticalGalleryContentEl.appendChild(itemDiv);
            });

            fullscreenModalEl.style.display = 'block';
            fullscreenModalEl.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            const actualInitialIndex = Math.min(initialIndex, imagesForModal.length - 1);
            if (verticalGalleryContentEl.children[actualInitialIndex]) {
                setTimeout(() => {
                    if (verticalGalleryContentEl.children[actualInitialIndex]) { // Double check
                        verticalGalleryContentEl.children[actualInitialIndex].scrollIntoView({ behavior: 'auto', block: 'start' });
                    }
                }, 50);
            }
            if(closeModalButton) closeModalButton.focus();
        } else {
            // اگر تصویری نیست، مودال را باز نکن یا پیام بده
            alert("تصویری برای نمایش در حالت تمام صفحه برای این رنگ موجود نیست.");
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

    if (colorButtonContainer) {
        const colorButtons = colorButtonContainer.querySelectorAll('.btn-color');
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('active-cs')) return; // اگر از قبل فعال است کاری نکن

                colorButtons.forEach(btn => btn.classList.remove('active-cs'));
                this.classList.add('active-cs');
                const selectedColor = this.dataset.colorValue;
                updateSku(selectedColor);

                const filteredImages = productImages.filter(img => img.color === selectedColor);
                initSwiper(filteredImages);
            });
        });

        const activeColorButton = colorButtonContainer.querySelector('.btn-color.active-cs');
        if (activeColorButton) {
            const initialColor = activeColorButton.dataset.colorValue;
            updateSku(initialColor);
            const initialFilteredImages = productImages.filter(img => img.color === initialColor);
            initSwiper(initialFilteredImages);
        } else {
            const firstColorButton = colorButtonContainer.querySelector('.btn-color');
            if(firstColorButton){
                firstColorButton.classList.add('active-cs');
                const initialColor = firstColorButton.dataset.colorValue;
                updateSku(initialColor);
                const initialFilteredImages = productImages.filter(img => img.color === initialColor);
                initSwiper(initialFilteredImages);
            } else {
                initSwiper([]); // گالری خالی اگر هیچ دکمه رنگی نیست
            }
        }
    } else {
        const firstColorAvailable = productImages.length > 0 ? productImages[0].color : null;
        if (firstColorAvailable) {
            const firstImages = productImages.filter(img => img.color === firstColorAvailable);
            initSwiper(firstImages);
        } else {
            initSwiper([]);
        }
    }

    if (galleryTopSwiperEl) {
        galleryTopSwiperEl.addEventListener('click', () => {
            if (galleryTop && typeof galleryTop.realIndex !== 'undefined' && galleryTop.slides.length > 0) {
                openFullscreenModal(galleryTop.realIndex);
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

    const reviewForm = document.getElementById('productReviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // alert('دیدگاه شما ثبت شد (این یک نمونه نمایشی است و اطلاعات به سرور ارسال نمی‌شود).');
            this.reset();
        });
    }
});
