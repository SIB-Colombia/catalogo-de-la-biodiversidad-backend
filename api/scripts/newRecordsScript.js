var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var TaxonRecordNameVersion = require('../models/taxonRecordName.js');
var SynonymsAtomizedVersion = require('../models/synonymsAtomized.js');
var CommonNamesAtomizedVersion = require('../models/commonNamesAtomized.js');
var HierarchyVersion = require('../models/hierarchy.js');
var ThreatStatusVersion = require('../models/threatStatus.js');
var add_objects = require('../models/additionalModels.js');
var parse = require('csv-parse');
var rest = require('restler');
var Schema = mongoose.Schema;

var CatalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDb', function(err) {
	if(err){
		console.log('connection error', err);
	}else{
		async.waterfall([
			function(callback){ 
    			console.log("Read the csv file ");
        		//RecordModel.find({}).exec(callback);
        		//Leer el archivo, Read the file
        		var data = [];
        		var input = fs.createReadStream("/home/oscar/Desktop/TAX.csv");
        		var parser = parse({delimiter: ','});
        		parser.on('readable', function(){
  					while(record = parser.read()){
    					data.push(record);
  					}
				});
				parser.on('finish', function(){
					callback(null, data);
				});
				input.pipe(parser);
        		//var stream = fs.createReadStream(inputFile).pipe(parser);
        		
        	},
        	function(data,callback){
        		console.log("Number of scientific names to insert: "+data.length);
        		var newRecordSchema = add_objects.Record.schema;
          		var newRecordModel = CatalogoDb.model('Record', newRecordSchema );
        	}

		], function (err, result) {
    		
		});

	}

});