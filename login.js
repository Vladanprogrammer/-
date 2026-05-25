const loginForm = document.querySelector('#login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = loginForm.querySelectorAll('.form-input');
        
        // Перевіряємо, чи є 2 поля (пошта і пароль)
        if (inputs.length < 2) return; 

        const emailValue = inputs[0].value.trim(); 
        const passwordValue = inputs[1].value.trim();

        if (emailValue !== '' && passwordValue !== '') {
            let usersList = JSON.parse(localStorage.getItem('allUsers')) || [];
            
            // Шукаємо юзера по ПОШТІ та ПАРОЛЮ
            let foundUser = usersList.find(user => 
                user.email === emailValue && user.password === passwordValue
            );

            if (foundUser) {
                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                window.location.href = 'index.html';
            } else {
                alert('Невірна пошта або пароль!');
            }
        } else {
            alert('Заповніть всі поля!');
        }
    });
}