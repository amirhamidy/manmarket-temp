document.addEventListener('DOMContentLoaded', () => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    const toPersianNum = (n) => n.toString().replace(/\d/g, d => persianNumbers[d]);
    const toEnglishNum = (s) => s.toString().replace(/[۰-۹]/g, d => persianNumbers.indexOf(d));

    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        const englishNumString = priceString.toString().replace(/[۰-۹]/g, d => persianNumbers.indexOf(d))
            .replace(/,|تومان|\(|\)|-/g, '').trim();
        return parseInt(englishNumString, 10) || 0;
    };

    const formatPrice = (num) => {
        const withCommas = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return toPersianNum(withCommas);
    };

    // tick icon length for CSS variable (if needed)
    const tickIconForCalc = document.querySelector('.shop-cs-tick-icon path');
    if (tickIconForCalc) {
        const length = tickIconForCalc.getTotalLength();
        document.documentElement.style.setProperty('--tick-path-length', length);
    }

    // ADDRESS LOGIC
    const addressForm = document.getElementById('address-form');
    const activeAddressDisplayWrapper = document.querySelector('#active-address-display .address-details-wrapper');
    const toggleBtn = document.getElementById('btn-toggle-address');
    const collapsibleList = document.getElementById('address-list-collapsible');

    const updateActiveAddress = () => {
        if (!addressForm || !activeAddressDisplayWrapper) return;
        const checkedRadio = addressForm.querySelector('input[name="address_id"]:checked');
        if (checkedRadio) {
            const sourceDetails = checkedRadio.closest('.shop-cs-selectable-option').querySelector('.shop-cs-address-details');
            if (sourceDetails) {
                const clonedDetails = sourceDetails.cloneNode(true);
                activeAddressDisplayWrapper.innerHTML = '';
                activeAddressDisplayWrapper.appendChild(clonedDetails);
            }
        }
    };

    if (toggleBtn && collapsibleList) {
        toggleBtn.addEventListener('click', () => {
            collapsibleList.classList.toggle('is-open');
            toggleBtn.classList.toggle('is-open');
        });
    }

    if (addressForm) {
        addressForm.addEventListener('change', () => {
            updateActiveAddress();
            if (collapsibleList.classList.contains('is-open')) {
                collapsibleList.classList.remove('is-open');
                toggleBtn.classList.remove('is-open');
            }
        });
    }
    updateActiveAddress();

    // CART ITEM LOGIC
    const trashIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" width="1em" height="1em"><path fill="currentColor" d="M1792 384h-128v1472q0 40-15 75t-41 61t-61 41t-75 15H448q-40 0-75-15t-61-41t-41-61t-15-75V384H128V256h512V128q0-27 10-50t27-40t41-28t50-10h384q27 0 50 10t40 27t28 41t10 50v128h512zM768 256h384V128H768zm768 128H384v1472q0 26 19 45t45 19h1024q26 0 45-19t19-45zM768 1664H640V640h128zm256 0H896V640h128zm256 0h-128V640h128z"></path></svg>';
    const minusIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
    const cartList = document.getElementById('cart-items-list');
    if (cartList) {
        const updateDecreaseButton = (quantity, decreaseBtn) => {
            if (quantity === 1) {
                decreaseBtn.innerHTML = trashIconSVG;
                decreaseBtn.setAttribute('aria-label', 'حذف محصول');
                decreaseBtn.dataset.action = 'delete';
            } else {
                decreaseBtn.innerHTML = minusIconSVG;
                decreaseBtn.setAttribute('aria-label', 'کاهش تعداد');
                decreaseBtn.dataset.action = 'decrease';
            }
        };
        cartList.querySelectorAll('.shop-cs-cart-item-s').forEach(item => {
            const quantityEl = item.querySelector('.shop-cs-quantity-display');
            const decreaseBtn = item.querySelector('.shop-cs-quantity-btn:last-child');
            if (quantityEl && decreaseBtn) {
                const quantity = parseInt(quantityEl.dataset.quantity);
                updateDecreaseButton(quantity, decreaseBtn);
            }
        });
        cartList.addEventListener('click', (e) => {
            const target = e.target.closest('.shop-cs-quantity-btn');
            if (!target) return;
            const action = target.dataset.action;
            const container = target.closest('.shop-cs-quantity-control-container');
            const quantityEl = container.querySelector('.shop-cs-quantity-display');
            let quantity = parseInt(quantityEl.dataset.quantity);
            if (action === 'increase') quantity++;
            else if (action === 'decrease') {
                if (quantity > 1) quantity--;
            } else if (action === 'delete') {
                const itemEl = target.closest('.shop-cs-cart-item-s');
                itemEl.classList.add('fading-out');
                itemEl.addEventListener('animationend', () => itemEl.remove());
                return;
            }
            quantityEl.dataset.quantity = quantity;
            quantityEl.textContent = toPersianNum(quantity);
            updateDecreaseButton(quantity, container.querySelector('.shop-cs-quantity-btn:last-child'));
        });
    }

    // SHIPMENT LOGIC (TIME SLOTS)
    const shipmentSection = document.getElementById('shipment-section');
    if (shipmentSection) {
        shipmentSection.addEventListener('click', e => {
            const dateCard = e.target.closest('.shop-cs-time-scroller__item');
            if (dateCard) {
                if (dateCard.classList.contains('active')) return;
                shipmentSection.querySelector('.shop-cs-time-scroller__item.active')?.classList.remove('active');
                dateCard.classList.add('active');
                const timeSlotGroups = shipmentSection.querySelectorAll('.shop-cs-time-slot-group');
                timeSlotGroups.forEach(group => {
                    group.classList.remove('active');
                    group.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
                });
                const newTimeGroup = document.getElementById(dateCard.dataset.timeGroup);
                if (newTimeGroup) newTimeGroup.classList.add('active');
            }
        });
    }

    // TIME SCROLLER SETUP
    const setupScroller = (wrapper) => {
        const scroller = wrapper.querySelector('.shop-cs-time-scroller');
        if (!scroller) return;
        const leftBtn = wrapper.querySelector('.shop-cs-time-scroller-btn--left');
        const rightBtn = wrapper.querySelector('.shop-cs-time-scroller-btn--right');

        const updateButtons = () => {
            const scrollLeft = Math.round(scroller.scrollLeft);
            const scrollWidth = scroller.scrollWidth;
            const clientWidth = scroller.clientWidth;
            if (leftBtn) leftBtn.disabled = scrollLeft <= 0;
            if (rightBtn) rightBtn.disabled = scrollLeft + clientWidth >= scrollWidth;
        };

        if (leftBtn) leftBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -scroller.clientWidth, behavior: 'smooth' });
        });
        if (rightBtn) rightBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: scroller.clientWidth, behavior: 'smooth' });
        });

        scroller.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        window.addEventListener('load', updateButtons);
    };

    document.querySelectorAll('.shop-cs-time-scroller-wrapper').forEach(setupScroller);

    // PAYMENT LOGIC WITH WALLET AND DISCOUNT
    const paymentForm = document.getElementById('payment-form');
    const totalAmountRow = document.getElementById('total-amount-row');
    const finalAmountEl = document.getElementById('final-amount');
    const walletTextEl = document.getElementById('wallet-text');

    if (paymentForm && finalAmountEl && walletTextEl) {
        const originalTotal = parsePrice(finalAmountEl.textContent);
        const walletInput = paymentForm.querySelector('input[value="wallet"]');
        const originalWalletAmount = walletInput ? parsePrice(walletInput.dataset.wallet || '0') : 0;

        paymentForm.addEventListener('change', () => {
            const checked = paymentForm.querySelector('input[name="payment_method"]:checked');
            if (!checked) return;
            if (checked.value === 'wallet') {
                let walletAmount = originalWalletAmount;
                let finalTotal = originalTotal;
                if (walletAmount >= finalTotal) {
                    walletAmount -= finalTotal;
                    finalTotal = 0;
                } else {
                    finalTotal -= walletAmount;
                    walletAmount = 0;
                }
                finalAmountEl.innerHTML = formatPrice(finalTotal) + ' <span class="shop-cs-price-unit">تومان</span>';
                walletTextEl.textContent = 'موجودی: ' + formatPrice(walletAmount) + ' تومان';
            } else {
                finalAmountEl.innerHTML = formatPrice(originalTotal) + ' <span class="shop-cs-price-unit">تومان</span>';
                walletTextEl.textContent = 'موجودی: ' + formatPrice(originalWalletAmount) + ' تومان';
            }
        });
    }
});


const scroller = document.querySelector('.shop-cs-time-scroller');
let isDragging = false, startX, scrollLeft;

scroller.addEventListener('mousedown', e => {
    isDragging = true;
    scroller.classList.add('active');
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
});

scroller.addEventListener('mouseleave', () => {
    isDragging = false;
    scroller.classList.remove('active');
});

scroller.addEventListener('mouseup', () => {
    isDragging = false;
    scroller.classList.remove('active');
});

scroller.addEventListener('mousemove', e => {
    if(!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 10;
    scroller.scrollLeft = scrollLeft - walk;
});
