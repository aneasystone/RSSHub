const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');

async function getArticles() {
    const url = 'https://blog.frognew.com/';
    const { data: res } = await got(url);
    const $ = cheerio.load(res);
    const articles = $('.res-cons').eq(0).find('article');
    return articles.toArray().map((elem) => {
        const a = $(elem).find('header > h1 > a');
        return {
            title: a.text(),
            description: $(elem).find('.post-content').text(),
            link: a.attr('href'),
            pubDate: parseDate($(elem).find('time').attr('datetime')),
        };
    });
}

module.exports = async (ctx) => {
    const articles = await getArticles();
    ctx.state.data = {
        title: '青蛙小白',
        link: 'https://blog.frognew.com/',
        item: articles,
    };
};
