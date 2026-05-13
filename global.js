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