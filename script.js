'use strict';


function showElement(element, displayType = 'block') {
    if (element) {
        element.style.display = displayType;
    }
}

function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

function activateOverlay(overlayElement) {
    if (overlayElement) {
        overlayElement.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function deactivateOverlay(overlayElement) {
    if (overlayElement) {
        overlayElement.classList.remove('active');
        document.body.style.overflow = '';
    }
}


const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

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


const csBlogContainer = document.querySelector('.blog-container.has-scrollbar');
let csIsDragging = false, csStartX, csScrollLeft;

csBlogContainer.addEventListener('mousedown', e => {
    csIsDragging = true;
    csBlogContainer.classList.add('active');
    csStartX = e.pageX - csBlogContainer.offsetLeft;
    csScrollLeft = csBlogContainer.scrollLeft;
});

csBlogContainer.addEventListener('mouseleave', () => {
    csIsDragging = false;
    csBlogContainer.classList.remove('active');
});

csBlogContainer.addEventListener('mouseup', () => {
    csIsDragging = false;
    csBlogContainer.classList.remove('active');
});

csBlogContainer.addEventListener('mousemove', e => {
    if (!csIsDragging) return;
    e.preventDefault();
    const x = e.pageX - csBlogContainer.offsetLeft;
    const walk = (x - csStartX) * 3;
    csBlogContainer.scrollLeft = csScrollLeft - walk;
});



let mainOverlay;
let searchBoxInstance;
let cartDashboardInstance;


document.addEventListener('DOMContentLoaded', function() {

    mainOverlay = document.querySelector('.overlay');
    searchBoxInstance = $('.search-box'); // jQuery
    cartDashboardInstance = document.getElementById('cart-dashboard');

    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    if (mainOverlay) {
        mainOverlay.addEventListener('click', () => {
            if (searchBoxInstance && searchBoxInstance.hasClass('show-modal-style')) {
                searchBoxInstance.removeClass('show-modal-style').addClass('search-box');
            }
            if (cartDashboardInstance && cartDashboardInstance.classList.contains('show-dashboard')) {
                cartDashboardInstance.classList.remove('show-dashboard');
                cartDashboardInstance.classList.add('hidden-dashboard');
            }
            document.querySelectorAll('[data-mobile-menu].active').forEach(menu => menu.classList.remove('active'));


            deactivateOverlay(mainOverlay);
        });
    }

    const mobileMenuOpenBtns = document.querySelectorAll('[data-mobile-menu-open-btn]');
    const mobileMenus = document.querySelectorAll('[data-mobile-menu]');
    const mobileMenuCloseBtns = document.querySelectorAll('[data-mobile-menu-close-btn]');

    mobileMenuOpenBtns.forEach((btn, index) => {
        const currentMobileMenu = mobileMenus[index];
        if (!currentMobileMenu) return;

        btn.addEventListener('click', () => {
            currentMobileMenu.classList.add('active');
            if (mainOverlay) activateOverlay(mainOverlay);
        });

        if (mobileMenuCloseBtns[index]) {
            mobileMenuCloseBtns[index].addEventListener('click', () => {
                currentMobileMenu.classList.remove('active');
                if (mainOverlay) deactivateOverlay(mainOverlay);
            });
        }
    });


    const accordionContainer = document.querySelector('.accordion-container');
    if (accordionContainer) {
        accordionContainer.addEventListener('click', function(event) {
            const accordionButton = event.target.closest('[data-accordion-btn]');
            if (!accordionButton) return;

            const currentPanel = accordionButton.nextElementSibling;
            if (!currentPanel || !currentPanel.matches('[data-accordion]')) return;

            const isAlreadyActive = currentPanel.classList.contains('active');

            // Close all other accordions in this container
            accordionContainer.querySelectorAll('[data-accordion].active').forEach(panel => {
                if (panel !== currentPanel) {
                    panel.classList.remove('active');
                    const prevButton = panel.previousElementSibling;
                    if (prevButton && prevButton.matches('[data-accordion-btn]')) {
                        prevButton.classList.remove('active');
                    }
                }
            });

            currentPanel.classList.toggle('active', !isAlreadyActive);
            accordionButton.classList.toggle('active', !isAlreadyActive);
        });
    } else {
        const allAccordionBtns = document.querySelectorAll('[data-accordion-btn]');
        allAccordionBtns.forEach(button => {
            button.addEventListener('click', function() {
            });
        });
    }


    const showSearchBoxBtn = $('.show-search-modal');
    const closeModalSearchBtn = $('.close-modal'); // Assuming this is for search modal

    showSearchBoxBtn.on('click', function () {
        searchBoxInstance.removeClass('search-box').addClass('show-modal-style');
        if (mainOverlay) activateOverlay(mainOverlay);
    });
    closeModalSearchBtn.on('click', function () {
        searchBoxInstance.removeClass('show-modal-style').addClass('search-box');
        if (mainOverlay) deactivateOverlay(mainOverlay);
    });


    if (typeof Swiper !== 'undefined' && document.querySelector(".mySwiper")) {
        new Swiper(".mySwiper", {
            spaceBetween: 30,
            effect: "fade",
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            pagination: { el: ".swiper-pagination", clickable: true },
            autoplay: { delay: 3000, disableOnInteraction: false },
            loop: true, // Often desired for fade effect
        });
    }

    let cartItemsData = JSON.parse(localStorage.getItem('cartItems')) || [];

    function updateCartDisplay() {
        const cartList = document.getElementById('cart-items');
        if (!cartList) return;
        cartList.innerHTML = '';
        let totalPrice = 0;
        const itemCounts = {};
        cartItemsData.forEach(item => {
            itemCounts[item.name] = itemCounts[item.name] || { count: 0, image: item.image, price: item.price };
            itemCounts[item.name].count++;
        });
        for (const [productName, { count, image, price }] of Object.entries(itemCounts)) {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item'; // Use className for single class
            const img = document.createElement('img');
            img.src = image; img.alt = productName; img.style.width = '90px';
            const nameDiv = document.createElement('div');
            nameDiv.style.cssText = "width: 100%; white-space: nowrap; font-size: 12px;"; nameDiv.textContent = productName;
            cartItem.appendChild(nameDiv); cartItem.appendChild(img);
            totalPrice += price * count;
            cartItem.appendChild(createCartActionButton('+', () => addProductToCart(productName, image, price)));
            cartItem.appendChild(createCartActionButton('-', () => removeSingleProductFromCart(productName)));
            cartItem.appendChild(createCartActionButton('delete', () => removeFullProductFromCart(productName)));
            const countSpan = document.createElement('span'); countSpan.className = 'count'; countSpan.textContent = `تعداد محصول: ${count}`; countSpan.style.marginTop = '10px';
            const priceSpan = document.createElement('span'); priceSpan.className = 'price'; priceSpan.textContent = `قیمت محصول: ${price} تومان`; priceSpan.style.cssText = 'font-size: 13px; margin-top: 10px;';
            cartItem.appendChild(countSpan); cartItem.appendChild(priceSpan);
            cartList.appendChild(cartItem);
        }
        if (Object.keys(itemCounts).length === 0) {
            cartList.innerHTML = '<div class="empty-cart-message">سبد خرید شما خالی است.</div>';
        }
        const totalPriceElement = document.getElementById('total-price');
        if (totalPriceElement) totalPriceElement.textContent = `جمع کل: ${totalPrice} تومان`;
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    }

    function createCartActionButton(type, onClick) {
        const button = document.createElement('span');
        button.classList.add('icon-button');
        let svgHTML = '';
        if (type === '+') {
            svgHTML = `<svg class="plus" style="position: absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="0.9em" height="1em"><path fill="none" stroke="currentColor" stroke-linecap="round" d="M12 3.5v17m8.5-8.5h-17"></path></svg>`;
        } else if (type === '-') {
            svgHTML = `<svg class="minus" style="position: absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="0.9em" height="1em"><path fill="currentColor" d="M72 240h368v32H72z"></path></svg>`;
        } else if (type === 'delete') {
            button.classList.add('delete-button');
            svgHTML = `<svg class="delete position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M14.885 17.5v-1h3v1zm0-8v-1h6v1zm0 4v-1h5v1zM4.115 8h-1V7h3.731v-.885h2.538V7h3.732v1h-1v10h-8zm1 0v9h6V8zm0 0v9z"></path></svg>`;
        }
        button.innerHTML = svgHTML;
        button.addEventListener('click', onClick);
        return button;
    }

    function addProductToCart(productName, image, price) {
        const priceNumber = Number(price);
        if (isNaN(priceNumber)) { console.error("Invalid product price for add."); return; }
        cartItemsData.push({ name: productName, image: image, price: priceNumber });
        updateCartDisplay();
        if (cartDashboardInstance) {
            cartDashboardInstance.classList.add('show-dashboard');
            cartDashboardInstance.classList.remove('hidden-dashboard');
        }
        if (mainOverlay) activateOverlay(mainOverlay);
    }

    function removeSingleProductFromCart(productName) {
        const index = cartItemsData.findIndex(item => item.name === productName);
        if (index > -1) cartItemsData.splice(index, 1);
        updateCartDisplay();
        if (cartItemsData.length === 0 && cartDashboardInstance && mainOverlay) {
            cartDashboardInstance.classList.remove('show-dashboard');
            cartDashboardInstance.classList.add('hidden-dashboard');
            deactivateOverlay(mainOverlay);
        }
    }

    function removeFullProductFromCart(productName) {
        cartItemsData = cartItemsData.filter(item => item.name !== productName);
        updateCartDisplay();
        if (cartItemsData.length === 0 && cartDashboardInstance && mainOverlay) {
            cartDashboardInstance.classList.remove('show-dashboard');
            cartDashboardInstance.classList.add('hidden-dashboard');
            deactivateOverlay(mainOverlay);
        }
    }

    document.body.addEventListener('click', function(event){
        const addToCartButton = event.target.closest('.add-to-cart');
        if(addToCartButton){
            const productCard = addToCartButton.closest('article');
            if(!productCard) { console.error("Add to cart: Product card (article) not found."); return; }

            const productName = productCard.querySelector('.product img.one-img')?.alt;
            const productImage = productCard.querySelector('.product img.one-img')?.src;
            const productPriceElement = productCard.querySelector('span.price');

            if (productName && productImage && productPriceElement) {
                const productPriceText = productPriceElement.textContent.match(/[\d\.]+/);
                const productPrice = productPriceText ? parseFloat(productPriceText[0]) : NaN;
                if (!isNaN(productPrice)) {
                    addProductToCart(productName, productImage, productPrice);
                } else { console.error("Invalid product price format from add-to-cart.", productPriceElement.textContent); }
            } else { console.error("Missing product details for add-to-cart.", {productName, productImage, productPriceElement}); }
        }
    });

    updateCartDisplay();

    const closeCartButton = document.getElementById('close-cart');
    if (closeCartButton && cartDashboardInstance) {
        closeCartButton.addEventListener('click', () => {
            cartDashboardInstance.classList.remove('show-dashboard');
            cartDashboardInstance.classList.add('hidden-dashboard');
            if (mainOverlay) deactivateOverlay(mainOverlay);
        });
    }

    let totalLikesCount = 0;
    const totalLikesDisplayElement = document.getElementById('total-likes');

    document.querySelectorAll('.like[data-likes]').forEach(btn => {
        totalLikesCount += parseInt(btn.getAttribute('data-likes')) || 0;
    });
    if (totalLikesDisplayElement) totalLikesDisplayElement.textContent = totalLikesCount;

    document.body.addEventListener('click', function(event) {
        const likeButton = event.target.closest('.like');
        if (likeButton) {
            const colorLikeElement = likeButton.querySelector('.svg-tag');
            let numLikes = parseInt(likeButton.getAttribute('data-likes')) || 0;
            const isLiked = likeButton.getAttribute('data-liked') === 'true';

            if (!isLiked) {
                numLikes++; totalLikesCount++;
                if(colorLikeElement) colorLikeElement.setAttribute('fill', 'currentColor');
                likeButton.setAttribute('data-liked', 'true');
            } else {
                numLikes--; totalLikesCount--;
                if(colorLikeElement) colorLikeElement.setAttribute('fill', 'none');
                likeButton.setAttribute('data-liked', 'false');
            }
            likeButton.setAttribute('data-likes', numLikes);
            if (totalLikesDisplayElement) totalLikesDisplayElement.textContent = totalLikesCount;
        }
    });

    const shopIconButton = document.querySelector('.shop-icon');
    if (shopIconButton && cartDashboardInstance) {
        shopIconButton.addEventListener('click', () => {
            cartDashboardInstance.classList.add('show-dashboard');
            cartDashboardInstance.classList.remove('hidden-dashboard');
            if (mainOverlay) activateOverlay(mainOverlay);
        });
    }

    const csSpaceContainer = document.querySelector('.cs-space-container');
    if (csSpaceContainer) {
        csSpaceContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.cs-space');
            if (button) {
                csSpaceContainer.querySelectorAll('.cs-space.active-cs').forEach(btn => btn.classList.remove('active-cs'));
                button.classList.add('active-cs');
            }
        });
    }


    const megaMenuTriggerDesktop = document.getElementById('mega-menu-trigger-btn-desktop');
    const megaMenuPanelDesktop = document.getElementById('mega-menu-panel-content-desktop');
    if (megaMenuTriggerDesktop && megaMenuPanelDesktop) {
        let megaMenuTimeoutIdDesktop = null;
        let isMouseInsidePanelOrTriggerDesktop = false;
        const hideDelay = 250;
        const categoryItems = megaMenuPanelDesktop.querySelectorAll('.mega-category-item');
        const contentPanes = megaMenuPanelDesktop.querySelectorAll('.mega-menu-pane');
        const showMenu = () => { isMouseInsidePanelOrTriggerDesktop = true; clearTimeout(megaMenuTimeoutIdDesktop); megaMenuPanelDesktop.classList.add('show'); const firstCategory = categoryItems[0]; if (firstCategory && !megaMenuPanelDesktop.querySelector('.mega-category-item.active')) { activateTab(firstCategory); } };
        const hideMenu = () => { isMouseInsidePanelOrTriggerDesktop = false; megaMenuTimeoutIdDesktop = setTimeout(() => { if (!isMouseInsidePanelOrTriggerDesktop) { megaMenuPanelDesktop.classList.remove('show'); categoryItems.forEach(item => item.classList.remove('active')); contentPanes.forEach(pane => pane.classList.remove('active')); } }, hideDelay); };
        const activateTab = (categoryElement) => { /* ... */ const targetPaneId = categoryElement.dataset.target; if (!targetPaneId) return; const targetPane = megaMenuPanelDesktop.querySelector(targetPaneId); if (!targetPane) return; categoryItems.forEach(item => item.classList.remove('active')); contentPanes.forEach(pane => pane.classList.remove('active')); categoryElement.classList.add('active'); targetPane.classList.add('active'); };
        megaMenuTriggerDesktop.addEventListener('mouseenter', showMenu);
        megaMenuTriggerDesktop.addEventListener('mouseleave', hideMenu);
        megaMenuPanelDesktop.addEventListener('mouseenter', () => { isMouseInsidePanelOrTriggerDesktop = true; clearTimeout(megaMenuTimeoutIdDesktop); });
        megaMenuPanelDesktop.addEventListener('mouseleave', hideMenu);
        categoryItems.forEach(item => { item.addEventListener('mouseenter', () => { clearTimeout(megaMenuTimeoutIdDesktop); isMouseInsidePanelOrTriggerDesktop = true; activateTab(item); }); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && megaMenuPanelDesktop.classList.contains('show')) { clearTimeout(megaMenuTimeoutIdDesktop); megaMenuPanelDesktop.classList.remove('show'); isMouseInsidePanelOrTriggerDesktop = false; categoryItems.forEach(item => item.classList.remove('active')); contentPanes.forEach(pane => pane.classList.remove('active')); } });
    }


    const themeToggleButtonTest = document.getElementById('theme-toggle-btn-test');
    const htmlElement = document.documentElement;
    function applyTheme(theme) { if (theme === 'dark') { htmlElement.setAttribute('data-theme', 'dark'); } else { htmlElement.removeAttribute('data-theme'); } localStorage.setItem('theme', theme); }
    const savedTheme = localStorage.getItem('theme') || 'light'; applyTheme(savedTheme);
    if (themeToggleButtonTest) { themeToggleButtonTest.addEventListener('click', () => { const currentTheme = htmlElement.hasAttribute('data-theme') ? 'dark' : 'light'; const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; applyTheme(newTheme); }); }

    // بخش مربوط به HTML Quick View Modal و توابع آن و Event Listener مربوط به دکمه "view" حذف شد
});

