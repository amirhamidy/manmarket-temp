const trZSlides = document.querySelectorAll('.tr-z-slide');
const trZThumbnails = document.querySelectorAll('#tr-z-slider-nav img');
const trZPrevButton = document.querySelector('.tr-z-prev');
const trZNextButton = document.querySelector('.tr-z-next');

let trZCurrentIndex = 0;

function trZShowSlide(index) {
    $('.zom-img').elevateZoom('destroy');

    trZSlides.forEach((slide) => {
        slide.classList.remove('tr-z-active');
    });
    trZSlides[index].classList.add('tr-z-active');

    trZThumbnails.forEach((thumb) => {
        thumb.classList.remove('tr-z-active-thumb');
    });
    trZThumbnails[index].classList.add('tr-z-active-thumb');


    trZCurrentIndex = index;

    $('.tr-z-active .zom-img').elevateZoom({
        zoomType: "inner",
        cursor: "crosshair",
        zoomWindowFadeIn: 500,
        zoomWindowFadeOut: 500,
    });
}

trZThumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        trZShowSlide(index);
    });
});

trZPrevButton.addEventListener('click', () => {
    const newIndex = (trZCurrentIndex - 1 + trZSlides.length) % trZSlides.length;
    trZShowSlide(newIndex);
});

trZNextButton.addEventListener('click', () => {
    const newIndex = (trZCurrentIndex + 1) % trZSlides.length;
    trZShowSlide(newIndex);
});

trZShowSlide(trZCurrentIndex);


$('.tr-z-active .zom-img').elevateZoom({
    zoomType: "inner",
    cursor: "crosshair",
    zoomWindowFadeIn: 500,
    zoomWindowFadeOut: 500,
});


function selectColor(selectedElement) {
    const circles = document.querySelectorAll('.color-circle');
    circles.forEach(circle => {
        const checkmark = circle.querySelector('.checkmark');
        circle.classList.remove('checked');
        checkmark.style.display = 'none';
    });
    selectedElement.classList.add('checked');
    const selectedCheckmark = selectedElement.querySelector('.checkmark');
    selectedCheckmark.style.display = 'block';
}


let actual = 1;
let input = document.getElementById("number-input");
input.innerHTML = actual;

function count(direction) {
    if (actual <= 1){
        actual = 1;
    }
    if(direction === "minus") {
        actual = actual - 1;
        input.classList.remove('animate-minus');
        input.classList.remove('animate-plus');
        setTimeout(function(){
            input.classList.add('animate-minus');
        },10);
    } else {
        actual = actual +1;
        input.classList.remove('animate-plus');
        input.classList.remove('animate-minus');
        setTimeout(function(){
            input.classList.add('animate-plus');
        },10);
    }
    setTimeout(function(){
        input.innerHTML = actual;
    },5);
}






