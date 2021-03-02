const Hapi = require('@hapi/hapi')
const HapiCron = require('hapi-cron')
const { scrapyScrapy, isHiddenElement } = require('./scrapper')

const server = new Hapi.Server({
    port: 3000,
    host: '0.0.0.0'
});

const ps5Url = "https://www.gamestop.ie/Platform/Games/72504"
const ps4Url = "https://www.gamestop.ie/PlayStation%204/Games/71914/playstation-4-500gb-console"

const sites = {
    gamestop: {
        name: "Game Stop",
        url: "https://www.gamestop.ie/Platform/Games/72504",
        sanityCheckUrl: "https://www.gamestop.ie/PlayStation%204/Games/71914/playstation-4-500gb-console",
        handler: selector => {
            const product = selector("body").find("#prodMain .bigBuyButtons a[class='megaButton buyDisabled']");

            // if the buyDisabled button is not found or it is hidden then we could have stock
            const hasStock = isHiddenElement(product);

            return hasStock
        }
    }
}

async function scrapyScrape() {
    try {
        await server.register({
            plugin: HapiCron,
            options: {
                jobs: [{
                    name: 'gamestop',
                    time: '0 */2 * * * *',
                    timezone: 'Europe/London',
                    request: {
                        method: 'GET',
                        url: '/scrapy-scrape?site=gamestop&silent=false&debug=false&check=false'
                    },
                    onComplete: (res) => {
                        console.log(res); // 'hello world'
                    }
                }]
            }
        });
 
        server.route({
            method: 'GET',
            path: '/test-url',
            handler: function (request, h) {
                return 'hello world'
            }
        });

        server.route({
            method: 'GET',
            path: '/scrapy-scrape',
            config: {
                response: {
                    emptyStatusCode: 204
                }
            },
            handler: function(request, h) {
                const props = {
                    debug: request.query.debug === 'true',
                    check: request.query.check === 'true',
                    silent: request.query.silent === 'true',
                }
                const site = sites[request.query.site];

                if(site) {
                    const url = props.check ? site.sanityCheckUrl : site.url;

                    scrapyScrapy(url, site, props);
                } else {
                    console.log(`No site found for ${request.query.site}`)
                }


                return {}
            }
        })
 
        await server.start();
    }
    catch (err) {
        console.info('there was an error');
    }
}

scrapyScrape();
