const removeButtons = document.querySelectorAll('.remove');

removeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const article = this.closest('article');
        if (article) {
            article.remove();
        }
        checkArticles();
    });
});

function checkArticles() {
    const articles = document.querySelectorAll('article');
    const showNull = document.querySelector('.show-null');

    if (articles.length === 0) {
        showNull.classList.remove('d-none');
    } else {
        showNull.classList.add('d-none');
    }
}

checkArticles();