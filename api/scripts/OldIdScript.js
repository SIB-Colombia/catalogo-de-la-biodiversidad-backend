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
var fs = require("fs");

function ScriptException(message) {
   this.message = message;
   this.name = "ScriptException";
}

var CatalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDbNewAPI', function(err) {
	if(err) {
      console.log('connection error: '+err); 
    }else{
    	console.log('connection successful to the CatalogoDb');
    	async.waterfall([
    		function(callback){
    			//read the file csv
    			var scNames = [];
    			console.log("Read the csv file");
        		var input = fs.createReadStream("/home/oscar/Desktop/catalogo_old_ids.csv");
        		var parser = parse({delimiter: ','});
        		parser.on('readable', function(){
  					while(record == parser.read()){
    					scNames.push(record);
  					}
				});
				parser.on('finish', function(){
					callback(null, scNames);
				});
				input.pipe(parser);
    		},
    		function(scNames,callback){
    			console.log("Number of records to update: "+scNames.length);
    			
    			sData=scNames.slice(1, scNames.length);
    			async.eachSeries(sData, function(line, callback) {
    				var taxID = line[0].trim();
    				var taxName = line[1].trim();
    				console.log("Search in the database for : " + taxName);
    				console.log("ID in the old database : " + taxID);
    				var texSchema = TaxonRecordNameVersion.schema;
    				var TaxonRecordNameVersionModel = CatalogoDb.model('TaxonRecordNameVersion', texSchema );
          			var newRecordSchema = add_objects.Record.schema;
          			var newRecordModel = CatalogoDb.model('Record', newRecordSchema );
          			TaxonRecordNameVersionModel.findOne({'taxonRecordName.scientificName.canonicalName.simple': { "$regex": taxName, "$options": "i" } }, function(err, tax_record){
          				if(err){
          					console.log("Error finding scientificName in the database!: " + taxName);
							      throw new ScriptException("Error finding scientific Name in the database!: " + taxName);
          				}else{
          					if(tax_record){
          						var id_record = tax_record.id_record;
                      console.log("Id of the record: "+id_record);
                      console.log("Id legacy: "+taxID);

          						newRecordModel.findByIdAndUpdate(id_record, {"legacy_id":taxID }, {safe: true}, function(err, record){
          							if(err){
          								console.log("Error finding scientificName in the database!: " + taxName);
										      throw new ScriptException("Error finding scientific Name in the database!: " + taxName);
          							}else{
          								console.log("Updated RecordVersion: " + record.id);
          								callback();
          							}
          						});
          					}else{
          						console.log("Does not exist record with that scientificName");
                      fs.appendFileSync("./missing_names.txt", taxName.toString() + "\n");
          						callback();
          					}
          				}
          			});
    				/*
    				async.waterfall([
    					function(callback){
    						console.log("Search in the database for : " + taxName);
    						var texSchema = TaxonRecordNameVersion.schema;
          					var TaxonRecordNameVersionModel = CatalogoDb.model('TaxonRecordNameVersion', texSchema );
          					var newRecordSchema = add_objects.RecordVersion.schema;
          					var newRecordModel = CatalogoDb.model('RecordVersion', newRecordSchema );
          					TaxonRecordNameVersionModel.findOne({'taxonRecordName.scientificName.canonicalName.simple': taxName }, function(err, tax_record){
          						if(err){
          							console.log("Error finding scientificName in the database!: " + taxName);
									throw new ScriptException("Error finding scientific Name in the database!: " + taxName);
          						}else{
          							if(tax_record){
          								var id_record = tax_record.id_record;
          								newRecordModel.findByIdAndUpdate(id_record, {"legacy_id":taxID }, function(err, record){
          									console.log("Updated RecordVersion: " + record.id);
          									console.log("Id ficha: " + record.id + " " + id_record);
          								});
          							}else{
          								console.log("");
          							}
          						}
          					});
    					}
    					],
    					function(err,result){
    					//result now equals 'node' TODO
     				});
     				*/
    			}, function(err){
              			if( err ) {
                			console.log('A scientificName failed to process');
              			} else {
                			console.log('All scientificNames have been processed successfully');
                			callback(null, CatalogoDb);
              			}
          		});
    		},
    		function(CatalogoDb,callback){
    			CatalogoDb=mongoose.disconnect();
    		}
    	],
    	function(err,result){
    		if (err) {
            	console.log("Error: "+err);
          	}else{
            	console.log('done!');
          	}
     	});
    }
});