(async () => {
    const newsCount = 5;
    const autoScrollNewsTime = 10 * 1000;
    const n = document.getElementById('news');
    let currentNews = 0;
    let scrollNewsTimer = null;
    n.onwheel = e => {
        e.preventDefault();
        if (e.deltaY >= -15 && e.deltaY <= 15) {
            n.scrollLeft += (e.deltaY * 40);
        }
        else {
            n.scrollLeft += (e.deltaY * 5);
        }
    };
    n.onscrollend = () => {
        refreshNewsDots();
        clearTimeout(scrollNewsTimer);
        startAutoScrollNews();
    };
    await putNews();
    prepareNewsDots();
    refreshNewsDots();
    startAutoScrollNews();

    const introduction = document.getElementById('introduction');

    const data = await fetch(`data/i18n/${lang}/introduction.txt`);
    introduction.innerHTML += rawToHtml(await data.text());

    function rawToHtml(raw) {
        const sec = raw.split(/[\n\r]+/g);
        return sec.map(it => `<p>${it}</p>`).join('');
    }

    async function putNews() {
        const news = await fetch('/data/news.json').then(it => it.json());
        news.sort((a, b) => a.date < b.date ? -1 : 1);
        news.length = Math.min(news.length, newsCount);
        const newsElement = document.getElementById('news');
        newsElement.innerHTML = news.map(it => {
            return `<div class="">
                <img src="${it.image}" alt="${it.alt ? contentTranslateTransformer(it.alt) : ''}"
                    ${it.title ? `title="${contentTranslateTransformer(it.title)}"` : ''}></div>`;
        }).join('');
    }

    function prepareNewsDots() {
        const dots = document.querySelector('.news-container .dots');
        const d = '<div class="dot"></div>';
        dots.innerHTML = d.repeat(n.children.length);
        document.querySelectorAll('.news-container .dots .dot').forEach((it, idx) => {
            it.onclick = () => {
                scrollNews(idx);
            }
        });
    }

    function refreshNewsDots() {
        const threshold = 10;
        const scroll = n.scrollLeft;
        let dot = 0;
        for (let i in n.children) {
            if (scroll <= n.children[i].offsetLeft - threshold) {
                dot = +i;
                break;
            }
        }
        document.querySelectorAll('.news-container .dots .dot').forEach((it, idx) => {
            if (idx === dot) {
                it.innerHTML = `<i class="fas fa-circle"></i>`;
                currentNews = idx;
            }
            else {
                it.innerHTML = `<i class="far fa-circle"></i>`;
            }
        });
    }

    function scrollNews(idx) {
        function wrap(num, count) {
            return num % count
        }
        const actualIndex = wrap(idx, n.children.length);
        n.scrollLeft = n.children[actualIndex].offsetLeft;
    }

    function startAutoScrollNews() {
        scrollNewsTimer = setTimeout(autoScrollNews, autoScrollNewsTime);
    }

    function autoScrollNews() {
        scrollNews(currentNews + 1);
        startAutoScrollNews();
    }

})();