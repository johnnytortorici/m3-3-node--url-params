'use strict';

const express = require('express');
const morgan = require('morgan');

const { top50 } = require('./data/top50');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

// endpoints here

// handle top50 page
app.get('/top50', (req, res) => {
    res.status(200);
    res.render('pages/top50', { 
        title: 'Top 50 Songs Streamed on Spotify',
        top50: top50
    });
});

// handle individual song page
app.get('/top50/song/:num', (req, res) => {
    const num = req.params.num;
    let songObj = {};

    top50.forEach( (song) => {
        // render page only if object exists with rank equal to param
        if (song.rank.toString() === num) {
            songObj = song;

            res.status(200);
            res.statusMessage = 'ok';
            res.render('pages/song', { 
                title: `Song #${num}`,
                song: songObj
            });
        }
    });
    // render 404 only if previous if was not triggered
    if (res.statusMessage !== 'ok') {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
});

// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
