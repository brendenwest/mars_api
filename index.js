
const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // allows direct navigation to static files

app.get('/', (req,res) => {
    res.send('home');
});

app.get('/news', (req,res, next) => {
    console.log('get mars news')
    const cheerio = require('cheerio');
    const https = require('https');
    const url = "https://www.marssociety.org/news/"

    https.get(url, (response) => {
        // const articles = [];
        // { title: "", image_url: "", description: "", url: ""}

        // Continuously update stream with data
        var body = '';
        response.on('data', (d) => {
            body += d;
        });

        response.on('end', () => {
            console.log(body)
            $ = cheerio.load(body);
        })
    }).end();

});



// define 404 handler
app.use(function(req,res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), function() {
    console.log('Express started');
});
