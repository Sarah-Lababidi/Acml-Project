var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/docker-node-mongo", {useNewUrlParser: true});
var Job = require("./models/jobs");
var location;
var description;


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/jobs", function(req, res){
    location = req.query.location;
    description = req.query.description;
    var url = "https://jobs.github.com/positions.json?description="+description+"&location="+location;
    // Check if there exists a Job with these location and descriptions values in my database
    Job.find({"location": { $regex: location, $options: 'i'}, "description": { $regex: description, $options: 'i'} }, function(err, jobs){
        if(err){
            console.log(err);
        } else {
            // check if jobs is null (I don't have this search result in my databse)-> make api request, save to database
            if(jobs === undefined || jobs.length == 0) {
                // make api request
                request(url, function(error, response, body){
                    if(!error&&response.statusCode==200){
                       var parsedData = JSON.parse(body);
                       let cb_counter = 0;
                       parsedData.forEach(function(element){
                        Job.create({
                            title: element["title"], 
                            type: element["type"],
                            descriptionUrl: element["url"],
                            location: element["location"],
                            companyName: element["company"],
                            companyUrl: element["company_url"],
                            description: element["description"]
                        }, function(err, newjob){
                            if(err){
                                console.log(err);
                            } else { 
                                cb_counter++;
                                console.log(newjob);
                                if(cb_counter==parsedData.length){
                                    Job.find({"location": { $regex: location, $options: 'i'}, "description": { $regex: description, $options: 'i'} }, function(err, jobs){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            res.render("jobs", {jobs:jobs});
                                        }
                                    });
                                }
                            }
                        });
                        });
                    }
                });
            } else {
		        Job.find({"location": { $regex: location, $options: 'i'}, "description": { $regex: description, $options: 'i'} }, function(err, jobs){
                    if(err){
                        console.log(err);
                    } else {
                        res.render("jobs", {jobs:jobs});
                    }
                });
            }
        }
    });
});

app.get("*", function(req, res){
    res.send("<h2>Page Not Found</h2>");
});

app.listen(3000, console.log("listening to port 3000"));
