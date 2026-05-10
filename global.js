const menu = document.querySelector('.menu');
const hamburgers = document.querySelectorAll('.hamburger');

hamburgers.forEach(function(btn) {
    btn.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
});