const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).send({ error: 'Keyword is required' });
    }

    try {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto(`https://www.youtube.com/results?search_query=${keyword}`);

        const results = await page.evaluate(() => {
            const videoElements = document.querySelectorAll('ytd-video-renderer');
            const videos = [];
            videoElements.forEach(video => {
                const titleElement = video.querySelector('#video-title');
                const urlElement = video.querySelector('a#thumbnail');
                const title = titleElement ? titleElement.innerText : null;
                const url = urlElement ? urlElement.href : null;
                if (title && url) {
                    videos.push({ title, url });
                }
            });
            return videos.slice(0, 20);
        });

        await browser.close();
        res.send(results);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch search results' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
