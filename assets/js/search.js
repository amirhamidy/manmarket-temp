



document.addEventListener('DOMContentLoaded', () => {
    const mobileFilterBar = document.getElementById('mobileFilterBar');
    const filtersBottomSheetOverlay = document.getElementById('filtersBottomSheetOverlay');
    const filtersBottomSheet = document.getElementById('filtersBottomSheet');
    const bottomSheetFilterContent = document.getElementById('bottomSheetFilterContent');
    const closeBottomSheetButton = document.getElementById('closeBottomSheetButton');
    const sidebarFilterContentWrapper = document.querySelector('.fill-filters-sidebar-content-wrapper');

    const isMobile = () => window.innerWidth < 992;

    const updateLayoutBasedOnWidth = () => {
        if (isMobile()) {
            document.body.classList.add('is-mobile-layout');
            if (sidebarFilterContentWrapper && bottomSheetFilterContent) {
                if (!bottomSheetFilterContent.contains(sidebarFilterContentWrapper)) {
                    bottomSheetFilterContent.appendChild(sidebarFilterContentWrapper);
                }
            }
        } else {
            document.body.classList.remove('is-mobile-layout');
            const desktopSidebar = document.querySelector('.fill-filters-sidebar-container');
            if (sidebarFilterContentWrapper && desktopSidebar) {
                if (!desktopSidebar.contains(sidebarFilterContentWrapper)) {
                    desktopSidebar.appendChild(sidebarFilterContentWrapper);
                }
            }
        }
    };

    updateLayoutBasedOnWidth();
    window.addEventListener('resize', updateLayoutBasedOnWidth);

    const filterChips = document.querySelectorAll('.mobile-filter-bar .btn-filter-chip[data-filter-target="all"]');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filtersBottomSheetOverlay.classList.add('show');
            filtersBottomSheet.classList.add('show');
        });
    });

    closeBottomSheetButton.addEventListener('click', () => {
        filtersBottomSheetOverlay.classList.remove('show');
        filtersBottomSheet.classList.remove('show');
    });

    filtersBottomSheetOverlay.addEventListener('click', () => {
        filtersBottomSheetOverlay.classList.remove('show');
        filtersBottomSheet.classList.remove('show');
    });

    const applyFiltersMobileButton = document.getElementById('applyFiltersMobileButton');
    if (applyFiltersMobileButton) {
        applyFiltersMobileButton.setAttribute('type', 'submit');
        applyFiltersMobileButton.addEventListener('click', () => {
            filtersBottomSheetOverlay.classList.remove('show');
            filtersBottomSheet.classList.remove('show');
        });
    }

    const priceSliderTrack = document.getElementById('priceSliderTrack');
    const minPriceHandle = document.getElementById('minPriceHandle');
    const maxPriceHandle = document.getElementById('maxPriceHandle');
    const minPriceDisplay = document.getElementById('minPriceDisplay');
    const maxPriceDisplay = document.getElementById('maxPriceDisplay');
    const minPriceValueInput = document.getElementById('minPriceValue');
    const maxPriceValueInput = document.getElementById('maxPriceValue');
    const priceSliderRange = document.getElementById('priceSliderRange');

    const actualMinProductPrice = 0;
    const actualMaxProductPrice = 100000000;

    let currentMinPrice = actualMinProductPrice;
    let currentMaxPrice = actualMaxProductPrice;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const updatePriceDisplays = () => {
        minPriceDisplay.textContent = formatPrice(currentMinPrice);
        maxPriceDisplay.textContent = formatPrice(currentMaxPrice);
        minPriceValueInput.value = currentMinPrice;
        maxPriceValueInput.value = currentMaxPrice;
    };

    const updateSliderUI = () => {
        const totalRange = actualMaxProductPrice - actualMinProductPrice;
        if (totalRange === 0) {
            priceSliderRange.style.left = '0%';
            priceSliderRange.style.width = '100%';
            minPriceHandle.style.left = '0%';
            maxPriceHandle.style.left = '100%';
            return;
        }

        const minPercent = ((currentMinPrice - actualMinProductPrice) / totalRange) * 100;
        const maxPercent = ((currentMaxPrice - actualMinProductPrice) / totalRange) * 100;

        priceSliderRange.style.left = `${minPercent}%`;
        priceSliderRange.style.width = `${maxPercent - minPercent}%`;

        minPriceHandle.style.left = `${minPercent}%`;
        maxPriceHandle.style.left = `${maxPercent}%`;

        if (minPercent > maxPercent) {
            minPriceHandle.style.zIndex = 3;
            maxPriceHandle.style.zIndex = 2;
        } else {
            minPriceHandle.style.zIndex = 2;
            maxPriceHandle.style.zIndex = 3;
        }
    };

    let activeHandle = null;

    const getClientX = (e) => {
        return e.touches ? e.touches[0].clientX : e.clientX;
    };

    const onStart = (e, handle) => {
        activeHandle = handle;
        e.preventDefault();
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
        handle.classList.add('active');
    };

    const onMove = (e) => {
        if (!activeHandle) return;

        const sliderRect = priceSliderTrack.getBoundingClientRect();
        let newX = getClientX(e) - sliderRect.left;
        let percent = (newX / sliderRect.width) * 100;

        percent = Math.max(0, Math.min(100, percent));

        const step = 1000000;
        let rawValue = actualMinProductPrice + (percent / 100) * (actualMaxProductPrice - actualMinProductPrice);
        const newValue = Math.round(rawValue / step) * step;

        if (activeHandle === minPriceHandle) {
            currentMinPrice = Math.min(newValue, currentMaxPrice);
        } else if (activeHandle === maxPriceHandle) {
            currentMaxPrice = Math.max(newValue, currentMinPrice);
        }

        if (currentMinPrice > currentMaxPrice) {
            [currentMinPrice, currentMaxPrice] = [currentMaxPrice, currentMinPrice];
        }

        updateSliderUI();
        updatePriceDisplays();
    };

    const onEnd = () => {
        if (activeHandle) {
            activeHandle.classList.remove('active');
        }
        activeHandle = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
    };

    minPriceHandle.addEventListener('mousedown', (e) => onStart(e, minPriceHandle));
    maxPriceHandle.addEventListener('mousedown', (e) => onStart(e, maxPriceHandle));
    minPriceHandle.addEventListener('touchstart', (e) => onStart(e, minPriceHandle));
    maxPriceHandle.addEventListener('touchstart', (e) => onStart(e, maxPriceHandle));

    updatePriceDisplays();
    updateSliderUI();

    const clearFiltersButton = document.getElementById('clearFiltersButton');
    if (clearFiltersButton) {
        clearFiltersButton.setAttribute('type', 'submit');
        clearFiltersButton.addEventListener('click', () => {
            const allCheckboxesAndRadios = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
            allCheckboxesAndRadios.forEach(input => {
                input.checked = false;
                if (input.name === 'sortOption' && input.value === 'popular') {
                    input.checked = true;
                }
            });

            currentMinPrice = actualMinProductPrice;
            currentMaxPrice = actualMaxProductPrice;
            updateSliderUI();
            updatePriceDisplays();
        });
    }

    const layoutToggleButton = document.getElementById('layoutToggleButton');
    const layoutPopover = document.getElementById('layoutPopover');
    const resultsGrid = document.getElementById('resultsGrid');
    const layoutOptions = document.querySelectorAll('.layout-popover .layout-option');

    const setLayout = (layout) => {
        if (layout === 'list') {
            resultsGrid.classList.add('view-list');
            resultsGrid.classList.remove('row-cols-2', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4');
        } else {
            resultsGrid.classList.remove('view-list');
            resultsGrid.classList.add('row-cols-2', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4');
        }

        layoutOptions.forEach(option => {
            if (option.dataset.layout === layout) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    };

    if (layoutToggleButton) {
        layoutToggleButton.addEventListener('click', (event) => {
            layoutPopover.classList.toggle('show');
            layoutToggleButton.classList.toggle('popover-active');
            event.stopPropagation();
        });
    }

    document.addEventListener('click', (event) => {
        if (!layoutPopover.contains(event.target) && !layoutToggleButton.contains(event.target)) {
            layoutPopover.classList.remove('show');
            layoutToggleButton.classList.remove('popover-active');
        }
    });

    layoutOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLayout = option.dataset.layout;
            setLayout(selectedLayout);
            layoutPopover.classList.remove('show');
            layoutToggleButton.classList.remove('popover-active');
        });
    });

    setLayout('grid');
});
