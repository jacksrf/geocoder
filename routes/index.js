var express = require('express');
var router = express.Router();
var moment = require('moment');
var async = require('async')
var rest = require('restler');
var geocoderProvider = 'mapquest';
var httpAdapter = 'http';
var extra = {
          apiKey: 'jXwJS5sJLLF6EL5KmzduY2u9ESxUOFPE', // for Mapquest, OpenCage, Google Premier
          };
var geocoder = require('node-geocoder')(geocoderProvider,httpAdapter,extra);
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/geocode', function(req, res, next) {
  var db = req.db
  var collection = db.get('stores');
  collection.find({"latitude": { $exists: false}},{},function(e,docs){
    var i = 0;
    var start = docs.length
    var left = docs.length
    async.eachSeries(docs, function iterator(place, callback) {
      console.log(left+' / '+start)
      var address = place.address + ", " + place.city + "," + place.state + " " + place.zip;

        if (place.latitude === undefined) {

          geocoder.geocode(address, function(err, res) {
                if (res[0]) {
                  var latlong = res[0].latitude + ", " + res[0].longitude;
                  console.log(latlong)
                  collection.update({"_id": place._id}, {$set: {"longitude": res[0].longitude, "latitude": res[0].latitude}}, function(err) {
                    if (err) {
                      console.log(err)
                    }
                    left--
                    callback()
                  })
                } else {
                  // console.log("missing" + address)
                }
          });
      } else {
        i++
        console.log(i)
      }
    })
    res.render('geocode', { "responses": "success"});
  })
})

router.get('/rename', function(req, res, next) {
  var db = req.db
  var collection = db.get('stores');
  collection.find({"name": "Win-Ditrueie"},{},function(e,docs){
    var i = 0;
    docs.forEach(function(place) {
      console.log(place.name)
                  collection.update({"_id": place._id}, {"name": "Winn-Dixie","address": place.address,"triumph": place.triumph, "evolve": place.evolve, "sportsmans_pride": place.sportsmans_pride, "hunters_special": place.hunters_special, "sunshine_pet_treats": place.sunshine_pet_treats, "phone": place.phone ,"longitude": place.longitude, "latitude": place.latitude, "city": place.city, "state": place.state, "zip": place.zip}, function(err) {
                  })
          });
    })
  })


module.exports = router;
