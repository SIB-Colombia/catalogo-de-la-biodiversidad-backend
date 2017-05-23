var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var AncillaryDataVersion = require('../models/ancillaryData.js');
var add_objects = require('../models/additionalModels.js');
var Schema = mongoose.Schema;
var rest = require('restler');
var fs = require("fs");
var Flickr = require("flickrapi"),
 flickrOptions = {
      api_key: "d70bb0faa317f97f15ecf636ee77c33e",
      secret: "e7d0dd63c288cb8b"
    };

var catalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDbNewAPI', function(err) {
	if(err){
		console.log('connection error', err);
	}else{
		console.log('connection successful to the CatalogoDb');
		async.waterfall([
			function(callback) {
				var recordSchema = add_objects.Record.schema;
      			var Record = catalogoDb.model('Record', recordSchema );

          		Record.find({}).select('_id scientificNameSimple').exec(function (err, data) {
          			if(err){
          				console.log("Error: "+err);
          				callback(new Error("Error getting the total of Records:" + err.message));
          			}else{
          				callback(null, data);
          			}
          		});
			},
			function(data,callback) {
				console.log(data.length);
				console.log("Searching in EOL");
				async.eachSeries(data, function(record_data, callback){
					//console.log(record_data._id);
      				rest.get("http://eol.org/api/search/1.0.json?q="+ encodeURIComponent(record_data.scientificNameSimple) +"&page=1&exact=true&filter_by_taxon_concept_id=&filter_by_hierarchy_entry_id=&filter_by_string=&cache_ttl=").on('complete', function(data, response) {
      					if (data instanceof Error || response.statusCode !== 200) {
      						console.log('Error:', data.message);
      						//callback(null, data); TO DO throw error
      					}else{
      						//callback(null, data);
      					}
      				});
					callback();
				},function(err,result){
					if(err){
                  		callback(new Error("Error: "+err));
              		}else{
                  		callback(null, data);
              		}
				});
			}
		]);
	}
});