
function getPlaceholder(width, height) {
    return `https://placehold.co/${width}x${height}?text=No+Image`;
}

/**
 * Place the skeletons to the container
 * @param {number} count
 * @param {string[]} additionClasses
 * @param {number} contentLines
 * @returns {HTMLDivElement[]}
 */
function getSkeletons(count = 9, additionClasses = [], contentLines = 3) {
    const singleSkeleton = document.createElement('div');
    singleSkeleton.classList.add('column', ...additionClasses);
    singleSkeleton.innerHTML = `<div class="card is-skeleton">
        <div class="card-header"><div class="card-header-title is-skeleton">fake</div></div>
        <div class="card-content">${new Array(contentLines).fill('<p>fake</p>').join('')}</div>
    </div>`;
    let ret = [];
    for(let i = 0; i < count; i++) {
        ret.push(singleSkeleton.cloneNode(true));
    }
    return ret;
}

function getErrorMessage(message = 'Failed to load data') {
    const article = document.createElement('article');
    article.classList.add('message', 'is-danger');
    article.innerHTML = `
        <div class="message-body">${message}</div>
    `;
    return article;
}

/**
 * @param {TranslatableObject|*} data
 * @returns {string}
 */
function contentTranslateTransformer(data) {
    if(data === null || data === undefined) {
        return '' + data;
    }
    if(typeof data === 'string') {
        return data.toString();
    }
    let content = data[lang];
    if(typeof content === 'string') {
        return content;
    }
    let def = data.default;
    if(typeof def === 'string') {
        return data[def];
    }
    else {
        for(let key in Object.keys(data)) {
            if(typeof (data[key]) === 'string') {
                return data[key];
            }
        }
        return '';
    }
}

/**
 * @class Info
 * @property {string|string[]} data
 * @property {number} span
 * @property {string} weight
 * @property {string} textPosition
 * @property {boolean} tailColons
 */

/**
 * @class Footer
 * @property {string[]} icon
 * @property {string} text
 * @property {string} link
 * @property {string} target default _blank
 * @property {string} tooltip
 * @property {Map} extra
 */

/**
 * @param {string} title
 * @param {Info[]} cellList
 * @param {Footer[]} footer
 * @param {string|undefined} banner
 * @param {string|undefined} bannerSize
 * @param {string|undefined} bannerAlt
 * @param {string|undefined} icon
 * @param {string|undefined} iconAlt
 */
function createInformationCard(id, title, cellList, footer, banner = undefined, bannerSize = undefined,
                               bannerAlt = undefined, icon = undefined, iconAlt = undefined) {
    const card = document.createElement('div');
    card.classList.add('card');
    if(id) card.id = id;
    card.draggable = true;

    if(banner) {
        card.innerHTML += `<div class="card-image">
            <figure class="image ${bannerSize}">
                <img src="${banner}" alt="${bannerAlt}">
            </figure>
        </div>`;
    }
    const iconHtml = icon ? `<figure class="image is-64x64 is-1by1">
        <img class="is-rounded has-background-grey" src="${icon}" alt="${iconAlt}">
    </figure>` : '';

    if(title || icon) {
        if(title) {
            card.innerHTML += `<div class="card-header">
                <div class="card-header-title">${iconHtml}<span ${icon ? 'class="ml-2"' : ''}>${title}</span></div>
            </div>`
        }
        else {
            card.innerHTML += `<div class="card-header">
                <div class="card-header-title">${iconHtml}</div>
            </div>`
        }
    }

    const content = cellList.map(it => {
        const span = it.span ? `is-col-span-${it.span}` : '';
        const weight = it.weight ? `font-weight: ${it.weight};` : '';
        const pos = it.textPosition ? `has-text-${it.textPosition}` : '';
        const tailColons = it.tailColons ? tr('colon') : '';
        return `<div class="cell ${span} ${pos}" style="${weight}">${it.data}${tailColons}</div>`
    });
    if(content.length > 0) {
        card.innerHTML += `<div class="card-content">
            <div class="fixed-grid has-2-cols">
                <div class="grid">${content.join('')}</div>
            </div>
        </div>`;
    }

    const footerHtml = footer.map(it => {
        return `<div class="card-footer-item">
            ${it.link ? `<a href="${it.link}" target="${it.target || '_blank'}" title="${it.tooltip || ''}"
                    class="button is-ghost no-decoration icon-text" ${it.extra ? [...it.extra.keys()]
                        .map(e => `${e}="${it.extra.get(e)}"`).join(' ') : ''}>` : ''}
                ${it.icon ? `<span class="icon"><i class="${it.icon.join(' ')}"></i></span>` : ''}
                ${it.text ? `<span>${it.text}</span>` : ''}
            ${it.link ? '</a>' : ''}
        </div>`;
    })

    if(footerHtml.length > 0) {
        card.innerHTML += `<div class="card-footer">${footerHtml.join('')}</div>`;
    }

    return card;
}

