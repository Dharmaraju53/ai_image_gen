const puppeteer = require('puppeteer');

async function scrapePage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Scraping logic
  const scrapedData = await page.evaluate(() => {
    const title = document.querySelector('title') ? document.querySelector('title').innerText : null;
    const metaDescription = document.querySelector('meta[name="description"]')
      ? document.querySelector('meta[name="description"]').content
      : null;
    const bodyText = document.body ? document.body.innerText : '';

    return {
      title,
      metaDescription,
      content: bodyText,
    };
  });

  await browser.close();
  return scrapedData;
}

module.exports = { scrapePage };
