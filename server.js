const puppeteer = require('puppeteer');

const scrapePage = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
    const metaDescription = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : '';
    const content = document.body.innerText;

    return { title, metaDescription, content };
  });

  await browser.close();
  return result;
};

module.exports = { scrapePage };
