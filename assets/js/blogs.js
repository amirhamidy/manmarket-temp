    $(document).ready(function(){
    $('.blog-s-product-slider').slick({
        rtl: true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true
    });
});
    const progressBar = document.querySelector('.blog-s-progress-bar');
    window.addEventListener('scroll', () => { const { scrollTop, scrollHeight, clientHeight } = document.documentElement; const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100; progressBar.style.width = `${scrollPercent}%`; });
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.1 });
    document.querySelectorAll('.blog-s-animate-on-scroll').forEach(el => observer.observe(el));


