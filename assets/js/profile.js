
document.addEventListener('DOMContentLoaded', () => {
    const navixElement = document.querySelector('.navix');
    const codeElement = document.querySelector('.code');
    const trueCElement = document.querySelector('.true-c');

    if (navixElement && codeElement && trueCElement) {
        navixElement.addEventListener('click', async () => {
            const fullText = codeElement.textContent;
            const numbersOnly = fullText.replace(/[^0-9]/g, '');

            try {
                await navigator.clipboard.writeText(numbersOnly);
                navixElement.style.display = 'none';
                trueCElement.style.display = 'inline';
            } catch (err) {
                alert("روند کپی کردن با مشکل مواجه شد")
            }
        });
    }
});

function showToast({ type = 'info', title, message, duration = 4500, isConfirm = false, onConfirm = () => {}, onCancel = () => {} }) {
    const container = document.getElementById('notificationToastContainer');
    if (!container) return;
    const iconMap = { success: '#icon-check-circle-fill', error: '#icon-alert-triangle-fill', warning: '#icon-alert-triangle-fill', info: '#icon-info-circle-fill' };
    const toastId = `toast-${Date.now()}`;
    const toastDiv = document.createElement('div');
    toastDiv.className = `wow-notification-new ${type} ${isConfirm ? 'confirm' : ''}`;
    toastDiv.id = toastId;

    let confirmButtonsHTML = '';
    if (isConfirm) {
        confirmButtonsHTML = `
        <div class="wow-notification-actions">
            <button class="btn-custom btn-sm btn-secondary cancel-btn">انصراف</button>
            <button class="btn-custom btn-sm btn-danger-outline confirm-btn">بله، حذف کن</button>
        </div>`;
    }

    toastDiv.innerHTML = `
        <div class="wow-notification-header">
            <div class="wow-notification-icon-new"><svg><use xlink:href="${iconMap[type] || iconMap.info}"></use></svg></div>
            <div class="wow-notification-content-new">
                <div class="wow-notification-title-new">${title}</div>
                <div class="wow-notification-message-new">${message}</div>
            </div>
            <button class="wow-notification-close-new">×</button>
        </div>
        ${confirmButtonsHTML}`;

    container.prepend(toastDiv);
    requestAnimationFrame(() => toastDiv.classList.add('show'));

    const removeToast = () => {
        toastDiv.classList.remove('show');
        setTimeout(() => toastDiv.remove(), 400);
    };

    toastDiv.querySelector('.wow-notification-close-new').onclick = removeToast;

    if (isConfirm) {
        toastDiv.querySelector('.confirm-btn').onclick = () => { onConfirm(); removeToast(); };
        toastDiv.querySelector('.cancel-btn').onclick = () => { onCancel(); removeToast(); };
    } else {
        if (duration > 0) setTimeout(removeToast, duration);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.account-detail-row.is-editable').forEach(row => {
        const editBtn = row.querySelector('.edit-trigger-btn');
        const saveBtn = row.querySelector('.save-btn');
        const cancelBtn = row.querySelector('.cancel-btn');
        const valueSpan = row.querySelector('.account-detail-value');
        const inputEl = row.querySelector('input, textarea');

        editBtn.addEventListener('click', () => {
            row.classList.add('editing');
            inputEl.focus();
        });

        cancelBtn.addEventListener('click', () => {
            row.classList.remove('editing');
            inputEl.value = valueSpan.textContent;
        });

        saveBtn.addEventListener('click', () => {
            valueSpan.textContent = inputEl.value;
            row.classList.remove('editing');
            showToast({type: 'success', title: 'نمایشی', message: 'تغییرات شما (به صورت نمایشی) ذخیره شد.'});
        });
    });

    const avatarUploadInput = document.getElementById('avatarUploadInput');
    const avatarUploadInput2 = document.getElementById('avatarUploadInput-2');
    if (avatarUploadInput) {
        avatarUploadInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('profileAvatarPreview').src = event.target.result;
                    showToast({type: 'success', title: 'پیش‌نمایش آواتار', message: 'عکس پروفایل شما برای پیش‌نمایش تغییر کرد.'});
                }
                reader.readAsDataURL(file);
            }
        };
    }
    if (avatarUploadInput2) {
        avatarUploadInput2.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('profileAvatarPreview-2').src = event.target.result;
                    showToast({type: 'success', title: 'پیش‌نمایش آواتار', message: 'عکس پروفایل شما برای پیش‌نمایش تغییر کرد.'});
                }
                reader.readAsDataURL(file);
            }
        };
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.onclick = (e) => {
            e.preventDefault();
            showToast({type: 'info', title: 'خروج از حساب', message: 'این یک دکمه نمایشی برای خروج از حساب است.'});
        };
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const addressListContainer = document.getElementById('addressesListContainer');
    const modal = document.getElementById('addressModal');
    const backdrop = document.getElementById('addressModalBackdrop');
    const modalTitle = document.getElementById('addressModalTitle');
    const addressForm = document.getElementById('addressForm');
    const addNewAddressBtn = document.getElementById('addNewAddressBtn');

    const openAddressModal = (mode = 'add') => {
        if (!modal) return;
        addressForm.reset();
        modalTitle.textContent = (mode === 'add') ? 'افزودن آدرس جدید' : 'ویرایش آدرس';
        modal.classList.add('open');
        backdrop.classList.add('open');
    };

    const closeAddressModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        backdrop.classList.remove('open');
    };

    const setDefaultAddress = (cardToMakeDefault) => {
        if (cardToMakeDefault.classList.contains('is-default')) return;
        const currentDefault = addressListContainer.querySelector('.address-card-new.is-default');
        if (currentDefault) {
            currentDefault.classList.remove('is-default');
        }
        cardToMakeDefault.classList.add('is-default');
        showToast({type: 'success', title: 'انجام شد', message: 'آدرس پیش‌فرض با موفقیت تغییر کرد.'});
    };

    if (addressListContainer) {
        addressListContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.address-card-new');
            if (!card) return;

            const button = e.target.closest('button');

            if (button) {
                e.stopPropagation();
                if (button.classList.contains('edit-address-btn')) {
                    openAddressModal('edit');
                } else if (button.classList.contains('delete-address-btn')) {
                    if (card.classList.contains('is-default')) {
                        showToast({type: 'error', title: 'خطا', message: 'شما نمی‌توانید آدرس پیش‌فرض را حذف کنید.'});
                        return;
                    }
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(50px)';
                    setTimeout(() => card.remove(), 300);
                    showToast({type: 'info', title: 'حذف شد', message: 'آدرس مورد نظر حذف گردید.'});
                }
            } else {
                setDefaultAddress(card);
            }
        });
    }

    if (addNewAddressBtn) addNewAddressBtn.addEventListener('click', () => openAddressModal('add'));
    if (modal) {
        modal.querySelector('.modal-close-btn-new').addEventListener('click', closeAddressModal);
        modal.querySelector('.cancel-form-btn').addEventListener('click', closeAddressModal);
    }
    if (backdrop) backdrop.addEventListener('click', closeAddressModal);

    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeAddressModal();
            showToast({type: 'success', title: 'ذخیره شد', message: 'آدرس شما (به صورت نمایشی) ذخیره شد.'});
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const orderFilter = document.getElementById('orderFilterStatus');
    const orderCards = document.querySelectorAll('.order-card-new');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    if (orderFilter) {
        orderFilter.addEventListener('change', () => {
            const selectedStatus = orderFilter.value;
            let visibleCount = 0;
            orderCards.forEach(card => {
                const cardStatus = card.dataset.status;
                const shouldShow = (selectedStatus === 'all' || selectedStatus === cardStatus);
                card.style.display = shouldShow ? 'block' : 'none';
                if (shouldShow) {
                    visibleCount++;
                }
            });
            if (noOrdersMessage) {
                noOrdersMessage.style.display = (visibleCount === 0) ? 'block' : 'none';
            }
        });
    }

    const modal = document.getElementById('orderDetailsModal');
    const backdrop = document.getElementById('orderModalBackdrop');
    const openModalButtons = document.querySelectorAll('.view-order-details-btn');
    const closeModalButtons = document.querySelectorAll('.modal-close-btn-new, .modal-backdrop-new');

    const openModal = () => {
        if(modal && backdrop) {
            modal.classList.add('open');
            backdrop.classList.add('open');
        }
    };
    const closeModal = () => {
        if(modal && backdrop) {
            modal.classList.remove('open');
            backdrop.classList.remove('open');
        }
    };
    openModalButtons.forEach(button => button.addEventListener('click', openModal));
    closeModalButtons.forEach(button => button.addEventListener('click', closeModal));
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('changePasswordForm');
    if (!form) return;

    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password-visibility');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const icon = button.querySelector('use');
            if (input && icon) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                icon.setAttribute('xlink:href', isPassword ? '#icon-eye-off' : '#icon-eye');
                button.setAttribute('title', isPassword ? 'پنهان کردن رمز' : 'نمایش رمز');
            }
        });
    });

    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', () => {
            const password = newPasswordInput.value;
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;

            if (strengthBar) {
                strengthBar.className = 'strength-bar';
                if (strength <= 1) {
                    strengthBar.style.width = '25%'; strengthBar.classList.add('weak');
                } else if (strength === 2) {
                    strengthBar.style.width = '50%'; strengthBar.classList.add('weak');
                } else if (strength === 3) {
                    strengthBar.style.width = '75%'; strengthBar.classList.add('medium');
                } else {
                    strengthBar.style.width = '100%'; strengthBar.classList.add('strong');
                }
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        let isValid = true;
        const DUMMY_CURRENT_PASSWORD = 'password123';

        if (currentPasswordInput.value === '') {
            isValid = false;
        } else if (currentPasswordInput.value !== DUMMY_CURRENT_PASSWORD) {
            isValid = false;
        }

        if (newPasswordInput.value.length < 8) {
            isValid = false;
        }

        if (newPasswordInput.value !== confirmPasswordInput.value) {
            isValid = false;
        }

        if (isValid) {
            alert('رمز عبور شما (به صورت نمایشی) با موفقیت تغییر کرد!');
            form.reset();
            if (strengthBar) strengthBar.style.width = '0%';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = document.body.dataset.currentPage;
    if (currentPage) {
        const activeNavLink = document.querySelector(`.sidebar-nav-new a[data-page="${currentPage}"]`);
        if(activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }
});


$('#birthDate').persianDatepicker({
    format: 'YYYY/MM/DD',
    initialValue: false,
    autoClose: true
});

