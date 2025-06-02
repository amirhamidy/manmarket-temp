// این کد را بعد از کد اصلی جاوااسکریپت یا در انتهای DOMContentLoaded قرار دهید
document.addEventListener('DOMContentLoaded', function() { // یا اگر داخل DOMContentLoaded اصلی هست، این خط رو حذف کن

    const allDragSliders = document.querySelectorAll('.cs-f--slider');

    if (allDragSliders.length > 0) {
        allDragSliders.forEach((sliderEl) => {
            // اطمینان از اینکه اسلایدهای داخلش flex هستن (اگر از کلاس row بوت‌استرپ استفاده می‌کنی)
            const slidesInDragSlider = sliderEl.querySelectorAll('.slide');
            slidesInDragSlider.forEach(s => {
                if (s.classList.contains('row')) { // اگر کلاس row داره، display: flex نیازه
                    s.style.display = 'flex';
                }
                // اگر از ساختار بوت‌استرپ برای آیتم‌های داخلش استفاده نمی‌کنی و
                // فقط آیتم‌های article داری، باید مطمئن بشی که کنار هم چیده میشن
                // (مثلا با display: inline-block یا flex روی خود article ها اگر والدشون flex نیست)
            });


            let isDown = false;
            let startX;
            let scrollLeftVal;

            sliderEl.addEventListener('mousedown', (e) => {
                isDown = true;
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
                const walk = (x - startX) * 1.5; // Multiplier for scroll speed
                sliderEl.scrollLeft = scrollLeftVal - walk;
            });

            // Touch Events
            sliderEl.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - sliderEl.offsetLeft;
                scrollLeftVal = sliderEl.scrollLeft;
            }, { passive: true });

            sliderEl.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                // e.preventDefault(); // Uncomment and set passive: false if you want to prevent vertical scroll
                const x = e.touches[0].pageX - sliderEl.offsetLeft;
                const walk = (x - startX) * 1.5;
                sliderEl.scrollLeft = scrollLeftVal - walk;
            }); // Add { passive: false } if e.preventDefault() is used

            sliderEl.addEventListener('touchend', () => {
                if (!isDown) return;
                isDown = false;
                sliderEl.classList.remove('active-dragging');
            });
            sliderEl.addEventListener('touchcancel', () => {
                if (!isDown) return;
                isDown = false;
                sliderEl.classList.remove('active-dragging');
            });

            sliderEl.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
}); // این }); هم اگر داخل DOMContentLoaded اصلی هست، حذف شود.