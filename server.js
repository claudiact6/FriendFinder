var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();

var port = 3000;

var candidates = [];
var candidateComparison = [];

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "/app/public/survey.html"));
});


app.post("/api/friends", function (req, res) {
    var parsedReqAnswers = [];
    for (i=0; i<req.body.answers.length; i++) {
        var answer = parseInt(req.body.answers[i]);
        parsedReqAnswers.push(answer);
    };
    var parsedReqBody = {
        name: req.body.name,
        pic: req.body.pic,
        answers: parsedReqAnswers
    };
    //Empty comparison before doing new comparison
    candidateComparison = []; 
    //Find total difference between the new candidate and all previous candidates
    for (i=0; i<candidates.length; i++) {
        var differenceArray = parsedReqBody.answers.map(function(item,index) {
            return Math.abs(item - candidates[i].answers[index]);
        });
        var totalDifference =  differenceArray.reduce(getSum);
        console.log(req.body.name + "'s difference with " + candidates[i].name + ": " + totalDifference);
        candidateComparison.push(totalDifference);
    };
    //Figure out which value of candidateComparison array is lowest and what candidate has that same index in the candidates array
    console.log(candidateComparison);
    var minimum = Array.min(candidateComparison);
    var index = candidateComparison.indexOf(minimum);
    //If to avoid errors when there are 0 other candidates
    if (candidates.length > 0) {
    console.log(candidates[index].name);
    var response = {
        name: candidates[index].name,
        pic: candidates[index].pic,
        compatibility: (1 - (minimum / 40)) * 100
    };
    console.log(response);
    res.send(response);
    };
    //Add this candidate to the list of candidates
    candidates.push(parsedReqBody);
    console.log(candidates);
});


app.listen(port, function () {
    console.log("Listening on http://localhost:" + port);
});

function getSum(total, num) {
    return total + num;
};

Array.min = function(array){
    return Math.min.apply( Math, array );
};