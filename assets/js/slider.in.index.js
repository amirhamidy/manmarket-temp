document.addEventListener('DOMContentLoaded', function() {
    const allDragSliders = document.querySelectorAll('.cs-f--slider');

    if (allDragSliders.length > 0) {
        allDragSliders.forEach((sliderEl) => {
            const slidesInDragSlider = sliderEl.querySelectorAll('.slide');
            slidesInDragSlider.forEach(s => {
                if (s.classList.contains('row')) {
                    s.style.display = 'flex';
                }
            });

            let isDown = false;
            let isDragging = false;
            let startX, startY;
            let scrollLeftVal;
            let scrollDirectionLocked = false;
            let isHorizontalScroll = false;

            sliderEl.addEventListener('mousedown', (e) => {
                isDown = true;
                isDragging = false;
                sliderEl.classList.add('active-dragging');
                startX = e.pageX - sliderEl.offsetLeft;
                scrollLeftVal = sliderEl.scrollLeft;
            });

            sliderEl.addEventListener('mouseleave', () => {
                if (!isDown) return;
                isDown = false;
                sliderEl.classList.remove('active-dragging');
            });

            sliderEl.addEventListener('mouseup', () => {
                if (!isDown) return;
                isDown = false;
                sliderEl.classList.remove('active-dragging');
            });

            sliderEl.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - sliderEl.offsetLeft;
                const walk = x - startX;
                if (Math.abs(walk) > 10) {
                    isDragging = true;
                }
                sliderEl.scrollLeft = scrollLeftVal - (walk * 1.5);
            });

            sliderEl.addEventListener('touchstart', (e) => {
                isDown = true;
                isDragging = false;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
                scrollLeftVal = sliderEl.scrollLeft;
                scrollDirectionLocked = false;
                isHorizontalScroll = false;
            });

            sliderEl.addEventListener('touchmove', (e) => {
                if (!isDown) return;

                if (!scrollDirectionLocked) {
                    const deltaX = Math.abs(e.touches[0].pageX - startX);
                    const deltaY = Math.abs(e.touches[0].pageY - startY);

                    if (deltaX > 5 || deltaY > 5) {
                        if (deltaX > deltaY) {
                            isHorizontalScroll = true;
                        }
                        scrollDirectionLocked = true;
                    }
                }

                if (isHorizontalScroll) {
                    e.preventDefault();
                    const x = e.touches[0].pageX;
                    const walk = x - startX;
                    if (Math.abs(walk) > 10) {
                        isDragging = true;
                    }
                    sliderEl.scrollLeft = scrollLeftVal - (walk * 1.5);
                }
            });

            const resetState = () => {
                if (!isDown) return;
                isDown = false;
                sliderEl.classList.remove('active-dragging');
            };

            sliderEl.addEventListener('touchend', resetState);
            sliderEl.addEventListener('touchcancel', resetState);

            const links = sliderEl.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (isDragging) {
                        e.preventDefault();
                    }
                });
            });

            sliderEl.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
});