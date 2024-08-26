const express = require('express');
const puppeteer = require('puppeteer');
const { PDFDocument, rgb } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/extract-transcript', async (req, res) => {
    const { videoUrl, videoTitle } = req.body;

    if (!videoUrl || !videoTitle) {
        return res.status(400).send('videoUrl and videoTitle are required');
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(videoUrl, { waitUntil: 'networkidle2' });

        // Maximize the window
        await page.setViewport({ width: 1920, height: 1080 });

        // Click the "Expand" button to expand the video description
        await page.waitForSelector('tp-yt-paper-button#expand', { timeout: 60000 });
        await page.click('tp-yt-paper-button#expand');

        // Wait for the "Show transcript" button and click it
        await page.waitForSelector('button[aria-label="Show transcript"]', { timeout: 60000 });
        await page.click('button[aria-label="Show transcript"]');

        // Wait for the transcript container to appear
        await page.waitForSelector('ytd-transcript-segment-list-renderer', { timeout: 60000 });

        // Extract the transcript text
        const transcript = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('ytd-transcript-segment-renderer .segment-text'));
            return elements.map(element => element.innerText).join('\n');
        });

        await browser.close();

        // Create PDF document and save the transcript
        const pdfDoc = await PDFDocument.create();
        const page1 = pdfDoc.addPage();
        const { width, height } = page1.getSize();
        const fontSize = 12;
        const textWidth = width - 2 * 50;
        const textHeight = height - 2 * 50;
        const textLines = transcript.split('\n');
        const linesPerPage = Math.floor(textHeight / fontSize);

        let currentPage = page1;
        let currentY = height - 50 - fontSize;

        for (let i = 0; i < textLines.length; i++) {
            if (currentY < 50) {
                currentPage = pdfDoc.addPage();
                currentY = height - 50 - fontSize;
            }
            currentPage.drawText(textLines[i], {
                x: 50,
                y: currentY,
                size: fontSize,
                color: rgb(0, 0, 0),
                maxWidth: textWidth,
                lineHeight: fontSize * 1.5
            });
            currentY -= fontSize * 1.5;
        }

        const pdfBytes = await pdfDoc.save();
        const fileName = `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        const pdfPath = path.join(__dirname, fileName);
        fs.writeFileSync(pdfPath, pdfBytes);

        // Send the PDF file to the frontend and delete it after sending
        res.download(pdfPath, fileName, (err) => {
            if (err) {
                console.error('Error sending PDF:', err);
                res.status(500).send('Error sending PDF');
            } else {
                fs.unlinkSync(pdfPath); // Delete the file after sending it
                console.log(`Transcript sent and deleted: ${pdfPath} for ${videoTitle}`);
            }
        });
    } catch (error) {
        console.error('Error extracting transcript:', error);
        res.status(500).send('Error extracting transcript');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
