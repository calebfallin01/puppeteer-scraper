const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
fs.ensureDirSync(outputDir);

async function scrapeWebsite(url) {
    console.log('Starting browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        console.log('Creating new page...');
        const page = await browser.newPage();
        
        // Set viewport to a common size
        await page.setViewport({ width: 1920, height: 1080 });
        
        console.log(`Navigating to ${url}...`);
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Get all the content
        const content = await page.evaluate(() => {
            return {
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.content || '',
                headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
                    level: h.tagName.toLowerCase(),
                    text: h.textContent.trim()
                })),
                links: Array.from(document.querySelectorAll('a')).map(a => ({
                    text: a.textContent.trim(),
                    href: a.href
                })),
                images: Array.from(document.querySelectorAll('img')).map(img => ({
                    src: img.src,
                    alt: img.alt
                })),
                paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()),
                lists: Array.from(document.querySelectorAll('ul, ol')).map(list => ({
                    type: list.tagName.toLowerCase(),
                    items: Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim())
                })),
                tables: Array.from(document.querySelectorAll('table')).map(table => ({
                    headers: Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim()),
                    rows: Array.from(table.querySelectorAll('tr')).map(tr => 
                        Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
                    )
                }))
            };
        });

        // Generate filename from URL
        const filename = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const outputPath = path.join(outputDir, `${filename}.json`);

        // Save to JSON file
        await fs.writeJson(outputPath, content, { spaces: 2 });
        console.log(`Content saved to ${outputPath}`);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

// Get URL from command line argument
const url = process.argv[2];
if (!url) {
    console.error('Please provide a URL as a command line argument');
    console.log('Usage: node scraper.js <url>');
    process.exit(1);
}

scrapeWebsite(url); 