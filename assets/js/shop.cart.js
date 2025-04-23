
    document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.querySelector('.items-list');
    const subtotalPriceEl = document.getElementById('subtotal-price');
    const totalItemsCountEl = document.getElementById('total-items-count');
    const discountAmountEl = document.getElementById('discount-amount');
    const totalPayableEl = document.getElementById('total-payable');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const cartItemsHeader = cartItemsContainer.querySelector('.cart-items-header');

    // --- Helper Function: Format Price ---
    function formatPrice(price, includeCurrency = true) {
    const num = Number(price);
    if (isNaN(num)) return includeCurrency ? `۰ <span class="currency">تومان</span>` : '۰';
    const formatted = num.toLocaleString('fa-IR');
    return includeCurrency ? `${formatted} <span class="currency">تومان</span>` : formatted;
}

    // --- Helper Function: Parse Price (from data-unit-price) ---
    function parsePrice(priceContainerElement) {
    if (!priceContainerElement || !priceContainerElement.dataset.unitPrice) return 0;
    return parseFloat(priceContainerElement.dataset.unitPrice) || 0;
}

    // --- Helper Function: Animate Price Update ---
    function triggerPriceAnimation(element) {
    if (!element) return;
    element.classList.add('price-updating');
    // Use requestAnimationFrame to ensure the class is applied before removing
    requestAnimationFrame(() => {
    requestAnimationFrame(() => { // Double RAF for better reliability across browsers
    element.classList.remove('price-updating');
});
});
    // Optional: Fallback with setTimeout if RAF is not enough
    // setTimeout(() => element.classList.remove('price-updating'), 50);
}


    // --- Update Item Total Price Display & Animate ---
    function updateItemDisplay(itemElement) {
    const priceContainer = itemElement.querySelector('.item-pricing');
    const quantityEl = itemElement.querySelector('.quantity-value');
    const itemTotalEl = itemElement.querySelector('.item-total-price');
    const decreaseBtn = itemElement.querySelector('.decrease');

    const unitPrice = parsePrice(priceContainer);
    const quantity = parseInt(quantityEl.textContent, 10);
    const itemTotal = unitPrice * quantity;

    // Update total price display (without currency for animation)
    itemTotalEl.textContent = formatPrice(itemTotal, false); // Format without currency span initially

    // Trigger animation on the container
    triggerPriceAnimation(priceContainer);

    // Update decrease button state
    if(decreaseBtn) decreaseBtn.disabled = (quantity <= 1);
}


    // --- Update Cart Summary & Animate ---
    function updateCartSummary() {
    const allItems = cartItemsList.querySelectorAll('.cart-item:not(.removing)');
    let subtotal = 0;
    let totalItems = 0;
    let totalDiscount = 0;

    allItems.forEach(item => {
    const priceContainer = item.querySelector('.item-pricing');
    const quantityEl = item.querySelector('.quantity-value');
    const unitPrice = parsePrice(priceContainer);
    const quantity = parseInt(quantityEl.textContent, 10);
    subtotal += unitPrice * quantity;
    totalItems += quantity;
});

    const totalPayable = subtotal - totalDiscount;

    // Update DOM elements and trigger animation
    subtotalPriceEl.innerHTML = formatPrice(subtotal);
    triggerPriceAnimation(subtotalPriceEl);

    discountAmountEl.innerHTML = formatPrice(totalDiscount);
    triggerPriceAnimation(discountAmountEl);

    totalPayableEl.innerHTML = formatPrice(totalPayable);
    triggerPriceAnimation(totalPayableEl);

    // Update item count (no animation needed here usually)
    totalItemsCountEl.textContent = totalItems.toLocaleString('fa-IR');

    checkEmptyCart();
}

    // --- Check if Cart is Empty ---
    function checkEmptyCart() {
    const items = cartItemsList.querySelectorAll('.cart-item:not(.removing)');
    const isEmpty = items.length === 0;

    if (isEmpty) {
    emptyCartMessage.classList.add('visible');
    if (cartItemsHeader) cartItemsHeader.style.display = 'none';
    cartSummaryContainer.style.opacity = '0.6';
    cartSummaryContainer.style.pointerEvents = 'none';
} else {
    emptyCartMessage.classList.remove('visible');
    if (cartItemsHeader) {
    cartItemsHeader.style.display = window.innerWidth >= 768 ? 'flex' : 'none';
}
    cartSummaryContainer.style.opacity = '1';
    cartSummaryContainer.style.pointerEvents = 'auto';
}
}


    // --- Event Listener for Item Actions ---
    cartItemsList.addEventListener('click', (event) => {
    const target = event.target;
    const button = target.closest('button');

    if (!button) return;

    const itemElement = button.closest('.cart-item');
    if (!itemElement) return;

    const quantityEl = itemElement.querySelector('.quantity-value');
    let quantity = parseInt(quantityEl.textContent, 10);

    if (button.classList.contains('increase')) {
    quantity++;
    quantityEl.textContent = quantity;
    updateItemDisplay(itemElement); // Updates item price + animates it
    updateCartSummary();          // Updates summary + animates it
}
    else if (button.classList.contains('decrease')) {
    if (quantity > 1) {
    quantity--;
    quantityEl.textContent = quantity;
    updateItemDisplay(itemElement); // Updates item price + animates it
    updateCartSummary();          // Updates summary + animates it
}
}
    else if (button.classList.contains('remove-item-btn')) {
    removeItem(itemElement);
}
});

    // --- Remove Item Function with Animation ---
    function removeItem(itemElement) {
    if (itemElement.classList.contains('removing')) return;
    itemElement.classList.add('removing');

    // Update summary immediately (before animation finishes)
    // This update itself will trigger summary price animations
    updateCartSummary();

    itemElement.addEventListener('transitionend', () => {
    if(document.body.contains(itemElement)) { // Double check exists
    itemElement.remove();
    // Check empty state *after* the element is truly removed
    checkEmptyCart();
}
}, { once: true });

    setTimeout(() => {
    if (document.body.contains(itemElement)) {
    itemElement.remove();
    checkEmptyCart();
}
}, 500);
}

    // --- Initial Calculation on Load ---
    function initializeCart() {
    const items = cartItemsList.querySelectorAll('.cart-item');
    items.forEach(item => {
    updateItemDisplay(item); // Calculate initial total & set button state (no animation needed here)
});
    updateCartSummary(); // Calculate initial summary (no animation needed here)
    checkEmptyCart();
}

    initializeCart();

    // --- Responsive Header Display on Resize ---
    window.addEventListener('resize', checkEmptyCart);

});

