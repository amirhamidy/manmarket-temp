    document.addEventListener('DOMContentLoaded', function() {
    const totalAmountSpan = document.getElementById('cartexz-total-amount');
    const itemCountSpan = document.getElementById('cartexz-item-count');
    const discountValue = 500000; // تخفیف ثابت 500,000 تومان

    // تابع برای فرمت‌دهی اعداد به صورت فارسی با کاما
    function formatPrice(price) {
    return price.toLocaleString('fa-IR');
}

    // تابع برای به‌روزرسانی آیکون دکمه کاهش/حذف
    function updateDecreaseButtonIcon(button, currentQty) {
    const minusIcon = button.querySelector('.minus-icon');
    const deleteIcon = button.querySelector('.delete-icon');

    if (currentQty === 1) {
    minusIcon.style.display = 'none';
    deleteIcon.style.display = 'block';
    button.classList.add('delete-button'); // اضافه کردن کلاس برای استایلینگ
    button.setAttribute('aria-label', 'حذف این محصول');
} else {
    minusIcon.style.display = 'block';
    deleteIcon.style.display = 'none';
    button.classList.remove('delete-button');
    button.setAttribute('aria-label', 'کاهش تعداد');
}
}

    // تابع برای به‌روزرسانی خلاصه سبد خرید
    function updateCartSummary() {
    let totalItemsPrice = 0;
    let totalProductCount = 0;

    const itemCards = document.querySelectorAll('.cartexz-item-card');

    if (itemCards.length === 0) {
    totalAmountSpan.textContent = '۰ تومان';
    itemCountSpan.textContent = '۰ محصول';
    return;
}

    itemCards.forEach(card => {
    const basePrice = parseInt(card.dataset.basePrice);
    const qtyDisplay = card.querySelector('.cartexz-qty-display');
    const decreaseButton = card.querySelector('.decrease-qty'); // دکمه کاهش
    let currentQty = parseInt(qtyDisplay.dataset.qty); // مطمئن شویم که currentQty همیشه از dataset گرفته شود

    // به‌روزرسانی آیکون دکمه کاهش/حذف
    updateDecreaseButtonIcon(decreaseButton, currentQty);

    // محاسبه قیمت برای هر آیتم
    const itemTotalPrice = basePrice * currentQty;
    let itemPriceSpan = card.querySelector('.cartexz-item-price .price-value'); // هر بار انتخاب شود
    itemPriceSpan.textContent = formatPrice(itemTotalPrice);

    totalItemsPrice += itemTotalPrice;
    totalProductCount += currentQty;
});

    const shippingCost = 0; // رایگان
    const finalTotal = totalItemsPrice - discountValue + shippingCost;

    totalAmountSpan.textContent = formatPrice(finalTotal) + ' تومان';
    itemCountSpan.textContent = totalProductCount + ' محصول';
}

    // اضافه کردن شنونده‌های رویداد به المنت‌های موجود (و آینده)
    document.querySelector('.cartexz-items-section').addEventListener('click', function(event) {
    const target = event.target;
    const decreaseButton = target.closest('.decrease-qty');
    const increaseButton = target.closest('.increase-qty');

    // کنترل دکمه‌های افزایش و کاهش تعداد
    if (increaseButton) {
    const qtyDisplay = increaseButton.previousElementSibling; // span.cartexz-qty-display
    let currentQty = parseInt(qtyDisplay.dataset.qty);
    currentQty++;
    qtyDisplay.dataset.qty = currentQty;
    qtyDisplay.textContent = currentQty;
    updateCartSummary();
} else if (decreaseButton) {
    const qtyDisplay = decreaseButton.nextElementSibling; // span.cartexz-qty-display
    let currentQty = parseInt(qtyDisplay.dataset.qty);

    if (currentQty === 1) {
    // اگر تعداد ۱ بود، محصول را حذف کن
    const itemCard = decreaseButton.closest('.cartexz-item-card');
    if (itemCard) {
    itemCard.remove();
    updateCartSummary();
}
} else {
    // در غیر این صورت، تعداد را کاهش بده
    currentQty--;
    qtyDisplay.dataset.qty = currentQty;
    qtyDisplay.textContent = currentQty;
    updateCartSummary();
}
}
});

    // اجرای اولیه برای نمایش مقادیر صحیح و آیکون‌ها در ابتدا
    updateCartSummary();
});
