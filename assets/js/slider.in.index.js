var swiper1 = new Swiper('#main-product-swiper-1', {
    slidesPerView: 4,
    spaceBetween: 20,
    grid: {
        rows: 2,
        fill: 'row',
    },
    navigation: {
        nextEl: '#main-product-swiper-1 .cs-slide-v-2-swiper-button-next',
        prevEl: '#main-product-swiper-1 .cs-slide-v-2-swiper-button-prev',
    },
    breakpoints: {
        992: { slidesPerView: 4, spaceBetween: 20, grid: { rows: 2.1, fill: 'row', }, },
        768: { slidesPerView: 3, spaceBetween: 20, grid: { rows: 2, fill: 'row', }, },
        480: { slidesPerView: 2, spaceBetween: 20, grid: { rows: 2, fill: 'row', }, },
        0: { slidesPerView: 2, spaceBetween: 18 , grid: { rows:  2.3, fill: 'row', }, }
    }
});

var swiper2 = new Swiper('#main-product-swiper-2', {
    slidesPerView: 4,
    spaceBetween: 20,
    grid: {
        rows: 2,
        fill: 'row',
    },
    navigation: {
        nextEl: '#main-product-swiper-2 .cs-slide-v-2-swiper-button-next',
        prevEl: '#main-product-swiper-2 .cs-slide-v-2-swiper-button-prev',
    },
    breakpoints: {
        992: { slidesPerView: 4, spaceBetween: 18, grid: { rows: 2.4, fill: 'row', }, },
        768: { slidesPerView: 3, spaceBetween: 18, grid: { rows: 2.4, fill: 'row', }, },
        480: { slidesPerView: 2, spaceBetween: 18, grid: { rows: 2.4, fill: 'row', }, },
        0: { slidesPerView: 2, spaceBetween: 18 , grid: { rows:  2.3, fill: 'row', }, }
    }
});

var swiper3 = new Swiper('#main-product-swiper-3', {
    slidesPerView: 4,
    spaceBetween: 20,
    grid: {
        rows: 2,
        fill: 'row',
    },
    navigation: {
        nextEl: '#main-product-swiper-3 .cs-slide-v-2-swiper-button-next',
        prevEl: '#main-product-swiper-3 .cs-slide-v-2-swiper-button-prev',
    },
    breakpoints: {
        992: { slidesPerView: 4, spaceBetween: 20, grid: { rows: 2, fill: 'row', }, },
        768: { slidesPerView: 3, spaceBetween: 15, grid: { rows: 2, fill: 'row', }, },
        480: { slidesPerView: 2, spaceBetween: 10, grid: { rows: 2, fill: 'row', }, },
        0: { slidesPerView: 2, spaceBetween: 18 , grid: { rows:  2.3, fill: 'row', }, }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.querySelector('.blog-container');

    if (!blogContainer) {
        console.warn('Blog container with class "blog-container" not found.');
        return;
    }

    let isDown = false;
    let startX;
    let scrollLeft;

    blogContainer.addEventListener('mousedown', (e) => {

        if (window.innerWidth > 768) {
            isDown = true;

            blogContainer.classList.add('is-dragging');
            startX = e.pageX - blogContainer.offsetLeft;
            scrollLeft = blogContainer.scrollLeft;
            e.preventDefault();
        }
    });

    blogContainer.addEventListener('mouseleave', () => {
        isDown = false;
        blogContainer.classList.remove('is-dragging');
    });

    blogContainer.addEventListener('mouseup', () => {
        isDown = false;
        blogContainer.classList.remove('is-dragging');
    });

    blogContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - blogContainer.offsetLeft;
        const walk = (x - startX) * 2;

        blogContainer.scrollLeft = scrollLeft - walk;
    });

    blogContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        blogContainer.scrollLeft += e.deltaY * 8;
    });

});