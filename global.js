const menu = document.querySelector('.menu');
const hamburgers = document.querySelectorAll('.hamburger');

hamburgers.forEach(function(btn) {
    btn.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
});

const rightMenu = document.querySelector('.logo-departing');
const accountButtons = document.querySelectorAll('.account-trigger');

accountButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        rightMenu.classList.toggle('active');
    });
});

const menuLinks = document.querySelectorAll('.menu a');
const path = window.location.pathname;
let currentPage = "";

for (let i = path.length - 1; i >= 0; i--) {
    if (path[i] === '/') {
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
            if (commentsSection.classList.contains('open')) {
                commentsSection.classList.remove('open');
            } else {
                commentsSection.classList.add('open');
            }
        });
    }

    if (answerLink && commentsSection) {
        answerLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (commentsSection.classList.contains('open')) {
                commentsSection.classList.remove('open');
            } else {
                commentsSection.classList.add('open');
            }
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
        
        const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        savedComments.forEach(function(text) {
            createCommentBox(text, prepBox, inputBox);
        });

        if (inputField) {
            inputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    const text = this.value.trim();
                    createCommentBox(text, prepBox, inputBox);
                    this.value = '';
                    
                    savedComments.push(text);
                    localStorage.setItem(storageKey, JSON.stringify(savedComments));
                }
            });
        }
    }
});

function createCommentBox(text, prepBox, inputBox) {
    const newComment = document.createElement('div');
    newComment.className = 'post-item';
    newComment.innerHTML = '<div class="start-prep"><img class="svg" src="Group 4.svg" alt="Аватар"><div class="user"><h3 class="name-1">Ви</h3><h3 class="device-1">Гість</h3></div></div><div class="content"><time class="time-pre">Щойно</time><p class="content-1">' + text + '</p><div class="answers"><button class="reply-btn">↩</button></div></div>';
    
    prepBox.insertBefore(newComment, inputBox);
}

const authForm = document.querySelector('.auth-form');

if (authForm) {
    const inputs = authForm.querySelectorAll('.form-input');
    const submitBtn = authForm.querySelector('.auth-submit-btn');
    const btnText = submitBtn.textContent.trim();

    if (btnText === 'Створити акаунт') {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userData = {
                nickname: inputs[0].value,
                email: inputs[1].value,
                device: inputs[2].value,
                password: inputs[3].value
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = 'account.html';
        });
    }

    if (btnText === 'Увійти') {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const savedData = localStorage.getItem('currentUser');
            if (savedData) {
                const userData = JSON.parse(savedData);
                userData.email = inputs[0].value;
                localStorage.setItem('currentUser', JSON.stringify(userData));
            } else {
                const newUserData = {
                    nickname: "Користувач",
                    email: inputs[0].value,
                    device: "Невідомо",
                    password: inputs[1].value
                };
                localStorage.setItem('currentUser', JSON.stringify(newUserData));
            }
            window.location.href = 'account.html';
        });
    }

    if (btnText === 'Зберегти зміни') {
        const savedData = localStorage.getItem('currentUser');
        if (savedData) {
            const userData = JSON.parse(savedData);
            if (userData.nickname) {
                inputs[0].value = userData.nickname;
            }
            if (userData.email) {
                inputs[1].value = userData.email;
            }
        }

        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let userData = {};
            if (savedData) {
                userData = JSON.parse(savedData);
            }
            
            userData.nickname = inputs[0].value;
            userData.email = inputs[1].value;
            
            if (inputs[2].value !== "" && inputs[2].value === inputs[3].value) {
                userData.password = inputs[2].value;
            }
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            alert('Дані успішно оновлено');
            inputs[2].value = "";
            inputs[3].value = "";
        });
    }
}