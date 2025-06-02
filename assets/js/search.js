    document.addEventListener('DOMContentLoaded', () => {
    const resultsGridContainer = document.getElementById('resultsGridContainer');
    const initialProductDataForFilters = Array.from(document.querySelectorAll('#resultsGrid .col[data-price]')).map(el => ({
    price: parseFloat(el.dataset.price),
    category: el.dataset.category,
    brand: el.dataset.brand
}));

    let categoryFilterContainer, brandFilterContainer, sortOptionsContainer;
    let mainClearFiltersButton, applyFiltersButton;
    let sidebarHeaderElement;

    let actualMinProductPrice = 0;
    let actualMaxProductPrice = 100000000;
    let filterIdCounter = 0;
    let currentPageFromURL = 1;
    const totalPagesStatic = parseInt(document.getElementById('paginationUl')?.dataset?.totalPages || '3');
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('paginationUl');

    const tickSVGPath = "M4.5 8.5l2.5 2.5 5-5";
    const tempTickSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const tempTickPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempTickPath.setAttribute("d", tickSVGPath);
    tempTickPath.style.strokeWidth = "2.5"; tempTickPath.style.fill = "none";
    tempTickSVG.appendChild(tempTickPath); document.body.appendChild(tempTickSVG);
    const tickPathLength = tempTickPath.getTotalLength(); document.body.removeChild(tempTickSVG);
    document.documentElement.style.setProperty('--tick-path-length', tickPathLength.toFixed(2));
    const tickSVGIconHTML = `<svg class="fill-tick-icon" viewBox="0 0 16 16"><path d="${tickSVGPath}" /></svg>`;

    const chipRemoveSVGPath = "M4 4 L12 12 M12 4 L4 12";
    const tempRemoveSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const tempRemovePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempRemovePath.setAttribute("d", chipRemoveSVGPath);
    tempRemovePath.style.strokeWidth = "1.75"; tempRemovePath.style.fill = "none";
    tempRemoveSVG.appendChild(tempRemovePath); document.body.appendChild(tempRemoveSVG);
    const chipRemovePathLength = tempRemovePath.getTotalLength(); document.body.removeChild(tempRemoveSVG);
    document.documentElement.style.setProperty('--chip-remove-icon-path-length', chipRemovePathLength.toFixed(2));
    const chipRemoveSVGIconHTML = `<svg class="fill-chip-remove-icon" viewBox="0 0 16 16"><path d="${chipRemoveSVGPath}" stroke-width="1.75" fill="none"/></svg>`;

    const filtersSidebarDOMContainer = document.querySelector('.fill-filters-sidebar-container');
    const filtersTemplate = document.getElementById('filtersSidebarContentTemplate');
    let filterContentWrapper;

    const mobileFilterBar = document.getElementById('mobileFilterBar');
    const filtersBottomSheet = document.getElementById('filtersBottomSheet');
    const filtersBottomSheetOverlay = document.getElementById('filtersBottomSheetOverlay');
    const bottomSheetFilterContent = document.getElementById('bottomSheetFilterContent');
    const closeBottomSheetButton = document.getElementById('closeBottomSheetButton');

    const layoutToggleButton = document.getElementById('layoutToggleButton');
    const layoutPopover = document.getElementById('layoutPopover');
    const resultsGrid = document.getElementById('resultsGrid');

    const gridViewClasses = ['row-cols-2', 'row-cols-sm-2', 'row-cols-md-3', 'row-cols-lg-4'];
    const listViewClassesMobile = ['row-cols-1'];
    let currentLayout = 'grid';

    const lgBreakpoint = 992;

    if (filtersTemplate) {
    filterContentWrapper = filtersTemplate.querySelector('.fill-filters-sidebar-content-wrapper');
    if (filterContentWrapper) filtersTemplate.remove(); else console.error("Filter wrapper not found in template!");
} else {
    console.error("Filter template not found!");
}

    function initializeDynamicElements() {
    if (!filterContentWrapper) return false;
    categoryFilterContainer = filterContentWrapper.querySelector('#categoryFilterContainer');
    brandFilterContainer = filterContentWrapper.querySelector('#brandFilterContainer');
    sortOptionsContainer = filterContentWrapper.querySelector('#sortOptionsContainer');
    mainClearFiltersButton = filterContentWrapper.querySelector('#clearFiltersButton');
    applyFiltersButton = filterContentWrapper.querySelector('#applyFiltersMobileButton');
    sidebarHeaderElement = filterContentWrapper.querySelector('.fill-sidebar-header');
    return true;
}

    function formatPrice(value) {
    if (value == null || isNaN(Number(value))) return '';
    return Number(value).toLocaleString('fa-IR');
}

    function formatInitialPricesInDOM() {
    document.querySelectorAll('#resultsGrid .fill-price-value').forEach(el => {
    const price = parseFloat(el.closest('.col[data-price]')?.dataset?.price);
    if (!isNaN(price)) el.textContent = formatPrice(price);
});
}

    function updatePriceSliderDisplays(currentMin, currentMax) {
    if (!filterContentWrapper) return;
    const dMinEl = filterContentWrapper.querySelector('#maxPriceDisplay');
    const dMaxEl = filterContentWrapper.querySelector('#minPriceDisplay');
    const iMinEl = filterContentWrapper.querySelector('#minPriceValue');
    const iMaxEl = filterContentWrapper.querySelector('#maxPriceValue');
    if (!dMinEl || !dMaxEl || !iMinEl || !iMaxEl) return;
    dMinEl.textContent = formatPrice(currentMin);
    dMaxEl.textContent = formatPrice(currentMax);
    iMinEl.value = (currentMin === actualMinProductPrice && currentMax === actualMaxProductPrice) ? '' : currentMin;
    iMaxEl.value = (currentMin === actualMinProductPrice && currentMax === actualMaxProductPrice) ? '' : currentMax;
}

    function updateSliderHandlesFromValues() {
    if (!filterContentWrapper) return;
    const minPriceInput = filterContentWrapper.querySelector('#minPriceValue');
    const maxPriceInput = filterContentWrapper.querySelector('#maxPriceValue');
    if (!minPriceInput || !maxPriceInput) return;
    const minPriceVal = parseFloat(minPriceInput.value || actualMinProductPrice);
    const maxPriceVal = parseFloat(maxPriceInput.value || actualMaxProductPrice);
    const hMinVisual = filterContentWrapper.querySelector('#maxPriceHandle');
    const hMaxVisual = filterContentWrapper.querySelector('#minPriceHandle');
    const pRange = filterContentWrapper.querySelector('#priceSliderRange');
    const pTrack = filterContentWrapper.querySelector('#priceSliderTrack');
    if (!hMinVisual || !hMaxVisual || !pRange || !pTrack ) {
    if (hMinVisual) updateHandlePosition(hMinVisual, 0);
    if (hMaxVisual) updateHandlePosition(hMaxVisual, 100);
    if (hMinVisual && hMaxVisual && pRange) updateSliderRangeFill(hMinVisual, hMaxVisual, pRange);
    return;
}
    if (actualMaxProductPrice - actualMinProductPrice <= 0) {
    updateHandlePosition(hMinVisual, 0); updateHandlePosition(hMaxVisual, 100);
    updateSliderRangeFill(hMinVisual, hMaxVisual, pRange); return;
}
    let minPercent = ((minPriceVal - actualMinProductPrice) / (actualMaxProductPrice - actualMinProductPrice)) * 100;
    let maxPercent = ((maxPriceVal - actualMinProductPrice) / (actualMaxProductPrice - actualMinProductPrice)) * 100;
    minPercent = Math.max(0, Math.min(100, minPercent));
    maxPercent = Math.max(0, Math.min(100, maxPercent));
    if (minPercent > maxPercent) minPercent = Math.max(0, maxPercent - 0.1);
    updateHandlePosition(hMinVisual, minPercent);
    updateHandlePosition(hMaxVisual, maxPercent);
    updateSliderRangeFill(hMinVisual, hMaxVisual, pRange);
}

    function populateFiltersAndGetPriceRange() {
    if (!filterContentWrapper || !categoryFilterContainer || !brandFilterContainer) return;
    const categories = new Set(); const brands = new Set();
    let minP = Infinity; let maxP = 0;
    initialProductDataForFilters.forEach(data => {
    if (data.category) categories.add(data.category);
    if (data.brand) brands.add(data.brand);
    const price = data.price;
    if (!isNaN(price)) { if (price < minP) minP = price; if (price > maxP) maxP = price; }
});
    actualMinProductPrice = (minP === Infinity || !initialProductDataForFilters.length) ? 0 : minP;
    actualMaxProductPrice = (maxP === 0 || !initialProductDataForFilters.length) ? 100000000 : maxP;
    if (actualMinProductPrice >= actualMaxProductPrice) actualMaxProductPrice = actualMinProductPrice + 1000000;
    categoryFilterContainer.innerHTML = '';
    categories.forEach(c => createFilterOption(c, categoryFilterContainer, 'category', 'checkbox'));
    brandFilterContainer.innerHTML = '';
    brands.forEach(b => createFilterOption(b, brandFilterContainer, 'brand', 'checkbox'));
    populateSortOptions();
    initializePriceSlider();
}

    function createFilterOption(value, container, groupName, type = 'checkbox') {
    const optDiv = document.createElement('div'); optDiv.className = 'fill-filter-option';
    const inp = document.createElement('input'); inp.type = type;
    const id = `${groupName}-filter-${filterIdCounter++}`; inp.id = id;
    inp.value = (type === 'radio' && groupName === 'sort') ? value.value : value;
    if (type === 'radio') inp.name = `${groupName}Option`;
    const lbl = document.createElement('label'); lbl.htmlFor = id;
    lbl.textContent = (type === 'radio' && groupName === 'sort') ? value.label : value;
    const tickCont = document.createElement('span'); tickCont.className = 'fill-custom-tick-container';
    tickCont.innerHTML = tickSVGIconHTML; lbl.appendChild(tickCont);
    optDiv.appendChild(inp); optDiv.appendChild(lbl); container.appendChild(optDiv);
    return inp;
}

    function populateSortOptions() {
    if (!sortOptionsContainer) return;
    sortOptionsContainer.innerHTML = '';
    const sortOpts = [
{ value: 'popular', label: 'محبوب ترین', checked: true }, { value: 'newest', label: 'جدیدترین' },
{ value: 'price-asc', label: 'ارزان ترین' }, { value: 'price-desc', label: 'گران‌ترین' },
    ];
    sortOpts.forEach(opt => {
    const radio = createFilterOption(opt, sortOptionsContainer, 'sort', 'radio');
    if (opt.checked) radio.checked = true;
});
}

    function initializePriceSlider() {
    if (!filterContentWrapper) return;
    const hMinVisual = filterContentWrapper.querySelector('#maxPriceHandle');
    const hMaxVisual = filterContentWrapper.querySelector('#minPriceHandle');
    const pTrack = filterContentWrapper.querySelector('#priceSliderTrack');
    const pRange = filterContentWrapper.querySelector('#priceSliderRange');
    if (!hMinVisual || !hMaxVisual || !pTrack || !pRange) return;
    updateHandlePosition(hMinVisual, 0); updateHandlePosition(hMaxVisual, 100);
    updateSliderRangeFill(hMinVisual, hMaxVisual, pRange);
    updatePriceSliderDisplays(actualMinProductPrice, actualMaxProductPrice);
    [hMinVisual, hMaxVisual].forEach(handle => {
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });
});
}

    let currentHandle = null; let sliderRect = null; let isDragging = false;
    function startDrag(e) {
    if (!filterContentWrapper) return;
    const hMinVisual = filterContentWrapper.querySelector('#maxPriceHandle');
    const hMaxVisual = filterContentWrapper.querySelector('#minPriceHandle');
    const pTrack = filterContentWrapper.querySelector('#priceSliderTrack');
    if (!pTrack) return;
    if (e.target.closest('#maxPriceHandle')) currentHandle = hMinVisual;
    else if (e.target.closest('#minPriceHandle')) currentHandle = hMaxVisual;
    else return;
    isDragging = true; if(currentHandle) currentHandle.style.zIndex = '3';
    sliderRect = pTrack.getBoundingClientRect(); document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onDrag); window.addEventListener('mouseup', endDragSlider);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', endDragSlider); window.addEventListener('touchcancel', endDragSlider);
}
    function onDrag(e) {
    if (!isDragging || !currentHandle || !sliderRect || !filterContentWrapper) return;
    if (e.cancelable) e.preventDefault();
    let clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    let percent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
    const hMinVisual = filterContentWrapper.querySelector('#maxPriceHandle');
    const hMaxVisual = filterContentWrapper.querySelector('#minPriceHandle');
    const pRange = filterContentWrapper.querySelector('#priceSliderRange');
    if (!hMinVisual || !hMaxVisual || !pRange) return;
    let minVisPercent = parseFloat(hMinVisual.style.left); let maxVisPercent = parseFloat(hMaxVisual.style.left);
    minVisPercent = isNaN(minVisPercent) ? 0 : minVisPercent; maxVisPercent = isNaN(maxVisPercent) ? 100 : maxVisPercent;
    if (currentHandle === hMinVisual) percent = Math.min(percent, maxVisPercent - 0.5);
    else percent = Math.max(percent, minVisPercent + 0.5);
    percent = Math.max(0, Math.min(100, percent));
    updateHandlePosition(currentHandle, percent); updateSliderRangeFill(hMinVisual, hMaxVisual, pRange);
    const newMinHandlePos = parseFloat(hMinVisual.style.left); const newMaxHandlePos = parseFloat(hMaxVisual.style.left);
    const newMinPrice = actualMinProductPrice + (actualMaxProductPrice - actualMinProductPrice) * (newMinHandlePos / 100);
    const newMaxPrice = actualMinProductPrice + (actualMaxProductPrice - actualMinProductPrice) * (newMaxHandlePos / 100);
    updatePriceSliderDisplays(Math.round(newMinPrice), Math.round(newMaxPrice));
}
    function endDragSlider() {
    if (!isDragging) return; isDragging = false;
    if (currentHandle) currentHandle.style.zIndex = '2'; currentHandle = null;
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onDrag); window.removeEventListener('mouseup', endDragSlider);
    window.removeEventListener('touchmove', onDrag); window.removeEventListener('touchend', endDragSlider);
    window.removeEventListener('touchcancel', endDragSlider);
}
    function updateHandlePosition(handle, percent) { if (handle) handle.style.left = `${percent}%`; }
    function updateSliderRangeFill(hMin, hMax, pRange) {
    if (!hMin || !hMax || !pRange) return;
    const minPercent = parseFloat(hMin.style.left); const maxPercent = parseFloat(hMax.style.left);
    if (isNaN(minPercent) || isNaN(maxPercent)) return;
    pRange.style.left = `${minPercent}%`; pRange.style.width = `${maxPercent - minPercent}%`;
}

    function getSelectedFiltersFromUI(containerId) {
    const container = filterContentWrapper?.querySelector(`#${containerId}`);
    if (!container) return [];
    return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
}

    function getFiltersAsURLParams() {
    const params = new URLSearchParams();
    if (!filterContentWrapper) return params;
    const minPriceInput = filterContentWrapper.querySelector('#minPriceValue');
    const maxPriceInput = filterContentWrapper.querySelector('#maxPriceValue');
    if(minPriceInput?.value && minPriceInput.value !== String(actualMinProductPrice)) params.set('min_price', minPriceInput.value);
    if(maxPriceInput?.value && maxPriceInput.value !== String(actualMaxProductPrice)) params.set('max_price', maxPriceInput.value);
    getSelectedFiltersFromUI('categoryFilterContainer').forEach(cat => params.append('category', cat));
    getSelectedFiltersFromUI('brandFilterContainer').forEach(brand => params.append('brand', brand));
    const sortInput = filterContentWrapper.querySelector('input[name="sortOption"]:checked');
    if (sortInput && sortInput.value !== 'popular') params.set('sort', sortInput.value);
    return params;
}

    function applyFiltersFromURLToUI() {
    if (!filterContentWrapper) return;
    const params = new URLSearchParams(window.location.search);
    const minPriceInput = filterContentWrapper.querySelector('#minPriceValue');
    const maxPriceInput = filterContentWrapper.querySelector('#maxPriceValue');
    const minPriceFromURL = params.get('min_price'); const maxPriceFromURL = params.get('max_price');
    if (minPriceInput) minPriceInput.value = minPriceFromURL || '';
    if (maxPriceInput) maxPriceInput.value = maxPriceFromURL || '';
    updatePriceSliderDisplays(parseFloat(minPriceFromURL || actualMinProductPrice), parseFloat(maxPriceFromURL || actualMaxProductPrice));
    const categoriesFromURL = params.getAll('category');
    categoryFilterContainer?.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = categoriesFromURL.includes(cb.value));
    const brandsFromURL = params.getAll('brand');
    brandFilterContainer?.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = brandsFromURL.includes(cb.value));
    const sortFromURL = params.get('sort') || 'popular';
    const sortRadio = sortOptionsContainer?.querySelector(`input[name="sortOption"][value="${sortFromURL}"]`);
    if (sortRadio) sortRadio.checked = true;
    else sortOptionsContainer?.querySelector(`input[name="sortOption"][value="popular"]`)?.setAttribute('checked', 'true'); // setAttribute for radio
    currentPageFromURL = parseInt(params.get('page')) || 1;
    updateChipActiveStates();
}

    function addRemoveIconsToFilterChips() {
    if (!mobileFilterBar) return;
    mobileFilterBar.querySelectorAll('.btn-filter-chip[data-filter-target]').forEach(chip => {
    const filterType = chip.dataset.filterTarget;
    if (filterType === 'all') return;
    let textSpan = chip.querySelector('span:not(.chip-remove-icon-container)');
    if (!textSpan && chip.firstChild?.nodeType === Node.TEXT_NODE) { // Ensure we are targeting the text node
    const chipText = chip.firstChild.nodeValue.trim();
    chip.innerHTML = ''; // Clear current content to re-wrap
    textSpan = document.createElement('span'); textSpan.textContent = chipText; chip.appendChild(textSpan);
} else if (!textSpan && chip.textContent.trim() && !chip.querySelector('svg')) { // Fallback if text is direct child
    const chipText = chip.textContent.trim();
    chip.innerHTML = '';
    textSpan = document.createElement('span'); textSpan.textContent = chipText; chip.appendChild(textSpan);
}

    if (!chip.querySelector('.chip-remove-icon-container')) {
    const removeIconContainer = document.createElement('span');
    removeIconContainer.className = 'chip-remove-icon-container';
    removeIconContainer.innerHTML = chipRemoveSVGIconHTML;
    chip.appendChild(removeIconContainer);
    removeIconContainer.addEventListener('click', (e) => {
    e.stopPropagation(); clearSpecificFilter(filterType);
});
}
});
}

    function isFilterApplied(filterType, params) {
    if (!params) params = new URLSearchParams(window.location.search);
    switch (filterType) {
    case 'price': return params.has('min_price') || params.has('max_price');
    case 'category': return params.has('category');
    case 'brand': return params.has('brand');
    case 'color': return params.has('color');
    case 'size': return params.has('size');
    case 'material': return params.has('material');
    default: return false;
}
}

    function updateChipActiveStates() {
    if (!mobileFilterBar) return;
    const currentParams = new URLSearchParams(window.location.search);
    mobileFilterBar.querySelectorAll('.btn-filter-chip').forEach(chip => {
    const filterType = chip.dataset.filterTarget;
    const sortOption = chip.dataset.sortOption;
    if (filterType && filterType !== 'all') {
    const isActive = isFilterApplied(filterType, currentParams);
    chip.classList.toggle('active', isActive);
    chip.classList.toggle('has-applied-filter', isActive);
} else if (sortOption) {
    chip.classList.toggle('active', sortOption === (currentParams.get('sort') || 'popular'));
}
});
}

    function clearSpecificFilter(filterType) {
    const params = new URLSearchParams(window.location.search);
    switch (filterType) {
    case 'price': params.delete('min_price'); params.delete('max_price'); break;
    case 'category': params.delete('category'); break;
    case 'brand': params.delete('brand'); break;
    case 'color': params.delete('color'); break;
    case 'size': params.delete('size'); break;
    case 'material': params.delete('material'); break;
}
    params.delete('page');
    window.location.search = params.toString();
}

    function applyLayout(layout) {
    if (!resultsGrid || !layoutPopover) return; // layoutToggleButton آیکون ثابت دارد
    resultsGrid.classList.remove(...gridViewClasses, ...listViewClassesMobile, 'view-list');
    if (layout === 'list') {
    resultsGrid.classList.add(...listViewClassesMobile, 'view-list');
    currentLayout = 'list';
} else {
    resultsGrid.classList.add(...gridViewClasses);
    currentLayout = 'grid';
}
    localStorage.setItem('productLayoutPreference', currentLayout);
    layoutPopover.querySelectorAll('.layout-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.layout === currentLayout);
});
}

    function toggleLayoutPopover(show) {
    if (!layoutPopover || !layoutToggleButton) return;
    if (show) {
    layoutPopover.classList.add('show');
    layoutToggleButton.classList.add('popover-active');
} else {
    layoutPopover.classList.remove('show');
    layoutToggleButton.classList.remove('popover-active');
}
}

    function resetProductGridScroll() { if(resultsGridContainer) resultsGridContainer.scrollTop = 0; }
    function renderStaticPagination() {
    if(!paginationUl || !paginationContainer) return;
    paginationUl.innerHTML = ''; if (totalPagesStatic <= 1) { paginationContainer.classList.add('d-none'); return; }
    paginationContainer.classList.remove('d-none');
    const currentFiltersParams = getFiltersAsURLParams(); currentFiltersParams.delete('page');
    const createPageItem = (text, pageNum, isDisabled, isActive) => {
    const li = document.createElement('li');
    li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
    const a = document.createElement('a'); a.className = 'page-link';
    const pageParams = new URLSearchParams(currentFiltersParams);
    if (pageNum && pageNum === 1) pageParams.delete('page'); // No page param for page 1
    else if (pageNum) pageParams.set('page', pageNum);

    a.href = isDisabled ? '#' : `?${pageParams.toString()}`;
    a.textContent = text; li.appendChild(a); return li;
};
    paginationUl.appendChild(createPageItem('قبلی', currentPageFromURL - 1, currentPageFromURL === 1));
    for (let i = 1; i <= totalPagesStatic; i++) {
    paginationUl.appendChild(createPageItem(i, i, false, i === currentPageFromURL));
}
    paginationUl.appendChild(createPageItem('بعدی', currentPageFromURL + 1, currentPageFromURL === totalPagesStatic));
}


    function setupEventListeners() {
    if (applyFiltersButton) applyFiltersButton.addEventListener('click', () => {
    const params = getFiltersAsURLParams(); params.delete('page');
    window.location.search = params.toString();
    if (filtersBottomSheet?.classList.contains('show')) toggleBottomSheet(false);
});
    if (mainClearFiltersButton) mainClearFiltersButton.addEventListener('click', () => { window.location.search = ''; });

    if (mobileFilterBar) {
    const chipsContainer = mobileFilterBar.querySelector('.scrollable-filter-chips');
    if (chipsContainer) {
    chipsContainer.querySelectorAll('.btn-filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
    if (e.target.closest('.chip-remove-icon-container')) return;
    const filterTarget = chip.dataset.filterTarget; const sortOption = chip.dataset.sortOption;
    if (sortOption) {
    const params = getFiltersAsURLParams(); params.set('sort', sortOption); params.delete('page');
    window.location.search = params.toString();
} else if (filterTarget) toggleBottomSheet(true, filterTarget);
});
});
}
}

    if (closeBottomSheetButton) closeBottomSheetButton.addEventListener('click', () => toggleBottomSheet(false));
    if (filtersBottomSheetOverlay) filtersBottomSheetOverlay.addEventListener('click', () => toggleBottomSheet(false));

    if (layoutToggleButton && layoutPopover) {
    layoutToggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLayoutPopover(!layoutPopover.classList.contains('show'));
});
    layoutPopover.querySelectorAll('.layout-option').forEach(option => {
    option.addEventListener('click', () => {
    applyLayout(option.dataset.layout);
    toggleLayoutPopover(false);
});
});
    document.addEventListener('click', (e) => { // Close on outside click
    if (layoutPopover.classList.contains('show') && !layoutToggleButton.contains(e.target) && !layoutPopover.contains(e.target)) {
    toggleLayoutPopover(false);
}
});
}
}

    function isTouchDevice() { return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)); }

    function manageFilterLayout() {
    if (!filterContentWrapper || !filtersSidebarDOMContainer || !bottomSheetFilterContent || !mobileFilterBar || !sidebarHeaderElement) return;
    const shouldUseMobileLayout = isTouchDevice() || window.innerWidth < lgBreakpoint;
    const layoutToggleContainer = document.querySelector('.layout-toggle-container');
    if (layoutToggleContainer) layoutToggleContainer.style.display = shouldUseMobileLayout ? 'flex' : 'none';

    if (shouldUseMobileLayout) {
    document.body.classList.add('is-mobile-layout'); document.body.classList.remove('is-desktop-layout');
    if (bottomSheetFilterContent && !bottomSheetFilterContent.contains(filterContentWrapper)) {
    bottomSheetFilterContent.appendChild(filterContentWrapper);
}
    sidebarHeaderElement?.classList.add('fill-sidebar-header-hidden-in-offcanvas');
    if (mainClearFiltersButton) mainClearFiltersButton.style.display = 'inline-flex';
    if (applyFiltersButton) applyFiltersButton.style.display = 'inline-flex';

    // Apply stored or default layout for mobile
    if (resultsGrid && layoutPopover) {
    const mobileLayout = localStorage.getItem('productLayoutPreference') || 'grid';
    applyLayout(mobileLayout);
    layoutPopover.querySelectorAll('.layout-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.layout === currentLayout);
});
}

} else { // Desktop
    document.body.classList.remove('is-mobile-layout'); document.body.classList.add('is-desktop-layout');
    if (filtersSidebarDOMContainer && !filtersSidebarDOMContainer.contains(filterContentWrapper)) {
    filtersSidebarDOMContainer.appendChild(filterContentWrapper);
}
    sidebarHeaderElement?.classList.remove('fill-sidebar-header-hidden-in-offcanvas');
    if (mainClearFiltersButton) mainClearFiltersButton.style.display = 'inline-flex';
    if (applyFiltersButton) applyFiltersButton.style.display = 'none';
    if (layoutPopover?.classList.contains('show')) toggleLayoutPopover(false);
    if (resultsGrid) applyLayout('grid'); // Desktop always grid (as per current design)
}
}

    function toggleBottomSheet(show, targetAccordionItemId = null) {
    if (!filtersBottomSheet || !filtersBottomSheetOverlay) return;
    if (show) {
    document.body.style.overflow = 'hidden';
    filtersBottomSheetOverlay.classList.add('show'); filtersBottomSheet.classList.add('show');
    if (targetAccordionItemId && targetAccordionItemId !== 'all' && filterContentWrapper) {
    const accordionIdSuffix = targetAccordionItemId.charAt(0).toUpperCase() + targetAccordionItemId.slice(1);
    const accordionButton = filterContentWrapper.querySelector(`button[data-bs-target="#collapse${accordionIdSuffix}"]`);
    const accordionItemHeading = filterContentWrapper.querySelector(`#heading${accordionIdSuffix}`);
    if (accordionButton && accordionItemHeading) {
    const collapseElement = filterContentWrapper.querySelector(accordionButton.dataset.bsTarget);
    if (collapseElement) {
    const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement);
    if (!collapseElement.classList.contains('show')) bsCollapse.show();
    setTimeout(() => {
    if (bottomSheetFilterContent.scrollHeight > bottomSheetFilterContent.clientHeight) {
    accordionItemHeading.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
}, 350);
}
}
} else if (targetAccordionItemId === 'all') {
    if(bottomSheetFilterContent) bottomSheetFilterContent.scrollTop = 0;
}
} else {
    document.body.style.overflow = '';
    filtersBottomSheetOverlay.classList.remove('show'); filtersBottomSheet.classList.remove('show');
}
}

    // --- Initialization Flow ---
    const filtersInitialized = initializeDynamicElements();
    manageFilterLayout();

    if (filtersInitialized) {
    addRemoveIconsToFilterChips();
    populateFiltersAndGetPriceRange();
    applyFiltersFromURLToUI();
    updateSliderHandlesFromValues();
    setupEventListeners();
}

    formatInitialPricesInDOM();
    resetProductGridScroll();
    renderStaticPagination();

    // Ensure layout is correctly applied on initial load for the correct view (mobile/desktop)
    if (layoutToggleButton && resultsGrid && layoutPopover) {
    const initialLayout = localStorage.getItem('productLayoutPreference') || 'grid';
    if (isTouchDevice() || window.innerWidth < lgBreakpoint) {
    applyLayout(initialLayout);
} else {
    applyLayout('grid');
}
    layoutPopover.querySelectorAll('.layout-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.layout === currentLayout);
});
}

    window.addEventListener('resize', () => {
    manageFilterLayout();
    // If resizing to desktop and layout toggle is hidden, ensure grid view
    if (resultsGrid && layoutToggleButton && !layoutToggleButton.offsetParent) {
    applyLayout('grid');
}
});
});
