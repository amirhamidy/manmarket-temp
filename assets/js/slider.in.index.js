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