const menu = document.querySelector('.menu');
const hamburgers = document.querySelectorAll('.hamburger');

hamburgers.forEach(function(btn) {
    btn.addEventListener('click', function() {
        if(menu) menu.classList.toggle('active');
    });
});

const rightMenu = document.querySelector('.logo-departing');
const accountButtons = document.querySelectorAll('.account-trigger');

accountButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        if(rightMenu) rightMenu.classList.toggle('active');
    });
});

// Безпечне читання з localStorage
function safeJSONParse(key) {
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (error) {
        localStorage.removeItem(key);
        return null;
    }
}

// Оновлення інтерфейсу для авторизованого користувача
function updateUIForLoggedInUser() {
    const userData = safeJSONParse('currentUser');
    
    if (userData) {
        const ghostText = document.querySelector('.ghost');
        if (ghostText && userData.nickname) {
            ghostText.innerText = userData.nickname;
        }

        const loginBtn = document.querySelector('.rain');
        const regBtn = document.querySelector('.reg');
        if (loginBtn) loginBtn.style.display = 'none';
        if (regBtn) regBtn.style.display = 'none';

        const topGhost = document.querySelector('.top-ghost');
        if (topGhost && !document.querySelector('.logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerText = 'Вийти з акаунта';
            
            logoutBtn.style.width = '100%';
            logoutBtn.style.padding = '10px';
            logoutBtn.style.marginTop = '15px';
            logoutBtn.style.backgroundColor = '#000000';
            logoutBtn.style.color = '#ffffff';
            logoutBtn.style.border = '2px solid #000000';
            logoutBtn.style.borderRadius = '30px';
            logoutBtn.style.fontFamily = '"Manrope", sans-serif';
            logoutBtn.style.fontWeight = '600';
            logoutBtn.style.cursor = 'pointer';
            logoutBtn.style.transition = 'all 0.2s ease';

            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.reload(); 
            });

            topGhost.appendChild(logoutBtn);
        }
    }
}

updateUIForLoggedInUser();

const menuLinks = document.querySelectorAll('.menu a');
const path = window.location.pathname;
let currentPage = "";

for (let i = path.length - 1; i >= 0; i--) {
    if (path[i] === '/' || path[i] === '\\') {
        break;
    }
    currentPage = path[i] + currentPage;
}

menuLinks.forEach(function(link) {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'main.html')) {
        link.classList.add('menu-active-link');
    }
});

const posts = document.querySelectorAll('article.post-item');

for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const replyBtn = post.querySelector('.reply-btn');
    const answerLink = post.querySelector('.answer-1');
    const commentsSection = post.querySelector('.full');

    if (replyBtn && commentsSection) {
        replyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            commentsSection.classList.toggle('open');
        });
    }

    if (answerLink && commentsSection) {
        answerLink.addEventListener('click', function(e) {
            e.preventDefault();
            commentsSection.classList.toggle('open');
        });
    }
}

const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', function() {
    if (backToTopBtn) {
        const halfScreenHeight = window.innerHeight / 2;
        if (window.scrollY > halfScreenHeight) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
});

const discussionPosts = document.querySelectorAll('article.post-item');
const pageKey = currentPage === "" ? "main.html" : currentPage;

discussionPosts.forEach(function(currentPost, i) {
    const prepBox = currentPost.querySelector('.preparation');
    const inputBox = currentPost.querySelector('.comment-input-box');
    
    if (prepBox && inputBox) {
        const inputField = inputBox.querySelector('.reply-input');
        const storageKey = 'comments_' + pageKey + '_post_' + i;
        
        const savedComments = safeJSONParse(storageKey) || [];
        
        savedComments.forEach(function(commentItem) {
            // Якщо це старий коментар (просто текст), ставимо час "Раніше"
            if (typeof commentItem === 'string') {
                createCommentBox(commentItem, "Раніше", prepBox, inputBox);
            } else {
                // Якщо це новий об'єкт, дістаємо і текст, і збережений час
                createCommentBox(commentItem.text, commentItem.time, prepBox, inputBox);
            }
        });

        if (inputField) {
            inputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    const text = this.value.trim();
                    
                    // Створюємо дату і час
                    const now = new Date();
                    
                    // Додаємо нуль попереду, якщо число менше 10 (наприклад, 05 замість 5)
                    const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
                    const m = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
                    const y = now.getFullYear();
                    const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
                    const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
                    
                    // Склеюємо у формат "20.05.2026 14:30"
                    const timeString = d + '.' + m + '.' + y + ' ' + h + ':' + min;

                    createCommentBox(text, timeString, prepBox, inputBox);
                    this.value = '';
                    
                    // Зберігаємо новий коментар як об'єкт
                    savedComments.push({ text: text, time: timeString });
                    localStorage.setItem(storageKey, JSON.stringify(savedComments));
                }
            });
        }
    }
});

// Функція тепер приймає параметр timeString
function createCommentBox(text, timeString, prepBox, inputBox) {
    const userData = safeJSONParse('currentUser');
    let userName = "Ви";
    let userDevice = "Гість";

    if (userData) {
        if (userData.nickname) userName = userData.nickname;
        if (userData.device) userDevice = userData.device;
    }

    const newComment = document.createElement('div');
    newComment.className = 'post-item';
    
    // Вставляємо змінну timeString туди, де раніше було жорстке слово "Щойно"
    newComment.innerHTML = '<div class="start-prep"><img class="svg" src="Group 4.svg" alt="Аватар"><div class="user"><h3 class="name-1">' + userName + '</h3><h3 class="device-1">' + userDevice + '</h3></div></div><div class="content"><time class="time-pre">' + timeString + '</time><p class="content-1">' + text + '</p><div class="answers"><button class="reply-btn">↩</button></div></div>';
    
    prepBox.insertBefore(newComment, inputBox);
}

const authForm = document.querySelector('.auth-form');

if (authForm) {
    const inputs = authForm.querySelectorAll('.form-input');
    
    if (currentPage === 'account.html') {
        const userData = safeJSONParse('currentUser');
        if (userData) {
            if (userData.nickname) inputs[0].value = userData.nickname;
            if (userData.email) inputs[1].value = userData.email;
        }
    }

    authForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        if (currentPage === 'reg.html') {
            const userData = {
                nickname: inputs[0].value,
                email: inputs[1].value,
                device: inputs[2].value,
                password: inputs[3].value
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = 'account.html';

        } else if (currentPage === 'login.html') {
            const userData = safeJSONParse('currentUser') || {};
            
            userData.email = inputs[0].value;
            if (!userData.nickname) userData.nickname = "Користувач";
            if (!userData.device) userData.device = "Невідомий пристрій";
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = 'account.html';

        } else if (currentPage === 'account.html') {
            const userData = safeJSONParse('currentUser') || {};
            
            userData.nickname = inputs[0].value;
            userData.email = inputs[1].value;
            
            if (inputs[2].value !== "" && inputs[2].value === inputs[3].value) {
                userData.password = inputs[2].value;
            }
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            alert('Дані успішно оновлено!');
            
            inputs[2].value = "";
            inputs[3].value = "";
            window.location.reload(); 
        }
    });
}