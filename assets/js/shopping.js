    "use strict";
    try {
    document.addEventListener('DOMContentLoaded', () => {
        const addressListContainer = document.getElementById('address-list-container');
        const productListContainer = document.getElementById('product-list-container');
        const timeSlotOptions = document.querySelectorAll('.dj-sh-time-slot-option.dj-sh-selectable-time');
        const dateTabs = document.querySelectorAll('.dj-sh-date-tab');
        const timeSlotsContainers = document.querySelectorAll('.dj-sh-time-slots');
        const continueButton = document.getElementById('continue-button');
        const shippingCostDisplay = document.getElementById('shipping-cost-display');
        const finalTotalDisplay = document.getElementById('final-total-display');
        const summaryItemsTotalValue = document.getElementById('summary-items-total-value');
        const summaryDiscountValue = document.getElementById('summary-discount-value');
        const openModalButtons = document.querySelectorAll('[data-modal-target]');
        const closeModalButtons = document.querySelectorAll('[data-modal-close]');
        const modals = document.querySelectorAll('.dj-sh-modal');
        const addAddressForm = document.getElementById('add-address-form');
        const editAddressForm = document.getElementById('edit-address-form');
        const addAddressModal = document.getElementById('add-address-modal');
        const editAddressModal = document.getElementById('edit-address-modal');
        const confirmationModal = document.getElementById('confirmation-modal');
        const confirmationMessage = document.getElementById('confirmation-message');
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

        let selectedAddressId = null;
        let selectedTimeValue = null;
        let selectedTimeCostText = "وابسته به آدرس و زمان";
        let itemsTotal = 0;
        let discountTotal = 0;
        let nextAddressIdCounter = 3;
        let elementToDelete = null;
        let scrollbarWidth = 0;

        const formatCurrency = (value) => isNaN(value) ? '۰' : value.toLocaleString('fa-IR');
        const parseCurrency = (elementOrString) => {
            let text = typeof elementOrString === 'string' ? elementOrString : (elementOrString?.textContent || '');
            return parseInt(text.replace(/[^\d۰-۹]/g, '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)), 10) || 0;
        };
        const escapeHTML = (str) => {
            if (str === null || str === undefined) return '';
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(String(str)));
            return div.innerHTML;
        };

        function getScrollbarWidth() {
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden'; outer.style.overflow = 'scroll';
            document.body.appendChild(outer);
            const inner = document.createElement('div'); outer.appendChild(inner);
            const width = (outer.offsetWidth - inner.offsetWidth);
            outer.parentNode.removeChild(outer);
            return width;
        }
        scrollbarWidth = getScrollbarWidth();

        function calculateAndUpdateItemsTotal() {
            itemsTotal = 0;
            if (productListContainer) {
                productListContainer.querySelectorAll('.dj-sh-product-item').forEach(item => {
                    const pricePerItem = parseInt(item.dataset.pricePerItem || '0', 10);
                    const quantityDisplay = item.querySelector('.dj-sh-quantity-display');
                    const quantity = parseInt(quantityDisplay?.textContent || '0', 10);
                    if (!isNaN(pricePerItem) && !isNaN(quantity)) { itemsTotal += pricePerItem * quantity; }
                });
            }
            if (summaryItemsTotalValue) { summaryItemsTotalValue.innerHTML = `${formatCurrency(itemsTotal)} <span class="dj-sh-currency">تومان</span>`; }
            updateSummary();
        }

        function checkSelections() {
            if (continueButton) { continueButton.disabled = !(selectedAddressId && selectedTimeValue); }
        }

        function updateSummary() {
            let shippingCost = 0; let shippingCostText = "انتخاب نشده";
            if (selectedTimeCostText) {
                if (selectedTimeCostText.toLowerCase() === 'رایگان') { shippingCost = 0; shippingCostText = "رایگان"; }
                else if (selectedTimeCostText !== "وابسته به آدرس و زمان" && selectedTimeCostText !== "انتخاب نشده") {
                    const costValue = parseCurrency(selectedTimeCostText);
                    shippingCost = costValue >= 0 ? costValue : 0;
                    shippingCostText = costValue >= 0 ? `${formatCurrency(shippingCost)} <span class="dj-sh-currency">تومان</span>` : selectedTimeCostText;
                } else { shippingCostText = selectedTimeCostText; }
            }
            if (!selectedAddressId) { shippingCostText = "وابسته به آدرس"; shippingCost = 0; }
            else if (!selectedTimeValue) { shippingCostText = "وابسته به زمان"; shippingCost = 0; }
            discountTotal = parseCurrency(summaryDiscountValue);
            const finalTotal = itemsTotal - discountTotal + shippingCost;
            if (shippingCostDisplay) shippingCostDisplay.innerHTML = shippingCostText;
            if (summaryDiscountValue) summaryDiscountValue.innerHTML = `${formatCurrency(discountTotal)} <span class="dj-sh-currency">تومان</span>`;
            if (finalTotalDisplay) finalTotalDisplay.innerHTML = `${formatCurrency(finalTotal)} <span class="dj-sh-currency">تومان</span>`;
            checkSelections();
        }

        function createAddressCardHTML(id, name, mobile, province, city, address, unit) {
            const fullAddress = `${escapeHTML(province)}، ${escapeHTML(city)}، ${escapeHTML(address)}${unit ? `، ${escapeHTML(unit)}` : ''}`;
            const dataId = `addr-${id}`;
            return `
                        <article class="dj-sh-address-card dj-sh-selectable" data-address-id="${dataId}">
                        <svg class="dj-sh-icon-svg dj-sh-selected-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="1em"  height="1em"
                        >
                            <path
                                    fill="none"
                                    stroke="currentColor"
                                    d="M4 7.5L7 10l4-5m-3.5 9.5a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"
                            ></path>
                        </svg>
                            <div class="dj-sh-address-card-header">
                                <span><svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg> ${escapeHTML(name)}</span>
                                <span><svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></svg> ${escapeHTML(mobile)}</span>
                            </div>
                            <p class="dj-sh-address-text">
                                <svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg> ${fullAddress}
                            </p>
                            <div class="dj-sh-address-card-actions">
                                <button class="dj-sh-btn dj-sh-btn-delete dj-sh-btn-delete-address" title="حذف آدرس"><svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
                                <button class="dj-sh-btn dj-sh-btn-edit" data-modal-target="#edit-address-modal" data-address-id="${dataId}"><svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg> ویرایش</button>
                                <button class="dj-sh-btn dj-sh-btn-select-address">انتخاب</button>
                            </div>
                        </article>
                    `;
        }

        function openModal(modal) {
            if (modal) {
                document.body.style.paddingRight = scrollbarWidth + 'px';
                modal.classList.add('dj-sh-show');
                document.body.classList.add('dj-sh-modal-open');
            }
        }
        function closeModal(modal) {
            if (modal) {
                modal.classList.remove('dj-sh-show');
                document.body.classList.remove('dj-sh-modal-open');
                document.body.style.paddingRight = '';
                elementToDelete = null;
                if(confirmDeleteBtn) confirmDeleteBtn.removeAttribute('data-delete-type');
            }
        }

        if (productListContainer) {
            productListContainer.addEventListener('click', (event) => {
                const target = event.target;
                const productItem = target.closest('.dj-sh-product-item');
                if (!productItem) return;
                const quantityDisplay = productItem.querySelector('.dj-sh-quantity-display');
                const decreaseBtn = productItem.querySelector('.dj-sh-decrease-qty');
                if (target.classList.contains('dj-sh-increase-qty') && quantityDisplay) {
                    let quantity = parseInt(quantityDisplay.textContent, 10) || 0; quantity++; quantityDisplay.textContent = quantity;
                    if (decreaseBtn) decreaseBtn.disabled = false; calculateAndUpdateItemsTotal();
                } else if (target.classList.contains('dj-sh-decrease-qty') && quantityDisplay) {
                    let quantity = parseInt(quantityDisplay.textContent, 10) || 1;
                    if (quantity > 1) { quantity--; quantityDisplay.textContent = quantity; if (quantity === 1) target.disabled = true; calculateAndUpdateItemsTotal();}
                } else if (target.closest('.dj-sh-btn-delete-product')) {
                    elementToDelete = productItem;
                    confirmDeleteBtn.setAttribute('data-delete-type', 'product');
                    const productTitle = productItem.querySelector('.dj-sh-product-title')?.textContent || 'این محصول';
                    confirmationMessage.textContent = `آیا از حذف "${escapeHTML(productTitle)}" اطمینان دارید؟`;
                    openModal(confirmationModal);
                }
            });
        }

        if (addressListContainer) {
            addressListContainer.addEventListener('click', (event) => {
                const target = event.target;
                const card = target.closest('.dj-sh-address-card');
                if (!card) return;
                const editButton = target.closest('.dj-sh-btn-edit');
                const deleteButton = target.closest('.dj-sh-btn-delete-address');
                if (editButton) {
                    const modalTargetSelector = editButton.dataset.modalTarget;
                    const modal = document.querySelector(modalTargetSelector);
                    const addressId = card.dataset.addressId;
                    const nameElement = card.querySelector('.dj-sh-address-card-header span:nth-child(1) svg + *');
                    const mobileElement = card.querySelector('.dj-sh-address-card-header span:nth-child(2) svg + *');
                    const addressElement = card.querySelector('.dj-sh-address-text svg + *');
                    const name = nameElement?.textContent.trim() || '';
                    const mobile = mobileElement?.textContent.trim() || '';
                    const fullAddressText = addressElement?.textContent.trim() || '';
                    const parts = fullAddressText.split('،');
                    const province = parts[0]?.trim() || '';
                    const city = parts[1]?.trim() || '';
                    const restOfAddress = parts.slice(2).join('،').trim();
                    if (editAddressForm) {
                        editAddressForm.querySelector('#edit-address-id-hidden').value = addressId;
                        editAddressForm.querySelector('#edit-province-input').value = province;
                        editAddressForm.querySelector('#edit-city-input').value = city;
                        editAddressForm.querySelector('#edit-address-textarea').value = restOfAddress;
                        editAddressForm.querySelector('#edit-recipient-name-input').value = name;
                        editAddressForm.querySelector('#edit-recipient-mobile-input').value = mobile;
                        editAddressForm.querySelector('#edit-postal-code-input').value = '';
                        editAddressForm.querySelector('#edit-unit-input').value = '';
                    }
                    openModal(modal); return;
                }
                else if (deleteButton) {
                    elementToDelete = card;
                    confirmDeleteBtn.setAttribute('data-delete-type', 'address');
                    const addressText = card.querySelector('.dj-sh-address-text svg + *')?.textContent.trim().substring(0, 40) || 'این آدرس';
                    confirmationMessage.textContent = `آیا از حذف آدرس "${escapeHTML(addressText)}..." اطمینان دارید؟`;
                    openModal(confirmationModal); return;
                }
                else if (card.classList.contains('dj-sh-selectable')) {
                    const newlySelectedId = card.dataset.addressId;
                    if (selectedAddressId === newlySelectedId) return;
                    addressListContainer.querySelectorAll('.dj-sh-address-card.dj-sh-selected').forEach(selectedCard => {
                        selectedCard.classList.remove('dj-sh-selected');
                        const btn = selectedCard.querySelector('.dj-sh-btn-select-address');
                        if(btn) btn.textContent = 'انتخاب';
                    });
                    card.classList.add('dj-sh-selected');
                    selectedAddressId = newlySelectedId;
                    const selectButton = card.querySelector('.dj-sh-btn-select-address');
                    if (selectButton) selectButton.textContent = 'انتخاب شد';
                    updateSummary();
                }
            });
        }

        if (dateTabs.length > 0 && timeSlotsContainers.length > 0) {
            dateTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetDate = tab.dataset.date;
                    dateTabs.forEach(t => t.classList.remove('dj-sh-active'));
                    timeSlotsContainers.forEach(container => container.style.display = 'none');
                    tab.classList.add('dj-sh-active');
                    const targetContainer = document.getElementById(`time-slots-${targetDate}`);
                    if (targetContainer) { targetContainer.style.display = 'flex'; }
                    selectedTimeValue = null; selectedTimeCostText = "وابسته به آدرس و زمان";
                    timeSlotOptions.forEach(opt => {
                        opt.classList.remove('dj-sh-selected');
                        const radio = opt.querySelector('input[type="radio"]');
                        if (radio) radio.checked = false;
                    });
                    updateSummary();
                });
            });
        }

        if (timeSlotOptions.length > 0) {
            timeSlotOptions.forEach(option => {
                const radio = option.querySelector('input[type="radio"]');
                const costElement = option.querySelector('.dj-sh-cost');
                const handleTimeSelection = (event) => {
                    if (!radio || !option.contains(event.target)) return;
                    if (option.classList.contains('dj-sh-selected') && radio.checked) return;
                    timeSlotOptions.forEach(opt => opt.classList.remove('dj-sh-selected'));
                    option.classList.add('dj-sh-selected');
                    if (!radio.checked) { radio.checked = true; }
                    selectedTimeValue = radio.value;
                    selectedTimeCostText = costElement ? costElement.textContent.trim() : 'رایگان';
                    updateSummary();
                };
                option.addEventListener('click', handleTimeSelection);
                if (radio) radio.addEventListener('change', handleTimeSelection);
            });
        }

        openModalButtons.forEach(button => button.addEventListener('click', () => {
            const targetSelector = button.dataset.modalTarget;
            if (targetSelector) { openModal(document.querySelector(targetSelector)); }
        }));
        closeModalButtons.forEach(button => button.addEventListener('click', () => closeModal(button.closest('.dj-sh-modal'))));
        modals.forEach(modal => {
            const overlay = modal.querySelector('.dj-sh-modal-overlay');
            if (overlay) overlay.addEventListener('click', () => closeModal(modal));
        });

        if (confirmDeleteBtn && confirmationModal) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (elementToDelete) {
                    const deleteType = confirmDeleteBtn.getAttribute('data-delete-type');
                    if (deleteType === 'address') {
                        const addressIdToDelete = elementToDelete.dataset.addressId;
                        elementToDelete.remove();
                        if (selectedAddressId === addressIdToDelete) { selectedAddressId = null; updateSummary(); }
                    } else if (deleteType === 'product') {
                        elementToDelete.remove();
                        calculateAndUpdateItemsTotal();
                    }
                    closeModal(confirmationModal);
                }
            });
        }

        function getRequiredInput(form, id) { if (!form) return null; return form.querySelector(`#${id}`); }

        function handleAddAddressSubmit(event) {
            event.preventDefault(); if (!addAddressForm) return;
            const nameInput = getRequiredInput(addAddressForm, 'add-recipient-name-input'); const mobileInput = getRequiredInput(addAddressForm, 'add-recipient-mobile-input'); const provinceInput = getRequiredInput(addAddressForm, 'add-province-input'); const cityInput = getRequiredInput(addAddressForm, 'add-city-input'); const addressTextarea = getRequiredInput(addAddressForm, 'add-address-textarea'); const unitInput = addAddressForm.querySelector('#add-unit-input');
            if (!nameInput?.value || !mobileInput?.value || !provinceInput?.value || !cityInput?.value || !addressTextarea?.value) { alert('لطفاً تمام فیلدهای ستاره‌دار (*) را پر کنید.'); return; }
            const name = nameInput.value.trim(); const mobile = mobileInput.value.trim(); const province = provinceInput.value.trim(); const city = cityInput.value.trim(); const address = addressTextarea.value.trim(); const unit = unitInput ? unitInput.value.trim() : '';
            const newCardHTML = createAddressCardHTML(nextAddressIdCounter, name, mobile, province, city, address, unit);
            if (addressListContainer) { addressListContainer.insertAdjacentHTML('beforeend', newCardHTML); nextAddressIdCounter++; addAddressForm.reset(); closeModal(addAddressModal); }
        }

        function handleEditAddressSubmit(event) {
            event.preventDefault(); if (!editAddressForm) return;
            const addressIdInput = getRequiredInput(editAddressForm, 'edit-address-id-hidden'); const nameInput = getRequiredInput(editAddressForm, 'edit-recipient-name-input'); const mobileInput = getRequiredInput(editAddressForm, 'edit-recipient-mobile-input'); const provinceInput = getRequiredInput(editAddressForm, 'edit-province-input'); const cityInput = getRequiredInput(editAddressForm, 'edit-city-input'); const addressTextarea = getRequiredInput(editAddressForm, 'edit-address-textarea'); const unitInput = editAddressForm.querySelector('#edit-unit-input');
            if (!addressIdInput?.value || !nameInput?.value || !mobileInput?.value || !provinceInput?.value || !cityInput?.value || !addressTextarea?.value) { alert('لطفاً تمام فیلدهای ستاره‌دار (*) را پر کنید.'); return; }
            const addressId = addressIdInput.value; const name = nameInput.value.trim(); const mobile = mobileInput.value.trim(); const province = provinceInput.value.trim(); const city = cityInput.value.trim(); const address = addressTextarea.value.trim(); const unit = unitInput ? unitInput.value.trim() : '';
            const cardToUpdate = addressListContainer?.querySelector(`[data-address-id="${addressId}"]`);
            if (cardToUpdate) {
                const fullAddress = `${escapeHTML(province)}، ${escapeHTML(city)}، ${escapeHTML(address)}${unit ? `، ${escapeHTML(unit)}` : ''}`;
                const nameSpan = cardToUpdate.querySelector('.dj-sh-address-card-header span:nth-child(1)'); const mobileSpan = cardToUpdate.querySelector('.dj-sh-address-card-header span:nth-child(2)'); const addressPara = cardToUpdate.querySelector('.dj-sh-address-text');
                if(nameSpan) nameSpan.innerHTML = `<svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg> ${escapeHTML(name)}`;
                if(mobileSpan) mobileSpan.innerHTML = `<svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path></svg> ${escapeHTML(mobile)}`;
                if(addressPara) addressPara.innerHTML = `<svg class="dj-sh-icon-svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg> ${fullAddress}`;
                closeModal(editAddressModal);
            } else { alert('خطا: آدرس مورد نظر برای ویرایش یافت نشد.'); }
        }

        if (addAddressForm) addAddressForm.addEventListener('submit', handleAddAddressSubmit);
        if (editAddressForm) editAddressForm.addEventListener('submit', handleEditAddressSubmit);

        calculateAndUpdateItemsTotal();
    });
} catch (error) {
    console.error("Critical Error:", error.message, error.stack);
    document.body.insertAdjacentHTML('afterbegin', '<p style="color:red; background:yellow; padding:10px; text-align:center; border:1px solid red;">Error loading page script!</p>');
}
