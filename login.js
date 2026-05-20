const loginForm = document.querySelector('#login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const savedAccount = localStorage.getItem('accountData');
        
        if (savedAccount) {
            localStorage.setItem('currentUser', savedAccount);
            window.location.href = 'main.html';
        } else {
            alert('Акаунт не знайдено! Спочатку зареєструйтесь.');
        }
    });
}