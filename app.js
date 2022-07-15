const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');
const { application } = require('express');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const PORT = 443;

app.get("/welcome/:name", function(req, res){
    const name = req.params.name;
    res.send("Welcome to my web server " + name);
});

//load game 1
app.use(express.static(__dirname+'/games/game1'))
app.get("/spacegame", function(req, res){
    res.sendFile(__dirname + '/games/game1/game1.html')
});

//load game 2
app.use(express.static(__dirname+'/games/game2'))
app.get("/junglegame", function(req, res){
    res.sendFile(__dirname + '/games/game2/index.html')
});

app.post("/welcome", function(req, res) {
    const name = req.body.name;
    res.send("Welcome " + name);
})

app.listen(PORT, function() {
    console.log("server is ready at " + PORT);
});
