const plusBtn = document.querySelector('.plus');
const createPostBox = document.querySelector('.create-post-box');
const publishPostBtn = document.querySelector('.publish-post-btn');
const newPostInput = document.querySelector('.new-post-input');
const discussionsList = document.querySelector('.discussions-list');

// 1. Відкриваємо/ховаємо поле для створення поста
if (plusBtn && createPostBox) {
    plusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        createPostBox.classList.toggle('show');
    });
}

// 2. Завантаження збережених постів прямо всередину списку обговорень
const postsStorageKey = 'created_posts_' + (typeof currentPage !== 'undefined' ? currentPage : "unknown_page");
const savedCustomPosts = (typeof safeJSONParse === 'function' ? safeJSONParse(postsStorageKey) : JSON.parse(localStorage.getItem(postsStorageKey))) || [];

if (discussionsList) {
    // Проходимо по масиву і додаємо пости так, щоб найновіший ставав на самий початок
    savedCustomPosts.forEach(function(postData) {
        const newArticle = document.createElement('article');
        newArticle.className = 'post-item custom-created-post';
        
        newArticle.innerHTML = `
            <div class="start">
                <img class="svg" src="Group 4.svg" alt="Аватар">
                <div class="user">
                    <h3 class="name-1">${postData.author}</h3>
                    <h3 class="device-1">${postData.device}</h3>
                </div>
            </div>
            <div class="content">
                <time class="time-pre">${postData.time}</time>
                <p class="content-1">${postData.text}</p>
                <div class="answers">
                    <button class="reply-btn">↩</button>
                </div>
            </div>
            <div class="full">
                <div class="preparation">
                    <div class="comment-input-box">
                        <input type="text" class="reply-input form-input" placeholder="Написати відповідь...">
                    </div>
                </div>
            </div>
        `;
        
        // Вставляємо пост на самий початок контейнера .discussions-list
        discussionsList.insertBefore(newArticle, discussionsList.firstChild);
    });
}

// 3. Публікація нового поста
if (publishPostBtn && newPostInput) {
    publishPostBtn.addEventListener('click', function() {
        const text = newPostInput.value.trim();
        
        if (text !== '') {
            const userData = typeof safeJSONParse === 'function' ? safeJSONParse('currentUser') : null;
            let userName = "Ви";
            let userDevice = "Гість";

            if (userData) {
                if (userData.nickname) userName = userData.nickname;
                if (userData.device) userDevice = userData.device;
            }

            const now = new Date();
            const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
            const m = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            const y = now.getFullYear();
            const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
            const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
            const timeString = d + '.' + m + '.' + y + ' ' + h + ':' + min;

            const newPost = {
                text: text,
                time: timeString,
                author: userName,
                device: userDevice
            };

            savedCustomPosts.push(newPost);
            localStorage.setItem(postsStorageKey, JSON.stringify(savedCustomPosts));

            window.location.reload();
        }
    });
}