const regForm = document.querySelector('#reg-form');

if (regForm) {
    regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = regForm.querySelectorAll('.form-input');
        
        // Перевіряємо, чи є всі 4 поля на сторінці реєстрації
        if (inputs.length < 4) return; 

        const nickname = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const device = inputs[2].value.trim();
        const password = inputs[3].value.trim();

        if (nickname !== '' && email !== '' && password !== '') {
            let usersList = JSON.parse(localStorage.getItem('allUsers')) || [];
            
            // Перевіряємо, чи немає вже такої пошти або нікнейму
            let userExists = usersList.find(user => user.email === email || user.nickname === nickname);
            
            if (userExists) {
                alert("Користувач з такою поштою або іменем вже існує!");
                return;
            }

            const userData = {
                nickname: nickname,
                email: email,
                device: device,
                password: password
            };
            
            usersList.push(userData);
            localStorage.setItem('allUsers', JSON.stringify(usersList));
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            window.location.href = 'account.html'; 
        }
    });
}