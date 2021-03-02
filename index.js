const argv = require('yargs')
    .command('scrapyScrapy', 'for ps5')
    .option('debug', {
        alias: 'd',
        description: 'Send message when still out of stock',
        type: "boolean"
    })
    .option('check', {
        alias: 'c',
        description: 'Check ps4 stock to sanity test the scrapper',
        type: "boolean"
    })
    .option('silent', {
        alias: 's',
        description: 'Do not notify slack',
        type: "boolean"
    })
    .argv;
const { scrapyScrapy } = require('./scrapper')

const props = {
    debug: argv.d || false,
    silent: argv.s || false,
    check: argv.c || false,
    
}
console.log(`Props? ${JSON.stringify(props)}`)


const ps5Url = "https://www.gamestop.ie/SearchResult/QuickSearch?q=ps5&rootGenre=27"
const ps4Url = "https://www.gamestop.ie/SearchResult/QuickSearch?platform=31&productType=1"
// const url = 'https://en.wikipedia.org/wiki/George_Washington';
const ps4GamesUrl = "https://www.gamestop.ie/SearchResult/QuickSearch?platform=31&productType=2&release=1"
const url = props.check ? ps4Url : ps5Url;

scrapyScrapy(url, props);



