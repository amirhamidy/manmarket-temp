'use strict';


// document.addEventListener('contextmenu', function(event) {
//     event.preventDefault();
// });
//
// document.addEventListener('keydown', function(event) {
//     if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
//         event.preventDefault();
//     }
// });


// bootstrap js init start

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// bootstrap js init end




const modal = document.querySelector('[data-modal]');
const modalCloseFunc = function () { modal.classList.add('closed') }

//Close Notification

//Closing or Opening Mobile Menu
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('.overlay');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

    const mobileMenuCloseFunc = function () {
        mobileMenu[i].classList.remove('active');
        overlay.classList.remove('active');
    }

    mobileMenuOpenBtn[i].addEventListener('click', function () {
        mobileMenu[i].classList.add('active');
        overlay.classList.add('active');
    })

    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    overlay.addEventListener('click', mobileMenuCloseFunc);
}

const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordion.length; i++) {
    accordionBtn[i].addEventListener('click', function () {
        const clickedBtn = this.nextElementSibling.classList.contains('active');

        for (let i = 0; i < accordion.length; i++) {
            if (clickedBtn) break;
            if (accordion[i].classList.contains('active')) {
                accordion[i].classList.remove('active');
                accordionBtn[i].classList.remove('active');
            }
        }

        this.nextElementSibling.classList.toggle('active');
        this.classList.toggle('active');
    })
}



const ShowSearchBox =$ ('.show-search-modal')
const SearchBox =$ ('.search-box')
const CloseModal = $('.close-modal')

ShowSearchBox.on('click' , function (){
    SearchBox.removeClass('search-box')
    SearchBox.addClass('show-modal-style')
    overlay.classList.add('active');
})
CloseModal.on('click' , function (){
    SearchBox.removeClass('show-modal-style')
    overlay.classList.remove('active');
    SearchBox.addClass('search-box')
})
overlay.addEventListener('click' , ()=>{
    SearchBox.removeClass('show-modal-style')
    overlay.classList.remove('active');
    SearchBox.addClass('search-box')
})







var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    effect: "fade",
    navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
},
    pagination: {
    el: ".swiper-pagination",
    clickable: true,
    autoplay : true,
},
});



let cartItems = [];

function updateCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    let totalPrice = 0;
    const itemCounts = {};

    cartItems.forEach(item => {
        itemCounts[item.name] = itemCounts[item.name] || { count: 0, image: item.image, price: item.price };
        itemCounts[item.name].count++;
    });

    for (const [productName, { count, image, price }] of Object.entries(itemCounts)) {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');


        const img = document.createElement('img');
        img.src = image;
        img.alt = productName;
        img.style.width = '90px';

        cartItem.innerHTML = `<div style="width: 100%; white-space: nowrap; font-size: 12px">${productName}</div>`;
        cartItem.appendChild(img);

        totalPrice += price * count;

        cartItem.appendChild(createSvgButton('+', () => addProduct(productName, image, price)));
        cartItem.appendChild(createSvgButton('-', () => removeSingleProduct(productName)));
        cartItem.appendChild(createDeleteButton(() => removeProduct(productName)));

        const countSpan = document.createElement('span');
        countSpan.classList.add('count');
        countSpan.textContent = `تعداد محصول: ${count}`;
        countSpan.style.marginTop = '10px';
        cartItem.appendChild(countSpan);

        const priceSpan = document.createElement('span');
        priceSpan.classList.add('price');
        priceSpan.textContent = `قیمت محصول: ${price} تومان`;
        priceSpan.style.fontSize = '13px';
        priceSpan.style.marginTop = '10px';
        cartItem.appendChild(priceSpan);

        cartList.appendChild(cartItem);
    }

    if (Object.keys(itemCounts).length === 0) {
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.textContent = 'سبد خرید شما خالی است.';
        emptyCartMessage.classList.add('empty-cart-message');
        cartList.appendChild(emptyCartMessage);
    }

    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = `جمع کل: ${totalPrice} تومان`;
}

function createSvgButton(type, onClick) {
    const button = document.createElement('span');
    button.classList.add('icon-button');

    let svg = '';
    if (type === '+') {
        svg = `<svg class="plus" style="position: absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="0.9em" height="1em"><path fill="none" stroke="currentColor" stroke-linecap="round" d="M12 3.5v17m8.5-8.5h-17"></path></svg>`;
    } else if (type === '-') {
        svg = `<svg class="minus" style="position: absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="0.9em" height="1em"><path fill="currentColor" d="M72 240h368v32H72z"></path></svg>`;
    }

    button.innerHTML = svg;
    button.addEventListener('click', onClick);
    return button;
}

