(async () => {
    const content = document.querySelector('.content .section');

    const thesis = await fetchThesis('/data/thesis.json');

    if(thesis === null) {
        content.appendChild(getErrorMessage());
        return;
    }

    const thesisByYear = getThesisByYear(thesis.map(it => {
        it.title = contentTranslateTransformer(it.title);
        it.author = contentTranslateTransformer(it.author);
        return it;
    }));

    const sortedYears = thesisByYear.years.sort((a, b) => b - a);
    createYearLinkList(sortedYears);

    for(const year of sortedYears) {
        appendThesisSection(year, thesisByYear[year]);
    }


    for(const a of document.querySelectorAll('.title a.button')) {
        a.onclick = () => {
            document.querySelector('main').scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    function createYearLinkList(years) {
        const breadcrumb = document.querySelector('.breadcrumb ul');
        breadcrumb.innerHTML = years.map(year => `<li><a>${year}</a></li>`).join('');
        const links = breadcrumb.querySelectorAll('.breadcrumb a');
        for(const a of links) {
            const target = a.innerText;
            a.onclick = () => {
                document.getElementById(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        }
    }

    /**
     * @param {Thesis[]} thesis
     */
    function getThesisByYear(thesis) {
        let data = { years: [] };
        thesis.forEach(it => {
            if(!data.years.includes(it.year)) {
                data.years.push(it.year);
                data[it.year] = [];
            }
            data[it.year].push(it);
        });
        return data;
    }

    /**
     * @param {string} title
     * @param {Thesis[]} thesis
     */
    function appendThesisSection(title, thesis) {
        const h1 = document.createElement('h1');
        h1.classList.add('title');
        h1.innerHTML = `
            <span>${title}</span>
            <a class="button is-ghost is-float-right" style="text-decoration: none" title="${tr('public.backtotop')}">
                <span class="icon"><i class="fa-solid fa-chevron-circle-up"></i></span>
            </a>
        `;
        h1.id = title;
        content.appendChild(h1);
        const container = document.createElement('div');
        container.classList.add('container', 'is-fluid');
        content.appendChild(container);

        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');
        container.appendChild(tableContainer);

        const table = document.createElement('table');
        table.classList.add('table', 'is-hoverable', 'is-fullwidth', 'is-striped');
        table.style.cursor = 'default';
        table.innerHTML = `<colgroup>
            <col style="min-width: 300px;">
            <col style="width: 20%; min-width: 100px;">
            <col style="width: 60px; min-width: 60px;">
            <col style="width: 60px; min-width: 60px;">
        </colgroup>
        <thead>
            <tr>${['title', 'author', 'year', 'link']
                .map(it => `<th>${tr('thesis.' + it)}</th>`)
                .join('')}</tr>
        </thead>
        <tbody>
            ${thesis.map(it => 
                [it.title, it.author, it.year, it.link ? 
                    `<a class="button is-ghost" style="text-decoration: none;" href="${it.link}" target="_blank"><span class="icon"><i class="fa fa-link"></i></span></a>` : '']
                    .map((it, i) => `<td class="${i > 1 ? 'has-text-centered' : ''}" style="vertical-align: middle;">${it}</td>`).join(''))
                .map(it => `<tr>${it}</tr>`).join('')}
        </tbody>`;
        tableContainer.appendChild(table);
    }

    async function fetchThesis(url) {
        try {
            const f = await fetch(url);
            if(f.ok) {
                return await f.json();
            }
            else {
                return null
            }
        }
        catch(e) {
            console.error(e);
            return null;
        }
    }

})();

/**
 * @class Thesis
 * @property {TranslatableObject} title
 * @property {TranslatableObject} author
 * @property {string} link
 * @property {number} year
 */