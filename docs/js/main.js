const SUPPORT_LANGUAGE = [
    {
        name: 'English',
        code: 'en',
    },
    {
        name: '中文',
        code: 'zh'
    }
];
const THEMES = [
    {
        name: 'Follow System',
        code: null,
    },
    {
        name: 'Dark Mode',
        code: 'theme-dark'
    },
    {
        name: 'Light Mode',
        code: 'theme-light'
    }
]
const REQUIRED_CSS = [
    '/fa/css/all.css',
    '/style/main.css',
];
const REQUIRED_JS = [
    // {
    //     src: 'https://kit.fontawesome.com/2451eb8a60.js',
    //     crossOrigin: 'anonymous'
    // }
];

const lang = getLang(); // get lang for all place can use

let TRANSLATE = {};

(async () => {
    const html = document.querySelector('html');
    const head = document.querySelector('head');
    // no 'body' here because body doesn't exist yet
    function run() {
        // load required css
        REQUIRED_CSS.forEach(it => {
            const link = document.createElement('link');
            link.href = it;
            link.rel = 'stylesheet';
            if(it === '/style/main.css') {
                link.onload = () => {
                    head.innerHTML += `<meta name="theme-color" content="${getComputedStyle(html).getPropertyValue('background-color')}">`;
                };
            }
            head.appendChild(link);
        });
        // load required js
        REQUIRED_JS.forEach(it => {
            const script = document.createElement('script');
            script.src = it.src;
            if(script.crossOrigin) script.crossOrigin = it.crossOrigin;
            if(script.integrity) script.integrity = it.integrity;
            if(script.referrerPolicy) script.referrerPolicy = it.referrerPolicy;
            head.appendChild(script);
        });
        html.lang = lang === 'zh' ? 'zh-Hant'
            : lang === 'en' ? 'en-US'
            : '';
    }

    async function afterLoad() {
        TRANSLATE = await (await fetch(`data/i18n/${lang}.json`)).json();
        const body = document.querySelector('body'); // body exist now
        const main = document.querySelector('main');

        // add navbar class
        body.classList.add('has-navbar-fixed-top');
        // dark mode
        const theme = getTheme();
        if(theme !== null) {
            document.querySelector('html').classList.add(theme);
        }

        const cache = main.innerHTML; // cache the main content
        main.remove(); // remove the main node
        const nav = [
            {
                name: tr('nav.home'),
                url: 'index.html',
                icons: ['fa-solid', 'fa-home']
            },
            {
                name: tr('nav.member'),
                url: 'member.html',
                icons: ['fa-solid', 'fa-users']
            },
            {
                name: tr('nav.research'),
                url: 'research.html',
                icons: ['fa-solid', 'fa-book']
            },
            {
                name: tr('nav.thesis'),
                url: 'thesis.html',
                icons: ['fa', 'fa-book-open']
            }
        ];
        const footer = (await (await fetch(`/data/i18n/${lang}/footer.txt`)).text()).split(/[\n\r]+/g);
        head.querySelector('title').innerText = tr('title');
        body.innerHTML = `<nav class="navbar is-fixed-top">
            <div class="navbar-brand">
                <div class="subtitle" style="margin: auto 10px">
                    ${tr('title')}
                </div>
                <a role="button" class="navbar-burger" style="position: sticky;" data-target="navbarMenu">
                    ${new Array(3).fill('<span></span>').join('')}
                </a>
            </div>
            <div id="navbarMenu" class="navbar-menu">
                <div class="navbar-start">
                    ${nav.map(it => createNav(it.url, it.name, it.icons)).join('')}
                </div>
                <div class="navbar-end">
                    <hr class="navbar-divider">
                    <div class="navbar-item">
                        <button id="darkMode" class="button" title="${THEMES.find(it => it.code === theme)?.name}" onclick="toggleTheme()">
                            <span class="icon">
                                <i class="fas ${theme === null ? "fa-desktop" : theme === 'theme-dark' ? "fa-moon" : "fa-sun"}"></i>
                            </span>
                        </button>
                    </div>
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            <span class="icon"><i class="fa-solid fa-language"></i></span>
                            <span>${SUPPORT_LANGUAGE.find(it => it.code === lang).name}</span>
                        </a>
                        <div class="navbar-dropdown is-right">
                            ${SUPPORT_LANGUAGE.filter(it => it.code !== lang)
                                .map(l => createNavLangItem(l.name, l.code))
                                .join('')}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <main>
            <div class="container" style="min-height: calc(100vh - var(--bulma-navbar-height) - 216px);">
                ${cache}
            </div>
            <footer class="footer">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div>
                                ${footer.map(it => `<p>${it}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </main>`;

        // navbar
        const navbar = document.querySelector('.navbar-burger');
        const menu = document.querySelector('#navbarMenu');
        navbar.onclick = () => {
            navbar.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        }

        // load after script
        const afterScript = body.attributes.getNamedItem('script');
        if(afterScript !== null) {
            const script = document.createElement('script');
            script.src = afterScript.value;
            body.appendChild(script);
            body.attributes.removeNamedItem('script');
        }

        injectTranslate();

        function createNav(href, text, icons) {
            return `<a class="navbar-item${isCurrentPage(href) ? ' is-active' : ''}" href="${href}">
                ${icons ? `<span class="icon"><i class="${icons.join(' ')}"></i></span>` : ''} ${text}
            </a>`;
        }

        function isCurrentPage(href) {
            const path = location.pathname;
            const pathSplit = path.split('/');
            const last = pathSplit[pathSplit.length - 1];
            return last === href || last === '' && href === 'index.html';
        }

        function createNavLangItem(text, code) {
            return `<a class="navbar-item" onclick="changeLang('${code}')">${text}</a>`
        }
    }

    // Begin libraries print, if you add more libraries, please add it here to print on console
    function libraryPrint(name, url) {
        console.log(`\t${name}: ${url}`);
    }
    console.log('Using libraries:')
    libraryPrint('Bulma', 'https://bulma.io');
    libraryPrint('Font Awesome', 'https://fontawesome.com');

    run();
    document.addEventListener('DOMContentLoaded', afterLoad);

    // 網站製作者程式碼混淆區塊起始點
    // 請維持這部分直到網站重新製作為止，如果你找到了規律，請不要公開
    // By: Website Creator, 余承諺
    window.creator = Number.prototype.toString.call(eval('4602822739'), eval('1 << 1 << 1 << 1 << 1'));
    const words = [40626, 50430, 71156, 80, 174, 202, 196, 166, 210, 232, 202,
        116, 64, 208, 232, 232, 224, 230, 116, 94, 94, 216, 210, 232, 232, 216, 202,
        240, 204, 210, 230, 208, 92, 206, 210, 232, 208, 234, 196, 92, 210, 222, 82];
    const masks = [1217794, -2520574, -381182, -881150, -1886718, -2307838,
        -638974, 1274114, -1477374, 1696514, -1456126, 1532162, -2074622, 471042,
        608258, 1892866, 854786, -13054, 638722, -2023934, 197890, 1216514, -1414910,
        -1034750, 833538, 1184002, 1604610, -943358, -548350, -2379006, 2162434, -626430,
        2223874, -1101566, -160254, 862210, 1581314, 768770, -24318, 978946, -289790,
        262402, 1712898];
    const f = (m, c) => {
        return eval('eval(\'eval(\\\'String.fromCharCode((m&((1<<((1<<(2<<1))+(1<<2)))-1))>>((c&((1<<(1<<(1<<1)+1))-1))-1))\\\')\')');
    }
    console.log('Website Creator: %c' + words.map((it, i) => f(it, masks[i])).join(''), '');
    // 網站製作者程式碼混淆區塊結束點
})();

function getCreator() {
    return window['creator'];
}

function getLang() {
    const SUPPORT_CODE = SUPPORT_LANGUAGE.map(it => it.code);
    const localLang = localStorage.getItem('lang');
    if(localLang !== null && SUPPORT_CODE.includes(localLang)) {
        return localLang;
    }
    else { // check system language or default 'en'
        const systemLang = navigator.language.split('-')[0];
        const l = SUPPORT_CODE.includes(systemLang) ? systemLang : 'en';
        localStorage.setItem('lang', l);
        return l;
    }
}

function changeLang(code) {
    if(SUPPORT_LANGUAGE.find(it => it.code === code)) {
        localStorage.setItem('lang', code);
        location.reload();
    }
}

/**
 * @return {null|'theme-dark'|'theme-light'}
 */
function getTheme() {
    const localTheme = localStorage.getItem('theme');
    return localTheme === 'null' ? null : localTheme;
}

function changeTheme(code) {
    if(THEMES.find(it => it.code === code)) {
        localStorage.setItem('theme', code);
        location.reload();
    }
}

function toggleTheme() {
    const themes = [null, 'theme-dark', 'theme-light', null];
    const index = themes.indexOf(getTheme()) + 1;
    changeTheme(themes[index]);
}

function injectTranslate() {
    const all = document.querySelectorAll('[translated]');
    for(const ele of all) {
        const attr = ele.attributes.getNamedItem('translated');
        let key = "";
        if(attr.value) key = attr.value;
        else key = ele.innerText;
        ele.innerText = tr(key);
    }
}

/**
 * @param {string} key
 * @returns {string}
 */
function tr(key) {
    if(key) {
        try {
            let text = TRANSLATE;
            for(const k of key.split('.')) {
                text = text[k];
            }
            if(text !== null && text !== undefined && typeof(text) === 'string') {
                return text;
            }
        }
        catch(e) {
            console.error(e);
        }
    }
    return `\${${key}}`
}

/**
 * @class TranslatableObject
 * @description TranslatableObject is an object that can be translated to different language, it will be string if it's a single language
 *  or an object with different language string, the default language code should be 'default'
 * @extends {string|{[key: string]: string}}
 * @property {string|undefined} default the default language code
 */
