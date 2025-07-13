    document.getElementById('go-to-mf').addEventListener('click' , (event)=>{
    event.preventDefault();
    window.open('faq.html#content-returns', '_blank');
});

    document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.faq-sidebar a');
    const contentSections = document.querySelectorAll('.faq-content-section');

    function switchTab(targetId) {
    targetId = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    let sectionFound = false;
    contentSections.forEach(section => {
    if (section.id === targetId) {
    section.classList.add('active-section');
    sectionFound = true;
} else {
    section.classList.remove('active-section');
}
});
    if (!sectionFound) console.warn(`Content section ID "${targetId}" not found.`);

    let linkFound = false;
    sidebarLinks.forEach(link => {
    const linkTarget = (link.dataset.target || '').replace(/^#/, '');
    if (linkTarget === targetId) {
    link.classList.add('active');
    linkFound = true;
} else {
    link.classList.remove('active');
}
});
    if (!linkFound) console.warn(`Sidebar link targeting "${targetId}" not found.`);
}

    sidebarLinks.forEach(link => {
    link.addEventListener('click', function(event) {
    event.preventDefault();
    const targetId = this.dataset.target;
    if (targetId) {
    const cleanTargetId = targetId.replace(/^#/, '');
    switchTab(cleanTargetId);
    try {
    history.pushState(null, '', `#${cleanTargetId}`);
} catch (e) { console.warn("Could not update URL hash:", e); }
}
});
});

    let initialTargetId = null;
    try {
    const currentHash = window.location.hash;
    if (currentHash && currentHash.length > 1) {
    const potentialTargetId = currentHash.substring(1);
    if (document.getElementById(potentialTargetId)) {
    initialTargetId = potentialTargetId;
} else { console.warn(`Hash target "${potentialTargetId}" does not exist.`); }
}
} catch (e) { console.warn("Could not read URL hash:", e); }

    if (!initialTargetId) {
    const firstLink = document.querySelector('.faq-sidebar a');
    if (firstLink && firstLink.dataset.target) {
    initialTargetId = (firstLink.dataset.target || '').replace(/^#/, '');
    if (!window.location.hash || window.location.hash.length <= 1 || !document.getElementById(window.location.hash.substring(1))) {
    sidebarLinks.forEach(link => link.classList.remove('active'));
    firstLink.classList.add('active');
}
}
}

    if (initialTargetId && document.getElementById(initialTargetId)) {
    if (window.location.hash && window.location.hash.length > 1 && window.location.hash.substring(1) === initialTargetId) {
    sidebarLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.faq-sidebar a[data-target="#${initialTargetId}"]`) || document.querySelector(`.faq-sidebar a[data-target="${initialTargetId}"]`);
    if(activeLink) activeLink.classList.add('active');
}
    switchTab(initialTargetId);
} else {
    const firstExistingSection = document.querySelector('.faq-content-section');
    if(firstExistingSection) {
    const fallbackId = firstExistingSection.id;
    console.warn(`Initial target '${initialTargetId}' not found, falling back to first section '${fallbackId}'.`);
    switchTab(fallbackId);
    const fallbackLink = document.querySelector(`.faq-sidebar a[data-target="#${fallbackId}"]`) || document.querySelector(`.faq-sidebar a[data-target="${fallbackId}"]`);
    if (fallbackLink && !document.querySelector('.faq-sidebar a.active')) {
    sidebarLinks.forEach(link => link.classList.remove('active'));
    fallbackLink.classList.add('active');
}
} else {
    console.error("No content sections found to display.");
    contentSections.forEach(section => section.classList.remove('active-section'));
    sidebarLinks.forEach(link => link.classList.remove('active'));
}
}

    const allAccordionItems = document.querySelectorAll('.faq-item');

    allAccordionItems.forEach(item => {
    const summary = item.querySelector(':scope > summary');
    if (!summary) return;

    summary.addEventListener('click', event => {
    event.preventDefault();
    const currentItem = item;

    currentItem.open = !currentItem.open;

    if (currentItem.open) {
    let siblingsToClose = [];
    const parentElement = currentItem.parentElement;

    if (parentElement && parentElement.classList.contains('faq-accordion')) {
    siblingsToClose = parentElement.querySelectorAll(':scope > .faq-item');
}
    else if (parentElement && parentElement.classList.contains('faq-answer')) {
    const parentDetails = parentElement.closest('.faq-item[open]');
    if (parentDetails) {
    siblingsToClose = parentElement.querySelectorAll(':scope > .faq-item');
}
}

    siblingsToClose.forEach(sibling => {
    if (sibling instanceof HTMLDetailsElement && sibling !== currentItem && sibling.open) {
    sibling.open = false;
}
});
}
});
});
});
