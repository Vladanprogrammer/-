const themeToggle = document.querySelector('#theme-toggle');

if (themeToggle) {
    if (localStorage.getItem('theme') === 'dark') {
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}