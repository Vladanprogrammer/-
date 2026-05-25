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
                    <p class="reg" style="bottom: 5px; right: 20px;">${currentUser.device}</p>
                </div>
                <div class="bottom-ghost">
                    <button class="privat">Особисті повідомлення</button>
                    <button class="setting-ac" onclick="window.location.href='settings.html'">Налаштування акаунта</button>
                </div>
            `;

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'login.html'; 
                });
            }
        }
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.account-trigger')) {
            if (logoDeparting) {
                logoDeparting.classList.toggle('active');
            }
        }
    });
});

const menu = document.querySelector('.menu');
const hamburgers = document.querySelectorAll('.hamburger');

if (hamburgers.length > 0) {
    hamburgers.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if(menu) menu.classList.toggle('active');
        });
    });
}

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
    const replyBtn = currentPost.querySelector('.reply-btn');
    const answerLink = currentPost.querySelector('.answer-1');
    const commentsSection = currentPost.querySelector('.full');

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
    let userName = "Гість";
    let userDevice = "Невідомий пристрій";

    if (userData) {
        if (userData.nickname) userName = userData.nickname;
        if (userData.device) userDevice = userData.device;
    }

    const newComment = document.createElement('div');
    newComment.className = 'post-item';
    
    newComment.innerHTML = `<div class="start-prep"><img class="svg account-trigger" src="Group 4.svg" alt=""><div class="user"><h3 class="name-1">${userName}</h3><h3 class="device-1">${userDevice}</h3></div></div><div class="content"><time class="time-pre">${timeString}</time><p class="content-1">${text}</p><div class="answers"><button class="reply-btn">↩</button></div></div>`;
    
    prepBox.insertBefore(newComment, inputBox);
}