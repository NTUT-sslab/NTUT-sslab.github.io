(async () => {
    const defaultSkeletonCount = 6;
    const list = document.getElementById('research-list');
    placeSkeletons(list, defaultSkeletonCount);

    const researchesOrProjects = await fetchResearch('/data/research/research.json');
    /**
     * @type {{research: Research[], project: Project[]}}
     */
    let data = {
        research: [],
        project: []
    };
    if(researchesOrProjects !== null) {
        researchesOrProjects.forEach(it => {
            it.title = contentTranslateTransformer(it.title);
            if(it.type === 'research') {
                it.researcher = it.researcher.map(it => contentTranslateTransformer(it));
            }
            else if(it.type === 'project') {}
            data[it.type].push(it);
        });
    }
    placeResearchesOrProjects([].concat(data.research).concat(data.project));

    const detailModal = document.querySelector('.modal');
    detailModal.querySelector('.delete').onclick = () => {
        detailModal.classList.remove('is-active');
    };
    detailModal.querySelector('.modal-background').onclick = () => {
        detailModal.classList.remove('is-active');
    };

    /**
     * Place the skeletons to the container
     * @param container
     * @param count
     */
    function placeSkeletons(container, count) {
        container.innerHTML = '';
        container.append(...getSkeletons(count, ['is-full-mobile', 'is-full-tablet', 'is-half-desktop', 'is-one-third-widescreen']));
    }

    /**
     * @param {(Research|Project)[]} researchesOrProjects
     */
    function placeResearchesOrProjects(researchesOrProjects) {
        const list = document.getElementById('research-list');
        list.innerHTML = '';

        researchesOrProjects.forEach(it => {
            if(it.type === 'research') {
                list.appendChild(createResearch(it));
            }
            else if (it.type === 'project') {
                list.appendChild(createProject(it));
            }
        });
        const allAbs = document.querySelectorAll('a[abstract]');
        for(const abs of allAbs) {
            const id = abs.getAttribute('abstract');
            const title = abs.getAttribute('title');
            abs.onclick = () => openAbstract(title, id);
            abs.removeAttribute('href');
            abs.removeAttribute('target');
            abs.removeAttribute('abstract');
            abs.removeAttribute('title');
        }
    }

    /**
     * @param {Research} research
     * @returns {HTMLDivElement}
     */
    function createResearch(research) {
        const column = document.createElement('div');
        column.classList.add('column', 'is-full-mobile', 'is-full-tablet', 'is-half-desktop', 'is-half-widescreen', 'is-half-fullhd');
        let footer = [];
        if(research.link) {
            footer.push({ text: 'Link', icon: ['fas',  'fa-link'], link: research.link });
        }
        if(research.abstractId) {
            footer.push({ text: tr('research.abstract'), link: '#', tooltip: research.title, icon: ['fa-regular', 'fa-newspaper'],
                extra: new Map([['abstract', research.abstractId]]) });
        }
        let content = [{ data: tr('research.researcher'), tailColons: true }];
        research.researcher.forEach((it, i) => {
            if(i === 0) {
                content.push({ data: it, textPosition: 'right' });
            }
            else {
                content.push({ data: it, textPosition: 'right', span: 2 });
            }
        });
        column.appendChild(createInformationCard(null, research.title, content, footer));
        return column;
    }

    function createProject(project) {
        const column = document.createElement('div');
        column.classList.add('column', 'is-full-mobile', 'is-full-tablet', 'is-half-desktop', 'is-half-widescreen', 'is-half-fullhd');
        let footer = [];
        footer.push(project.link ? { text: 'Link', icon: ['fas',  'fa-link'], link: project.link } : {});
        column.appendChild(createInformationCard(null, project.title, [], footer));
        return column;
    }

    /**
     * @param url
     * @returns {Promise<(Research|Project)[]|null>}
     */
    async function fetchResearch(url) {
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

    function loadingHtml() {
        return `<div class="control is-loading">
            <input class="input" style="cursor: default" disabled value="Loading...">
        </div>`;
    }

    function openAbstract(title, id) {
        openModal(c => {
            fetch(`/data/research/abstract/${id}.txt`).then(res => res.text()).then(text => {
                c(title, text.split(/\n|\r\n|\r/g).join('<br>'));
            });
        })
    }

    /**
     * @param {Function} run
     */
    function openModal(run) {
        const msgTitle = detailModal.querySelector('.message-header > span');
        msgTitle.innerText = 'Loading';
        const msgContent = detailModal.querySelector('.message-body');
        msgContent.innerHTML = loadingHtml();
        detailModal.classList.add('is-active');

        run((title, content) => {
            msgTitle.innerText = title;
            msgContent.innerHTML = content;
        });
    }

})();

/**
 * @class Research
 * @property {TranslatableObject} title the title of the research or in different language
 * @property {string} type the type, either research or project
 * @property {(TranslatableObject)[]} researcher the researcher of the research or in different language
 * @property {string|undefined} link the link to the research
 * @property {string|undefined} abstractId the id link to the abstract
 */

/**
 * @class Project
 * @property {TranslatableObject} title the title of the project or in different language
 * @property {string} type the type, either research or project
 * @property {string|undefined} link the link to the project or website
 */