document.addEventListener('DOMContentLoaded', () => {
    // --- Blog Mobile Menu / Filter FAB (b-cs-blog- prefix) ---
    const openMenuBtn = document.querySelector('.b-cs-blog-btn-open-filters-fab');
    const closeMenuBtn = document.querySelector('.b-cs-blog-btn-close-menu');
    const mobileDashboardMenu = document.querySelector('.b-cs-blog-mobile-dashboard-menu');
    const mobileMenuOverlay = document.querySelector('.b-cs-blog-mobile-menu-overlay');

    if (openMenuBtn && mobileDashboardMenu && mobileMenuOverlay && closeMenuBtn) {
        function openMobileMenu() {
            mobileDashboardMenu.classList.add('show');
            mobileMenuOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling on body when menu is open
        }

        function closeMobileMenu() {
            mobileDashboardMenu.classList.remove('show');
            mobileMenuOverlay.classList.remove('show');
            document.body.style.overflow = ''; // Restore body scrolling
        }

        openMenuBtn.addEventListener('click', openMobileMenu);
        closeMenuBtn.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu); // Close when clicking outside
    }

    // --- Cart Dashboard (app- prefix) ---
    // Assuming there's a button to open the cart somewhere, e.g., an icon in the header
    // For demonstration, let's assume a button with ID 'open-cart-button' exists
    // const openCartBtn = document.getElementById('open-cart-button'); // You need to add this button in your HTML
    const cartDashboard = document.getElementById('cart-dashboard');
    const closeCartBtn = document.getElementById('close-cart');
    const appOverlay = document.querySelector('.app-overlay');

    function openCart() {
        cartDashboard.classList.add('is-open');
        appOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDashboard.classList.remove('is-open');
        appOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    // if (openCartBtn) {
    //     openCartBtn.addEventListener('click', openCart);
    // }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    if (appOverlay) {
        appOverlay.addEventListener('click', closeCart);
    }

    // --- Existing accordion menu functionality (if any) ---
    // (This part seems not present in the provided HTML but keeping it if it's for other pages)
    const accordionBtns = document.querySelectorAll('[data-accordion-btn]');
    if (accordionBtns.length > 0) {
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const submenu = this.nextElementSibling;
                if (submenu && submenu.dataset.accordion !== undefined) {
                    submenu.classList.toggle('active');
                    this.classList.toggle('active');
                }
            });
        });
    }
});