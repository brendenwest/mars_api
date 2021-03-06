const cheerio = require('cheerio');
const https = require('https');
const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // allows direct navigation to static files

const BASE_URL = "https://www.marssociety.org/"

app.get('/', (req,res) => {
    res.send('home');
});

app.get('/:section', (req,res, next) => {
    const url = `${BASE_URL}${req.params.section}/`

    https.get(url, (response) => {
        let articles = [];
        // { title: "", image_url: "", description: "", url: ""}

        // Continuously update stream with data
        let body = '';
        response.on('data', (d) => {
            body += d;
        });

        response.on('end', () => {
            $ = cheerio.load(body);
            $('article').each((index, element) => {
                let title = $(element).find(".entry-title").text()
                let image_src = $(element).find("img").attr("data-src")
                let description = $(element).find(".entry-content p").text()
                let url = $(element).find(".tms2020-read-more-link").attr("href")
                let pubdate = $(element).find("time").text()
                articles.push(
                  { title, image_src, description, url, pubdate}
                )
            });
            res.json(articles);
        })
    }).end();
});

// define 404 handler
app.use((req,res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');
});