function createDeleteButton(onClick) {
    const button = document.createElement('span');
    button.classList.add('icon-button');
    button.classList.add('delete-button');

    const svg = `<svg class="delete position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M14.885 17.5v-1h3v1zm0-8v-1h6v1zm0 4v-1h5v1zM4.115 8h-1V7h3.731v-.885h2.538V7h3.732v1h-1v10h-8zm1 0v9h6V8zm0 0v9z"></path></svg>`;
    button.innerHTML = svg;
    button.addEventListener('click', onClick);
    return button;
}

function addProduct(productName, image, price) {
    const priceNumber = Number(price);
    if (!isNaN(priceNumber)) {
        cartItems.push({ name: productName, image: image, price: priceNumber });
        updateCart();
        const cartDashboard = document.getElementById('cart-dashboard');
        cartDashboard.classList.add('show-dashboard');
        cartDashboard.classList.remove('hidden-dashboard');
        overlay.classList.add('active');
    } else {
        console.error("Error: Invalid product price.");
    }
}

overlay.addEventListener('click', () => {
    cartDashboard.classList.remove('show-dashboard');
    cartDashboard.classList.add('hidden-dashboard');
    overlay.classList.remove('active');
});

function removeSingleProduct(productName) {
    const index = cartItems.findIndex(item => item.name === productName);
    if (index > -1) {
        cartItems.splice(index, 1);
        updateCart();
    }
}

function removeProduct(productName) {
    cartItems = cartItems.filter(item => item.name !== productName);
    updateCart();
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productElement = button.closest('.product');
        const productName = productElement.querySelector('img.one-img').alt;
        const productImage = productElement.querySelector('img.one-img').src;
        const productPriceElement = productElement.nextElementSibling;

        if (productPriceElement && productPriceElement.classList.contains('price')) {
            const productPrice = parseFloat(productPriceElement.textContent);
            if (!isNaN(productPrice)) {
                addProduct(productName, productImage, productPrice);
            } else {
                console.error("Error: Invalid product price format.");
            }
        } else {
            console.error("Error: .price element not found for product.");
        }
    });
});


document.getElementById('close-cart').addEventListener('click', () => {
    const cartDashboard = document.getElementById('cart-dashboard');
    cartDashboard.classList.remove('show-dashboard');
    cartDashboard.classList.add('hidden-dashboard');
    overlay.classList.remove('active');
});



document.querySelectorAll('.like').forEach(function (likeElement) {
    likeElement.addEventListener('click', function () {
        const numLikeElement = this;
        const colorLikeElement = this.querySelector('.svg-tag')
        const totalLikesElement = document.getElementById('total-likes');
        let numLikes = parseInt(numLikeElement.getAttribute('data-likes')) || 0;
        const liked = numLikeElement.getAttribute('data-liked') === 'true';

        console.log("Before Click - numLikes: ", numLikes);

        if (!liked) {
            numLikes += 1;
            colorLikeElement.setAttribute('fill', 'white');
            numLikeElement.setAttribute('data-liked', 'true');

        } else {
            numLikes -= 1;
            colorLikeElement.setAttribute('fill', 'none');
            numLikeElement.setAttribute('data-liked', 'false');
        }

        numLikeElement.setAttribute('data-likes', numLikes);
        console.log("After Click - numLikes: ", numLikes);

        const totalLikes = Array.from(document.querySelectorAll('.like'))
            .reduce((total, like) => total + (parseInt(like.getAttribute('data-likes')) || 0), 0);
        totalLikesElement.textContent = totalLikes;
    });
});



const cartDashboard = document.getElementById('cart-dashboard');
const ShopIcon = document.querySelector('.shop-icon')
ShopIcon.addEventListener('click' , () =>{
    cartDashboard.classList.add('show-dashboard');
    cartDashboard.classList.remove('hidden-dashboard');
    overlay.classList.add('active');
})

const buttons = document.querySelectorAll('.cs-space');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => btn.classList.remove('active-cs'));

        this.classList.add('active-cs');
    });
});