document.addEventListener('DOMContentLoaded', () => {

    const wishlistItemsList = document.getElementById('w-sc-items-list');
    const emptyWishlistMessage = document.getElementById('w-sc-empty-wishlist');
    const wishlistItemCountEl = document.getElementById('w-sc-wishlist-item-count');
    const sortSelect = document.getElementById('w-sc-sort-select');

    const REMOVING_CLASS = 'w-sc-wishlist-item--removing';
    const EMPTY_VISIBLE_CLASS = 'w-sc-empty-wishlist--visible';

    // --- Initialize Tooltips (Optional) ---
    function initializeTooltips() { /* ... (same as before) ... */ }

    // --- Update Item Count Display ---
    function updateWishlistCount() {
        if (!wishlistItemCountEl || !wishlistItemsList) return;
        const currentItems = wishlistItemsList.querySelectorAll(`.w-sc-wishlist-item:not(.${REMOVING_CLASS})`);
        wishlistItemCountEl.textContent = currentItems.length;
    }

    // --- Check and Show/Hide Empty State ---
    function checkEmptyState() {
        if (!wishlistItemsList || !emptyWishlistMessage) return;
        // Use setTimeout to defer check slightly, ensures DOM is updated after removal/sort
        setTimeout(() => {
            const hasItems = wishlistItemsList.querySelector(`.w-sc-wishlist-item:not(.${REMOVING_CLASS})`);
            if (hasItems) {
                emptyWishlistMessage.classList.remove(EMPTY_VISIBLE_CLASS);
            } else {
                emptyWishlistMessage.classList.add(EMPTY_VISIBLE_CLASS);
            }
        }, 50); // Short delay
    }

    // --- Sort Wishlist Items ---
    function sortWishlistItems(sortBy) {
        if (!wishlistItemsList) return;
        const items = Array.from(wishlistItemsList.querySelectorAll('.w-sc-wishlist-item:not(.w-sc-wishlist-item--removing)'));

        items.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price) || 0;
            const priceB = parseFloat(b.dataset.price) || 0;
            const dateA = a.dataset.addedDate || '0';
            const dateB = b.dataset.addedDate || '0';
            const idA = a.dataset.id || ''; // Use for default/most_visited
            const idB = b.dataset.id || '';

            switch (sortBy) {
                case 'price_asc':
                    return priceA - priceB;
                case 'price_desc':
                    return priceB - priceA;
                case 'newest':
                    // Compare dates as strings (YYYY-MM-DD format ensures correct comparison)
                    if (dateA < dateB) return 1;
                    if (dateA > dateB) return -1;
                    return 0;
                case 'most_visited': // Default sort (e.g., by ID or initial order)
                default:
                    // Simple comparison assuming IDs are somewhat sequential or unique
                    if (idA < idB) return -1;
                    if (idA > idB) return 1;
                    return 0;
            }
        });

        // Re-append items in sorted order
        items.forEach(item => wishlistItemsList.appendChild(item));
    }

    // --- Handle Remove Button Click ---
    if (wishlistItemsList) {
        wishlistItemsList.addEventListener('click', (event) => {
            const removeButton = event.target.closest('.w-sc-remove-wishlist-btn');
            if (!removeButton || removeButton.disabled) return;

            const wishlistItem = removeButton.closest('.w-sc-wishlist-item');
            if (!wishlistItem || wishlistItem.classList.contains(REMOVING_CLASS)) return;

            const productId = wishlistItem.dataset.id || removeButton.dataset.productId;
            const productTitle = wishlistItem.querySelector('.w-sc-product-card__title')?.textContent.trim() || 'این محصول';

            // --- Confirmation using SweetAlert2 ---
            Swal.fire({
                title: 'حذف از علاقه‌مندی‌ها',
                text: `آیا از حذف "${productTitle}" مطمئن هستید؟`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--w-sc-primary-accent)', // Use theme color
                cancelButtonColor: 'var(--w-sc-text-secondary)',
                confirmButtonText: 'بله، حذف کن',
                cancelButtonText: 'انصراف',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(`Confirmed removal for product ${productId}...`);
                    // --- Simulate Removal ---
                    wishlistItem.classList.add(REMOVING_CLASS);
                    updateWishlistCount();

                    let transitionEnded = false;
                    function handleTransitionEnd(e) {
                        if ((e.propertyName === 'opacity' || e.propertyName === 'transform') && !transitionEnded) {
                            transitionEnded = true;
                            wishlistItem.removeEventListener('transitionend', handleTransitionEnd);
                            clearTimeout(fallbackTimeout);
                            if (document.body.contains(wishlistItem)) { wishlistItem.remove(); }
                            checkEmptyState(); // Check after removal
                        }
                    }
                    wishlistItem.addEventListener('transitionend', handleTransitionEnd);

                    const fallbackTimeout = setTimeout(() => {
                        if (!transitionEnded && document.body.contains(wishlistItem)) {
                            console.warn(`Transitionend fallback triggered for item ${productId}.`);
                            wishlistItem.removeEventListener('transitionend', handleTransitionEnd);
                            wishlistItem.remove();
                            checkEmptyState();
                        }
                    }, 550);

                    // --- TODO: Add actual API call here ---
                    Swal.fire({ // Show success message after UI update starts
                        title: 'حذف شد!',
                        text: `"${productTitle}" با موفقیت از لیست شما حذف شد.`,
                        icon: 'success',
                        timer: 1500, // Auto close after 1.5s
                        showConfirmButton: false,
                        customClass: { popup: 'swal2-vazirfont', title: 'swal2-vazirfont', htmlContainer: 'swal2-vazirfont' }
                    });
                }
            });
        });
    }

    // --- Placeholder for other interactions ---
    if (wishlistItemsList) {
        wishlistItemsList.addEventListener('click', (event) => {
            const addToCartButton = event.target.closest('.w-sc-add-to-cart-btn');
            const notifyButton = event.target.closest('.w-sc-notify-btn');

            if (addToCartButton && !addToCartButton.disabled) {
                const productId = addToCartButton.dataset.productId;
                const productTitle = addToCartButton.closest('.w-sc-product-card')?.querySelector('.w-sc-product-card__title')?.textContent.trim() || 'محصول';
                console.log(`Adding product ${productId} to cart...`);

                addToCartButton.innerHTML = `<svg class="w-sc-loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
                addToCartButton.disabled = true;

                setTimeout(() => {
                    addToCartButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                    Swal.fire({
                        icon: 'success',
                        title: 'به سبد خرید اضافه شد!',
                        text: `"${productTitle}" به سبد خرید شما اضافه شد.`,
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: { popup: 'swal2-vazirfont', title: 'swal2-vazirfont', htmlContainer: 'swal2-vazirfont' }
                    });
                    // Re-enable button after a delay if needed, or handle server response
                    // setTimeout(() => {
                    //    addToCartButton.innerHTML = `...افزودن به سبد`;
                    //    addToCartButton.disabled = false;
                    // }, 2500);
                }, 1200);
            }

            if (notifyButton && !notifyButton.disabled) {
                const productId = notifyButton.dataset.productId;
                const productTitle = notifyButton.closest('.w-sc-product-card')?.querySelector('.w-sc-product-card__title')?.textContent.trim() || 'محصول';
                console.log(`Registering notification for product ${productId}...`);
                Swal.fire({
                    icon: 'info',
                    title: 'درخواست شما ثبت شد',
                    text: `به محض موجود شدن "${productTitle}" به شما اطلاع خواهیم داد.`,
                    confirmButtonText: 'باشه',
                    confirmButtonColor: 'var(--w-sc-secondary-accent)',
                    customClass: { popup: 'swal2-vazirfont', confirmButton: 'swal2-vazirfont', title: 'swal2-vazirfont', htmlContainer: 'swal2-vazirfont' }
                });
                notifyButton.textContent = 'درخواست ثبت شد';
                notifyButton.disabled = true;
            }
        });
    }

    // --- Event Listener for Sort Dropdown ---
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            sortWishlistItems(event.target.value);
        });
    }

    // --- Initial Setup ---
    initializeTooltips();
    updateWishlistCount();
    checkEmptyState();
    // Initial subtle load animation trigger
    setTimeout(() => {
        document.body.classList.add('w-sc-wishlist-loaded');
    }, 50);

});