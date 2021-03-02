const puppeteer = require('puppeteer')

const waitBeforeClosing = timeout => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
};

async function takeScreenShot(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-extensions-except=/path/to/manifest/folder/',
          '--load-extension=/path/to/manifest/folder/',
        ]
    });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    // pdynamicbutton > a[class='call']

    // const cookieAcceptBtn = await page.$(".pdynamicbutton > a[class='call']");
    // await cookieAcceptBtn.click();   
    
    await page.screenshot({ path: 'example.png', fullPage: true });
  
    await browser.close();

    return 'example.png'
}

module.exports = { takeScreenShot }