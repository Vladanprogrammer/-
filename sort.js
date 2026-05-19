const timeFilterBtn = document.getElementById('time-filter-btn');
const timePopup = document.getElementById('time-popup');
const filterOptions = document.querySelectorAll('.popup-list li');
const filterPosts = document.querySelectorAll('.discussions-list > .post-item');

if (timeFilterBtn && timePopup) {
    timeFilterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (timePopup.classList.contains('show')) {
            timePopup.classList.remove('show');
        } else {
            timePopup.classList.add('show');
        }
    });

    document.addEventListener('click', function(event) {
        if (!timePopup.contains(event.target) && event.target !== timeFilterBtn) {
            timePopup.classList.remove('show');
        }
    });
}

function parseCustomDate(dateStr) {
    let dayStr = "";
    let monthStr = "";
    let yearStr = "";
    let currentPart = 1;

    for (let i = 0; i < dateStr.length; i++) {
        let char = dateStr[i];
        
        if (char === " " || char === ",") {
            break;
        }
        
        if (char === ".") {
            currentPart++;
            continue;
        }

        if (currentPart === 1) {
            dayStr += char;
        } else if (currentPart === 2) {
            monthStr += char;
        } else if (currentPart === 3) {
            yearStr += char;
        }
    }

    const day = Number(dayStr);
    const month = Number(monthStr) - 1;
    const year = Number(yearStr);

    return new Date(year, month, day);
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const yesterday = new Date(today.getTime());
yesterday.setDate(yesterday.getDate() - 1);

const dayBeforeYesterday = new Date(today.getTime());
dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

if (filterOptions.length > 0 && timeFilterBtn && timePopup) {
    for (let i = 0; i < filterOptions.length; i++) {
        filterOptions[i].addEventListener('click', function() {
            const selectedText = this.innerText;
            timePopup.classList.remove('show');
            timeFilterBtn.innerText = selectedText;

            let targetTime = null;

            if (selectedText === "Сьогодні") {
                targetTime = today.getTime();
            } else if (selectedText === "Вчора") {
                targetTime = yesterday.getTime();
            } else if (selectedText === "Позавчора") {
                targetTime = dayBeforeYesterday.getTime();
            }

            for (let j = 0; j < filterPosts.length; j++) {
                const post = filterPosts[j];
                const timeElement = post.querySelector('time');
                
                if (timeElement) {
                    const postDate = parseCustomDate(timeElement.innerText);
                    const postTime = postDate.getTime();

                    if (targetTime === null) {
                        post.style.display = "flex";
                    } else if (postTime === targetTime) {
                        post.style.display = "flex";
                    } else {
                        post.style.display = "none";
                    }
                }
            }
        });
    }
}

const sortSelect = document.querySelector('.filter-select');
const listContainer = document.querySelector('.discussions-list');

function getAnswersCount(text) {
    let numberStr = "";
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            numberStr += text[i];
        }
    }
    if (numberStr === "") {
        return 0;
    }
    return Number(numberStr);
}

if (sortSelect && listContainer) {
    sortSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const postsNodes = document.querySelectorAll('.discussions-list > .post-item');
        const postsArray = [];

        for (let i = 0; i < postsNodes.length; i++) {
            postsArray[i] = postsNodes[i];
        }

        for (let i = 0; i < postsArray.length - 1; i++) {
            for (let j = 0; j < postsArray.length - 1 - i; j++) {
                const postA = postsArray[j];
                const postB = postsArray[j + 1];

                let shouldSwap = false;

                if (selectedValue === "За датою") {
                    const timeTextA = postA.querySelector('time').innerText;
                    const timeTextB = postB.querySelector('time').innerText;
                    const timeA = parseCustomDate(timeTextA);
                    const timeB = parseCustomDate(timeTextB);
                    if (timeA < timeB) {
                        shouldSwap = true;
                    }
                } else if (selectedValue === "За відповідями") {
                    const ansTextA = postA.querySelector('.reply-btn').innerText;
                    const ansTextB = postB.querySelector('.reply-btn').innerText;
                    const ansA = getAnswersCount(ansTextA);
                    const ansB = getAnswersCount(ansTextB);
                    if (ansA > ansB) {
                        shouldSwap = true;
                    }
                } else {
                    const ansTextA = postA.querySelector('.reply-btn').innerText;
                    const ansTextB = postB.querySelector('.reply-btn').innerText;
                    const ansA = getAnswersCount(ansTextA);
                    const ansB = getAnswersCount(ansTextB);
                    if (ansA < ansB) {
                        shouldSwap = true;
                    }
                }

                if (shouldSwap) {
                    const temp = postsArray[j];
                    postsArray[j] = postsArray[j + 1];
                    postsArray[j + 1] = temp;
                }
            }
        }

        for (let i = 0; i < postsArray.length; i++) {
            listContainer.appendChild(postsArray[i]);
        }
    });
}