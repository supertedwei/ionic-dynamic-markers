// Set up
var express     = require('express');
var app         = express();
var mongoose    = require('mongoose');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var cors        = require('cors');
 
// Configuration
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/markers');
 
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
 
// Models
var markerSchema = new mongoose.Schema({
    loc: {
        type: { 
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number]
        }
    }    
});
 
markerSchema.index({ loc: '2dsphere'});
 
var Marker = mongoose.model('Marker', markerSchema);
 
/*
 * Generate some test data, if no records exist already
 * MAKE SURE TO REMOVE THIS IN PROD ENVIRONMENT
*/
 
// http://stackoverflow.com/questions/6878761/javascript-how-to-create-random-longitude-and-latitudes
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}
 
/*Marker.remove({}, function(res){
    console.log("removed records");
});*/
 
Marker.count({}, function(err, count){
 
    console.log("Markers: " + count);
 
    if(count === 0){
 
        var recordsToGenerate = 2000;
 
        for(var i = 0; i < recordsToGenerate; i++){
 
            var newMarker = new Marker({
 
                "loc": {
                    "type": "Point",
                    "coordinates": new Array(getRandomInRange(-180, 180, 3), getRandomInRange(-180, 180, 3))
                }
 
            });
 
            newMarker.save(function(err, doc){
                console.log("Created test document: " + doc._id);
            });
        }
 
    }
 
});
 
// Routes
app.post('/api/markers', function(req, res) {
 
    var lng = req.body.lng;
    var lat = req.body.lat;
    var maxDistance = req.body.maxDistance * 1000; //kn 
 
    Marker.find({
 
        loc: {
 
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: maxDistance,
                $spherical: true
            },
 
        }
 
    }, function(err, markers){
 
        if(err){
            res.send(err);
        } else {
            res.json(markers);
        }
 
    });
 
});
 
// Listen
app.listen(8080);
console.log("App listening on port 8080");