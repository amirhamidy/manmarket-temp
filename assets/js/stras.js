const starContainers = document.querySelectorAll('.stars');
starContainers.forEach(container => {
    const stars = container.querySelectorAll('.star');
    let rating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                s.classList.remove('hover');
                if (i <= index) {
                    s.classList.add('hover');
                }
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                s.classList.remove('hover');
            });

            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('rated');
                }
            });
        });

        star.addEventListener('click', () => {
            rating = index + 1;
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('rated');
                } else {
                    s.classList.remove('rated');
                }
            });
        });
    });
});



