const menu = document.querySelector('.menu');
const hamburgers = document.querySelectorAll('.hamburger');

const rightMenu = document.querySelector('.logo-departing');
const accountButtons = document.querySelectorAll('.account-trigger');

hamburgers.forEach(function(btn) {
    btn.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
});

accountButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        rightMenu.classList.toggle('active');
    });
});

// Логіка для випадаючого фільтру "Момент створення"
const timeFilterBtn = document.getElementById('time-filter-btn');
const timePopup = document.getElementById('time-popup');

if (timeFilterBtn && timePopup) {
    timeFilterBtn.addEventListener('click', function(event) {
        timePopup.classList.toggle('show');
        event.stopPropagation(); // Запобігає миттєвому закриттю
    });

    // Закриваємо попап, якщо користувач клікнув десь в іншому місці на сторінці
    document.addEventListener('click', function(event) {
        if (!timePopup.contains(event.target) && event.target !== timeFilterBtn) {
            timePopup.classList.remove('show');
        }
    });
}

// Автоматичне підсвічування активної сторінки в лівому меню
const menuLinks = document.querySelectorAll('.menu a'); // Змінили селектор тут
const currentPage = window.location.pathname.split('/').pop();

menuLinks.forEach(function(link) {
    const linkHref = link.getAttribute('href');
    
    // Перевіряємо збіг поточного файлу з атрибутом href
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'main.html')) {
        link.classList.add('menu-active-link');
    }
});

const posts = document.querySelectorAll('.post-item');

for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const replyBtn = post.querySelector('.reply-btn');
    const answerLink = post.querySelector('.answer-1');
    const commentsSection = post.querySelector('.full');

    if (replyBtn && commentsSection) {
        replyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (commentsSection.classList.contains('open')) {
                commentsSection.classList.remove('open');
            } else {
                commentsSection.classList.add('open');
            }
        });
    }

    if (answerLink && commentsSection) {
        answerLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (commentsSection.classList.contains('open')) {
                commentsSection.classList.remove('open');
            } else {
                commentsSection.classList.add('open');
            }
        });
    }
}