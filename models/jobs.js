var mongoose = require('mongoose');
mongoose.connect("mongodb://mongo:27017/docker-node-mongo", { useNewUrlParser: true });

var jobSchema = new mongoose.Schema({
    title: String, 
    type: String,
    descriptionUrl: String,
    location: String,
    companyName: String,
    companyUrl: String,
    // I won't display it but i will use it to check if this job exists in my DB
    description: String
});

module.exports = mongoose.model("Job", jobSchema);