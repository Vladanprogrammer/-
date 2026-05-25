if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

const themeToggle = document.querySelector('.switch input'); 

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