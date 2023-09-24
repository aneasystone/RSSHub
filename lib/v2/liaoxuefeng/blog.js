const got = require('@/utils/got');
const cheerio = require('cheerio');

async function getArticles() {
    const url = 'https://www.liaoxuefeng.com/category/895882450960192';
    const { data: res } = await got(url);
    const $ = cheerio.load(res);
    const articles = $('.uk-article');
    return articles.toArray().map((elem) => {
        const a = $(elem).find('h3 > a');
        const time = $(elem).find('p').eq(0).find('span').attr('data');
        return {
            title: a.text(),
            description: $(elem).find('p').eq(1).text(),
            link: a.attr('href'),
            pubDate: new Date(parseInt(time)),
        };
    });
}

module.exports = async (ctx) => {
    const articles = await getArticles();
    ctx.state.data = {
        title: '文章 - 廖雪峰的官方网站',
        link: 'https://www.liaoxuefeng.com/category/895882450960192',
        item: articles,
    };
};