$(document).ready(function(){
    if (typeof $.fn.owlCarousel !== 'undefined' && $(".owl-carousel").length) {
        $(".owl-carousel").owlCarousel({
            rtl: true, loop: true, margin: 20, nav: true, dots: true,
            autoplay: true, autoplayTimeout: 3000, autoplayHoverPause: true,
            responsiveClass:true,
            responsive:{ 0:{ items:1, nav:false }, 600:{ items:3, nav:true }, 1000:{ items:4 }, 1200:{ items:5 } }
        });
    }
});

function showToast(type, title, message, duration = 4000) {
    const container = document.getElementById('notificationToastContainer');
    if (!container) {
        console.error('Notification container #notificationToastContainer not found!');
        return;
    }
    const iconMap = {
        success: '#icon-check-circle-fill',
        error: '#icon-alert-triangle-fill',
        info: '#icon-info-circle-fill'
    };
    const toastDiv = document.createElement('div');
    toastDiv.className = `wow-notification-new ${type}`;
    toastDiv.innerHTML = `
        <div class="wow-notification-icon-new">
            <svg><use xlink:href="${iconMap[type] || '#icon-info-circle-fill'}"></use></svg>
        </div>
        <div class="wow-notification-content-new">
            <div class="wow-notification-title-new">${title}</div>
            <div class="wow-notification-message-new">${message}</div>
        </div>
        <button class="wow-notification-close-new">×</button>`;

    container.appendChild(toastDiv);

    requestAnimationFrame(() => {
        toastDiv.classList.add('show');
    });

    const removeToast = () => {
        toastDiv.classList.remove('show');
        setTimeout(() => {
            toastDiv.remove();
        }, 400);
    };

    toastDiv.querySelector('.wow-notification-close-new').onclick = removeToast;

    if (duration > 0) {
        setTimeout(removeToast, duration);
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const searchModalTriggers = document.querySelectorAll('.show-search-modal');
    const searchBox = document.querySelector('.search-box');
    const closeSearchModal = document.querySelector('.search-box .close-modal');

    if (searchBox) {
        searchModalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                searchBox.classList.add('active');
            });
        });

        closeSearchModal.addEventListener('click', () => {
            searchBox.classList.remove('active');
        });
    }
});

