//Dependencies

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

//Setup
var app = express();
var port = 3000;
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Initialize variables
var candidates = [];
var candidateComparison = [];



//HTML routing
app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "app/public/survey.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "app/public/home.html"));
});

//API routing
app.post("/api/friends", function (req, res) {
    var parsedReqAnswers = [];
    for (i = 0; i < req.body.answers.length; i++) {
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
    for (i = 0; i < candidates.length; i++) {
        var differenceArray = parsedReqBody.answers.map(function (item, index) {
            return Math.abs(item - candidates[i].answers[index]);
        });
        var totalDifference = differenceArray.reduce(getSum);
        candidateComparison.push(totalDifference);
    };
    //Figure out which value of candidateComparison array is lowest and which candidate has that same index in the candidates array
    var minimum = Array.min(candidateComparison);
    var index = candidateComparison.indexOf(minimum);
    //If to avoid errors when there are 0 other candidates. Check compatibility with others only when there are others!
    if (candidates.length > 0) {
        //Build response for post request, including % of compatibility (the highest possible difference between two candidates is 40)
        var response = {
            name: candidates[index].name,
            pic: candidates[index].pic,
            compatibility: ((1 - (minimum / 40)) * 100).toFixed(2),
            firstCandidate: false
        };
        res.send(response);
    } else {
        //If this person is the first candidate, send a different response.
        var response = {
            pic: parsedReqBody.pic,
            firstCandidate: true
        }
        res.send(response);
    };
    //Add this candidate to the list of candidates
    candidates.push(parsedReqBody);
});


//Functions to do some math
function getSum(total, num) {
    return total + num;
};

Array.min = function (array) {
    return Math.min.apply(Math, array);
};

//Listener
app.listen(process.env.PORT || port, function () {
    console.log("Listening on http://localhost:" + port);
});

