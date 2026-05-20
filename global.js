if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

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

document.addEventListener('DOMContentLoaded', function() {
    const currentUserData = localStorage.getItem('currentUser');
    const logoDeparting = document.querySelector('.logo-departing');
    
    if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        
        if (logoDeparting) {
            logoDeparting.innerHTML = `
                <div class="top-ghost">
                    <button id="logout-btn" class="rain">Вийти з акаунта</button>
                    <img class="ghost-log account-trigger" src="Group 4.svg" alt="">
                    <p class="ghost">${currentUser.nickname}</p>
                    <p class="device-text">${currentUser.device}</p>
                </div>
                <div class="bottom-ghost">
                    <button class="privat">Особисті повідомлення</button>
                    <button class="setting-ac" onclick="window.location.href='settings.html'">Налаштування акаунта</button>
                </div>
            `;

            document.getElementById('logout-btn').addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.reload(); 
            });
        }
    }

    if (logoDeparting) {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('account-trigger')) {
                logoDeparting.classList.toggle('active');
            }
        });
    }
});

const menu = document.querySelector('.menu');
const hamburgers = document.querySelectorAll('.hamburger');

hamburgers.forEach(function(btn) {
    btn.addEventListener('click', function() {
        if(menu) menu.classList.toggle('active');
    });
});

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
            if (typeof commentItem === 'string') {
                createCommentBox(commentItem, "Раніше", prepBox, inputBox);
            } else {
                createCommentBox(commentItem.text, commentItem.time, prepBox, inputBox);
            }
        });

        if (inputField) {
            inputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    const text = this.value.trim();
                    const now = new Date();
                    const d = String(now.getDate()).padStart(2, '0');
                    const m = String(now.getMonth() + 1).padStart(2, '0');
                    const y = now.getFullYear();
                    const h = String(now.getHours()).padStart(2, '0');
                    const min = String(now.getMinutes()).padStart(2, '0');
                    const timeString = `${d}.${m}.${y} ${h}:${min}`;

                    createCommentBox(text, timeString, prepBox, inputBox);
                    this.value = '';
                    
                    savedComments.push({ text: text, time: timeString });
                    localStorage.setItem(storageKey, JSON.stringify(savedComments));
                }
            });
        }
    }
});

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
    
    newComment.innerHTML = `<div class="start-prep"><img class="svg account-trigger" src="Group 4.svg" alt=""><div class="user"><h3 class="name-1">${userName}</h3><h3 class="device-1">${userDevice}</h3></div></div><div class="content"><time class="time-pre">${timeString}</time><p class="content-1">${text}</p><div class="answers"><button class="reply-btn">↩</button></div></div>`;
    
    prepBox.insertBefore(newComment, inputBox);
}

const authForm = document.querySelector('.auth-form');

if (authForm) {
    const inputs = authForm.querySelectorAll('.form-input');
    
    if (currentPage === 'account.html') {
        const userData = safeJSONParse('currentUser');
        if (userData) {
            if (userData.nickname && inputs[0]) inputs[0].value = userData.nickname;
            if (userData.email && inputs[1]) inputs[1].value = userData.email;
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