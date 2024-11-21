(async () => {
    const introduction = document.getElementById('introduction');

    const data = await fetch(`data/i18n/${lang}/introduction.txt`);
    introduction.innerHTML += rawToHtml(await data.text());

    function rawToHtml(raw) {
        const sec = raw.split(/[\n\r]+/g);
        return sec.map(it => `<p>${it}</p>`).join('');
    }

})();