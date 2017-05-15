var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var Property = require('../models/property.js');
var add_objects = require('../models/additionalModels.js');
var parse = require('csv-parse');
var rest = require('restler');
var csv = require("csv-streamify");
var request = require('request')
var Schema = mongoose.Schema;
var fs = require("fs");

var catalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDbNewAPI', function(err) {
	if(err) {
     	console.log('connection error', err);
    }else{

     	console.log("Load data from google spreadsheet");
     	var propertySchema = Property.schema;
     	propertyModel = catalogoDb.model('Property', propertySchema );
      	var parserProperties = csv({objectMode: true, columns: true});
      	parserProperties.on('readable', function (err, result) {
			var line = parserProperties.read();
			if(line!==null){
				console.log("Line: "+JSON.stringify(line));
				var propertyDoc = new propertyModel(line);
				propertyDoc.save(function (err) {
					if(err){
						console.log("Error saving the properties from spreadsheet: "+err);
					}
				});
				/*
				if(line.titulo_capitulo) {
					line.num = counter;
					db_chapters.insert(line);
					counter++;
				}
				*/
			}
		});
    }

    request("https://docs.google.com/spreadsheets/d/11AVyDWhf6vk1MrhkMnU5VvN2oDrco52LVOyd9c5OVjc/export?format=csv&id=11AVyDWhf6vk1MrhkMnU5VvN2oDrco52LVOyd9c5OVjc&gid=1690015484").pipe(parserProperties);
});