(async () => {
    await placeAdvisor();
    const students = await fetchMember('/data/member/students.json');
    let sortByDegree = {
        undergraduate: [],
        master: [],
        phd: []
    }
    students.forEach(it => sortByDegree[it.degree].push(it));
    if(sortByDegree.phd.length > 0) placeMembers(tr('degree.phd'), sortByDegree.phd);
    if(sortByDegree.master.length > 0) placeMembers(tr('degree.master'), sortByDegree.master);
    if(sortByDegree.undergraduate.length > 0) placeMembers(tr('degree.undergraduate'), sortByDegree.undergraduate);
    const graduated = await fetchMember('/data/member/graduated.json');
    placeGraduated(graduated);

    document.querySelectorAll('.modal .delete').forEach(it => it.onclick = () => {
        document.querySelector('#paper-modal').classList.remove('is-active');
    });
    document.querySelectorAll('.modal .modal-background').forEach(it => it.onclick = () => {
        document.querySelector('.modal').classList.remove('is-active');
    });

    /**
     * @param {string} title
     * @param {Member[]|null} members
     */
    function placeMembers(title, members) {
        const memberContainer = document.getElementById('member');
        const container = document.createElement('div');
        container.classList.add('columns', 'is-multiline');
        if(memberContainer.children.length > 0) {
            memberContainer.appendChild(document.createElement('hr'));
        }
        const titleEle = document.createElement('h2');
        titleEle.classList.add('subtitle');
        titleEle.innerText = title;
        memberContainer.appendChild(titleEle);
        memberContainer.appendChild(container);

        if(!Array.isArray(members) && !members) {
            container.innerHTML = getErrorMessage().outerHTML;
        }
        else {
            container.innerHTML = '';
            members.forEach(it => {
                container.appendChild(createSingleMemberCard(it));
            });
        }
    }

    function placeGraduated(members) {
        const memberContainer = document.getElementById('member');
        const container = document.createElement('div');
        container.classList.add('columns', 'is-multiline');
        if(memberContainer.children.length > 0) {
            memberContainer.appendChild(document.createElement('hr'));
        }
        memberContainer.innerHTML += `<h2 class="subtitle">${tr('degree.graduated')}</h2>`;
        memberContainer.appendChild(container);

        if(!Array.isArray(members) && !members) {
            container.innerHTML = getErrorMessage().outerHTML;
        }
        else {
            container.innerHTML = '';
            members.forEach(it => {
                container.appendChild(createSingleMemberCard(it, true));
            });
        }
    }

    /**
     * @param {Member} member
     * @param {boolean} isGraduated
     * @returns {HTMLDivElement}
     */
    function createSingleMemberCard(member, isGraduated = false) {
        const column = document.createElement('div');
        column.classList.add('column', 'is-full-mobile', 'is-half-tablet', 'is-half-desktop', 'is-one-third-widescreen');
        if(member != null) {
            let cellData = [
                { data: tr(`department.${member.department}`), span: 2 },
                { data: tr('member.researchDirection'), weight: 'bold', tailColons: true },
                { data: member.researchDirection, textPosition: 'right'},
                { data: tr('member.interest'), weight: 'bold', tailColons: true },
                { data: member.interest, textPosition: 'right' },
                { data: tr('member.joinDate'), weight: 'bold', tailColons: true },
                { data: member.joinDate, textPosition: 'right' }
            ];
            if(isGraduated) {
                cellData.push({ data: tr('degree.degree'), weight: 'bold', tailColons: true });
                cellData.push({ data: tr(`degree.${member.degree}`), textPosition: 'right' });
            }
            let footer = [];
            footer.push(member.website ? { text: tr('member.website'), link: member.website, icon: ['fa-solid', 'fa-globe'] } : {});
            footer.push(member.email ? { text: 'Email', link: `mailto:${member.email}`, tooltip: member.email, icon: ['fa-regular', 'fa-envelope'] } : {});
            column.innerHTML = createInformationCard(member.id, member.name, cellData,
                footer, member.image, 'is-2by1', member.name, getAvatar(member),
                member.name).outerHTML;
        }
        return column;
    }

    function getAvatar(member) {
        function hash(str) {
            let bs = new TextEncoder().encode(str);
            let hash = bs[0];
            for(let i = 1;i < bs.length;i++) {
                hash = hash * 31 + bs[i];
            }
            return hash;
        }
        return member.avatar ? member.avatar : `https://api.dicebear.com/9.x/adventurer/svg?seed=${hash(member.name)}`;
    }

    /**
     * @param {string} url the url of the data to be fetched
     * @returns {Promise<Member[]|null>}
     */
    async function fetchMember(url) {
        try {
            const f = await fetch(url);
            if(f.ok) {
                const content = await f.json();
                return content.map(it => {
                    const joinSpl = it.join.split('/', 2);
                    it.name = contentTranslateTransformer(it.name);
                    it.interest = Array.isArray(it.interest) ? it.interest.map(i => contentTranslateTransformer(i)) : [contentTranslateTransformer(it.interest || '')];
                    it.researchDirection = Array.isArray(it.researchDirection) ? it.researchDirection.map(i => contentTranslateTransformer(i)) :
                        [contentTranslateTransformer(it.researchDirection || '')];
                    it.joinDate = lang === 'zh' ? `${joinSpl[0]} 年 ${joinSpl[1]} 月` : `${joinSpl[1].padStart(2, '0')}/${+joinSpl[0] + 1911}`
                    delete it.join;
                    return it;
                });
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

    async function placeAdvisor() {
        const advisor = await (await fetch(`data/i18n/${lang}/advisor.json`)).json();
        const certification = yaml.load(await (await fetch('data/advisor/certification.yaml')).text());
        const paper = yaml.load(await (await fetch('data/advisor/paper.yaml')).text());
        const top5Paper = paper.slice(0, 5);
        const container = document.getElementById('advisor');
        const cellList = [
            { data: tr('member.qualifications'), weight: 'bold', tailColons: true },
            { data: '<div>' + advisor.qualifications.split(/,\s*/g).join(', </div><div>') + '</div>', textPosition: 'right' },
            { data: tr('member.room'), weight: 'bold', tailColons: true },
            { data: advisor.room, textPosition: 'right' },
            { data: tr('member.phone'), weight: 'bold', tailColons: true },
            { data: advisor.phone, textPosition: 'right' },
            { data: tr('member.expertise'), weight: 'bold', tailColons: true },
            { data: advisor.expertise.map(it => `<div>${it}</div>`).join(''), textPosition: 'right' },
            { data: tr('member.advisor.certification'), weight: 'bold', tailColons: true },
            { data: certification.map(it => `<div>${it}</div>`).join(''), textPosition: 'right' },
            { data: tr('member.advisor.paper'), weight: 'bold', tailColons: true },
            { data: top5Paper.map(it => `<div class="is-clipped" style="text-overflow: ellipsis; white-space: nowrap; max-width: 350px;">${it.title}</div>`)
                    .join('') + `<div><a id="paper-more">More...</a></div>`, textPosition: 'right' }
        ]
        const footer = [
            { text: 'Email', link: `mailto:${advisor.email}`, icon: ['fa-regular', 'fa-envelope'], tooltip: advisor.email },
        ]
        container.innerHTML = createInformationCard(null, advisor.name, cellList, footer, advisor.image, 'is-2by1', advisor.name, advisor.avatar, advisor.name).outerHTML;

        const paperLevel = document.querySelector('.card-content .grid .cell .is-clipped').parentElement;
        paperLevel.onclick = () => {
            document.getElementById('paper-modal').classList.add('is-active');
        }
        document.querySelector('.modal .message-body').innerHTML = `
            <ul>
                ${paper.map(it => `<li>"${it.title}", ${it.conference}, ${it.location}, ${it.date}</li>`).join('')}
            </ul>
        `;
    }

    (() => {
        // easter egg part
        let eggPreCondition = false;
        let secondEgg = false;
        const from = document.querySelector('#advisor .card');
        const dragFormat = 'none';
        const dragData = 'egg';
        let dragStart = false;
        from.ondragstart = e => {
            e.dataTransfer.setData(dragFormat, dragData);
            dragStart = true;
        }
        from.ondragend = _ => dragStart = false;
        const target = document.querySelector('#darkMode');
        target.ondragover = e => {
            if(!eggPreCondition && dragStart) {
                e.preventDefault();
            }
        }
        target.ondrop = e => {
            if(e.dataTransfer.getData(dragFormat) === dragData) {
                target.querySelector('.icon i').classList.add('fa-fade', 'non-fade');
                eggPreCondition = true;
            }
        }
        document.body.onbeforeprint = () => {
            if(eggPreCondition) return;
            const ele = document.getElementById(getCreator());
            if(ele) {
                ele.scrollIntoView({ behavior: 'instant' });
                ele.classList.add('creator');
                ele.querySelector('.card-header .card-header-title').innerHTML += '<span class="creator-text"> (Creator)</span>';
                ele.style.border = 'yellow 5px dashed';
            }
        }
        document.body.onafterprint = () => {
            const c = document.querySelector('.creator');
            if (c) {
                c.style.border = 'none';
                c.querySelector('.creator-text').remove();
            }
            if(eggPreCondition) {
                eggPreCondition = false;
                target.querySelector('.icon i').classList.remove('fa-fade', 'non-fade');
                const main = document.querySelector('main');
                const message = document.createElement('div');
                message.classList.add('container');
                const eggContent = tr('egg').replaceAll(/\r\n|\n|\r/g, '<br>');
                message.innerHTML = `<div class="section">
                    <div class="notification is-success is-light" draggable="true">
                        <button class="delete"></button>
                        <p>${eggContent}</p>
                    </div>
                </div>`;
                main.insertBefore(message, main.querySelector('.footer'));
                message.scrollIntoView({ behavior: 'smooth' });
                const deleteButton = message.querySelector('.delete');
                deleteButton.onclick = () => {
                    message.remove();
                }
                const not = message.querySelector('.notification')
                let secondDragStart = false;
                not.ondragstart = e => {
                    e.dataTransfer.setData('none', dragData);
                    secondDragStart = true;
                }
                not.ondragend = _ => secondDragStart = false;
                const f = document.querySelector('.footer');
                f.ondragover = e => {
                    if(secondDragStart) {
                        e.preventDefault();
                    }
                }
                f.ondrop = e => {
                    if(e.dataTransfer.getData(dragFormat) === dragData) {
                        not.parentElement.remove();
                        secondDragStart = false;
                        secondEgg = true;
                        anim();
                    }
                }
                injectTranslate();
            }
        }

        function anim() {
            if(!secondEgg) return;
            const current = new Date().getTime();
            const rot = Math.round(current / 20) % 360;
            document.querySelector('body').style.backdropFilter = `hue-rotate(${rot}deg) brightness(2)`;
            requestAnimationFrame(anim);
        }

    })();

})();

/**
 * @class Member
 * @property {string} id - The student id of the member
 * @property {string} name - The name of the member
 * @property {string} avatar - The avatar of the member
 * @property {string} image - The image of the member
 * @property {string[]} interest - The  interest of the member
 * @property {string[]} researchDirection - The research direction of the member
 * @property {number} joinYear - The year the member joined
 * @property {number} joinMonth - The month the member joined
 * @property {string|undefined|null} [website] - The website of the member
 * @property {string|undefined|null} [email] - The email of the member
 * @property {'csie'|'mpis'} department - The department of the member, can be 'csie'(Computer Science and Information Engineering) or 'mpis'(Master Program in Information Security)
 * @property {'undergraduate'|'master'|'phd'} [degree] - The degree of the member, can be 'undergraduate', 'master' or 'phd'
 */