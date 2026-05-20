const regForm = document.querySelector('#reg-form');
const nicknameInput = document.querySelector('#reg-nickname');
const deviceInput = document.querySelector('#reg-device');

if (regForm) {
    regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nickname = nicknameInput.value.trim();
        const device = deviceInput.value.trim();

        if (nickname !== '' && device !== '') {
            const userData = {
                nickname: nickname,
                device: device
            };
            
            localStorage.setItem('accountData', JSON.stringify(userData));
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            window.location.href = 'account.html'; 
        }
    });
}