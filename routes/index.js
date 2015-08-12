var express = require('express');
var router = express.Router();
var moment = require('moment');

var rest = require('restler');
var geocoderProvider = 'mapquest';
var httpAdapter = 'http';
var extra = {
          apiKey: 'AGplRSYjXoW5uEgBsGbs7Pe4G6Iivfdc', // for Mapquest, OpenCage, Google Premier
          };
var geocoder = require('node-geocoder')(geocoderProvider,httpAdapter,extra);
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/geocode', function(req, res, next) {
  var db = req.db
  var collection = db.get('');
  collection.find({},{},function(e,docs){
    var i = 0;
    docs.forEach(function(place) {
      console.log(place.latitude)
      var address = place.address;
        if (place.latitude != undefined) {
          console.log(i)
          console.log(place)
          i++;
          geocoder.geocode(address, function(err, res) {
              if (err) {
              } else {
                if (res[0]) {
                  var latlong = res[0].latitude + ", " + res[0].longitude;
                  console.log(latlong)
                  collection.update({"_id": place._id}, {"name": place.name,"address": place.address, "phone": place.phone ,"longitude": res[0].longitude, "latitude": res[0].latitude}, function(err) {
                    if (err) {
                      console.log(err)
                    }
                  })
                }

              }
          });
      }
    })
    res.render('geocode', { "responses": "success"});
  })
})

module.exports = router;
