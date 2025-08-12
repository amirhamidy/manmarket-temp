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
                alert("روند کپی کردن با مشکل مواجه شد");
            }
        });
    }
});

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
                }
                reader.readAsDataURL(file);
            }
        };
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.onclick = (e) => {
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
                        return;
                    }
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(50px)';
                    setTimeout(() => card.remove(), 300);
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
            closeAddressModal();
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

const myScrollElement = document.getElementById('my-scrolling-container');

if (myScrollElement) {
    myScrollElement.addEventListener('scroll', () => {
        const atEnd = myScrollElement.scrollWidth - myScrollElement.scrollLeft === myScrollElement.clientWidth;

        if (atEnd) {
            myScrollElement.scrollLeft = 0;
        }
    });
}
$('#birthDate').persianDatepicker({
    format: 'YYYY/MM/DD',
    initialValue: false,
    autoClose: true
});



document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-trigger-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const saveButtons = document.querySelectorAll('.save-btn');
    const emailIcon = document.querySelector('.cs-po-ico-2');
    const phoneIcon = document.querySelector('.cs-po-ico');

    const showIcons = () => {
        if (emailIcon) {
            emailIcon.style.visibility = 'visible';
            emailIcon.style.opacity = '1';
        }
        if (phoneIcon) {
            phoneIcon.style.visibility = 'visible';
            phoneIcon.style.opacity = '1';
        }
    };

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentRow = button.closest('.account-detail-row');
            const labelText = parentRow.querySelector('.account-detail-label').innerText.trim();

            if (labelText === 'ایمیل') {
                if (emailIcon) {
                    emailIcon.style.display = 'none';
                    emailIcon.style.opacity = '0';
                }
            } else if (labelText === 'شماره همراه') {
                if (phoneIcon) {
                    phoneIcon.style.display = 'none';
                    phoneIcon.style.opacity = '0';
                }
            }
        });
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', showIcons);
    });

    saveButtons.forEach(button => {
        button.addEventListener('click', showIcons);
    });
});







