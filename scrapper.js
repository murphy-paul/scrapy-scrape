const axios = require('axios').default;
const cheerio = require('cheerio');
const _ = require('lodash')
const { sendMessage } = require('./slack')

async function fetchHtml(url) {
    const { data } = await axios.get(url)
    return cheerio.load(data)
}

const isHiddenElement = element => {

    console.log(`Checking element: ${element}`)
    if (element === undefined) {
        return true;
    }
    if (_.includes(element.attr('style'), 'display: none')) {
        return true;
    }
    return false;
}

async function scrapyScrapy(url, config, props) {
    console.log(`Running with props ${JSON.stringify(props)} for url ${url}`)
    fetchHtml(url).then(selector => {



        // const product = $("body").find("#prodMain .bigBuyButtons a[class='megaButton buyDisabled']");
        // if the 'buy disabled button is hidden or not found then we could have stock.
        // const hasStock = isHiddenElement(product);
        // console.log(isOutOfStock)

        const hasStock = config.handler(selector);
    
        if (hasStock) {
            // Do stuff
            const message = `Looks like ${config.name} might have stock`;
            console.log(message)
            sendMessage(message, props, url)
    
        } else {
            // maybe sanity check
            const message =  `${config.name} still has no ps5 stock`;
            console.log(message)
            if (props.debug) {
                sendMessage(message, props, url)
            }
        }
    
        
    }).catch(function (error) {
        const message =  `Could not load page ${url}. Check if the queue page is up`
        console.log(message)
        console.log(error)
        sendMessage(message, props);
    
    })
        
}

module.exports = { scrapyScrapy, isHiddenElement }
