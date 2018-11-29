var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/jobs", function(req, res){
    res.render("jobs");
});

app.get("/search", function(req, res){
    var location = req.query.location;
    var description = req.query.description;
    var url = "https://jobs.github.com/positions.json?description="+description+"&location="+location;
    request(url, function(error, response, body){
        if(!error&&response.statusCode==200){
            var parsedData = JSON.parse(body);
            res.render("jobs", {data: parsedData});
        }
    })
});

app.get("*", function(req, res){
    res.send("<h2>Page Not Found</h2>");
});

app.listen(3000, console.log("listening to port 3000"));