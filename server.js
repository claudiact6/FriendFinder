var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

var port = 3000;

var candidates = []

app.use(express.static(__dirname + '/app'));


app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "/app/public/survey.html"));
});


app.post("/survey", function (req, res) {
    candidates.push(req.data);
    console.log(candidates);
});


app.listen(port, function () {
    console.log("Listening on http://localhost:" + port);
});
