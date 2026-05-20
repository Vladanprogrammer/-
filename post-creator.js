const plusBtn = document.querySelector('.plus');
const createPostBox = document.querySelector('.create-post-box');
const publishPostBtn = document.querySelector('.publish-post-btn');
const newPostInput = document.querySelector('.new-post-input');
const discussionsList = document.querySelector('.discussions-list');

if (plusBtn && createPostBox) {
    plusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        createPostBox.classList.toggle('show');
    });
}

const pageKeyForCustom = typeof currentPage !== 'undefined' ? currentPage : "unknown_page";
const postsStorageKey = 'created_posts_' + pageKeyForCustom;
const savedCustomPosts = (typeof safeJSONParse === 'function' ? safeJSONParse(postsStorageKey) : JSON.parse(localStorage.getItem(postsStorageKey))) || [];

if (discussionsList) {
    savedCustomPosts.forEach(function(postData, index) {
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
                <time>${postData.time}</time>
                <p class="content-1">${postData.text}</p>
                <div class="answers">
                    <button class="reply-btn">Відповідей:0</button>
                    <a href="#" class="answer-1">Відповісти</a>
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
        
        discussionsList.insertBefore(newArticle, discussionsList.firstChild);

        const replyBtn = newArticle.querySelector('.reply-btn');
        const answerLink = newArticle.querySelector('.answer-1');
        const commentsSection = newArticle.querySelector('.full');

        if (replyBtn) {
            replyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                commentsSection.classList.toggle('open');
            });
        }

        if (answerLink) {
            answerLink.addEventListener('click', function(e) {
                e.preventDefault();
                commentsSection.classList.toggle('open');
            });
        }

        const prepBox = newArticle.querySelector('.preparation');
        const inputBox = newArticle.querySelector('.comment-input-box');
        const inputField = newArticle.querySelector('.reply-input');
        const commentsStorageKey = 'comments_' + pageKeyForCustom + '_custom_post_' + index;
        
        const savedComments = (typeof safeJSONParse === 'function' ? safeJSONParse(commentsStorageKey) : JSON.parse(localStorage.getItem(commentsStorageKey))) || [];
        
        savedComments.forEach(function(commentItem) {
            let text = typeof commentItem === 'string' ? commentItem : commentItem.text;
            let time = typeof commentItem === 'string' ? "Раніше" : commentItem.time;
            createCustomCommentBox(text, time, prepBox, inputBox);
        });

        if (replyBtn && savedComments.length > 0) {
            replyBtn.innerText = 'Відповідей:' + savedComments.length;
        }

        if (inputField) {
            inputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && this.value.trim() !== '') {
                    const text = this.value.trim();
                    
                    const now = new Date();
                    const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
                    const m = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
                    const y = now.getFullYear();
                    const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
                    const min = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
                    const timeString = d + '.' + m + '.' + y + ' ' + h + ':' + min;

                    createCustomCommentBox(text, timeString, prepBox, inputBox);
                    this.value = '';
                    
                    savedComments.push({ text: text, time: timeString });
                    localStorage.setItem(commentsStorageKey, JSON.stringify(savedComments));

                    if (replyBtn) {
                        replyBtn.innerText = 'Відповідей:' + savedComments.length;
                    }
                }
            });
        }
    });
}

function createCustomCommentBox(text, timeString, prepBox, inputBox) {
    const userData = typeof safeJSONParse === 'function' ? safeJSONParse('currentUser') : null;
    let userName = "Ви";
    let userDevice = "Гість";

    if (userData) {
        if (userData.nickname) userName = userData.nickname;
        if (userData.device) userDevice = userData.device;
    }

    const newComment = document.createElement('div');
    newComment.className = 'post-item';
    
    newComment.innerHTML = '<div class="start-prep"><img class="svg" src="Group 4.svg" alt="Аватар"><div class="user"><h3 class="name-1">' + userName + '</h3><h3 class="device-1">' + userDevice + '</h3></div></div><div class="content"><time class="time-pre">' + timeString + '</time><p class="content-1">' + text + '</p><div class="answers"><button class="reply-btn">↩</button></div></div>';
    
    prepBox.insertBefore(newComment, inputBox);
}

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
            const timeString = d + '.' + m + '.' + y;

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