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

var CatalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDbNewAPI', function(err) {
	if(err){
		console.log('connection error', err);
	}else{
		async.waterfall([
			function(callback){ 
    			console.log("Read the csv file ");
        		//RecordModel.find({}).exec(callback);
        		//Leer el archivo, Read the file
        		var data = [];
        		var input = fs.createReadStream("/home/oscar/Desktop/SpeciesCO.csv");
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
          	var Record = CatalogoDb.model('Record', newRecordSchema );

            var recordVersionSchema = add_objects.RecordVersion.schema;
            var RecordVersion = CatalogoDb.model('RecordVersion', recordVersionSchema );

            var taxonSchema = TaxonRecordNameVersion.schema;
            TaxonRecordNameVersion = CatalogoDb.model('TaxonRecordNameVersion', taxonSchema );

            var hierarchySchema = HierarchyVersion.schema;
            HierarchyVersion = CatalogoDb.model('HierarchyVersion', hierarchySchema );

          	data=data.slice(1, data.length);
          		async.eachSeries(data, function(line, callback) {
          			console.log(line);
          			line = line+"";
          			var specie =line.split(",");
          			var canName = specie[1];
          			var sciName = specie[2];
          			var kingdom = specie[3];
          			var phylum = specie[4];
          			var class_es = specie[5];
          			var order = specie[6];
          			var family = specie[7];
          			var genus = specie[8];
          			var specificEpithet = specie[9];
          			var Imagen_Thumbnail = specie[10];
                var Imagen_Destacada = specie[11];
          			console.log(canName);
          			/*
          			var name='zantedeschia aethiopicax';
          			var image = 'test.jpg';
          			*/
          			//console.log(sciName);
                canName ='zantedeschia aethiopicaxz';
          			var reg_ex = '^'+canName;
          			async.waterfall([
          				function(callback){
          					//newRecordModel.findOne({'scientificNameSimple': new RegExp('^'+name+'$', "i") }, 'scientificNameSimple', function(err, record){
          					Record.findOne({'scientificNameSimple': {'$regex' : reg_ex, '$options' : 'i'} }, 'scientificNameSimple', function(err, record){
          						if(err){
          							console.log("Error finding scientificName in the database!: " + canName);
									callback(new Error("Error to get EcologicalSignificance element for the record with id: "+record_data._id+" : " + err.message));
          						}else{	
          							if(record){
          								/*
          								console.log(record);
          								console.log(record._id);
          								*/
          								callback(null, record._id, record.scientificNameSimple);
          							}else{
          								console.log("no record");
          								callback(null, '');
          							}
          						}
          					});
          				},
          				function(id,callback){
          					console.log(id);
          					console.log(sciName);
          					var taxonRecordName = {};
                    var hierarchy = [];
                    var hierarchyVal = {}; 
                    var scientificName = {};
                    var canonicalName = {};
          					if(id == ''){
          						//call the api
          						/*
          						var temp_name = name.trim().replace(/ /g,"%20");
          						console.log("Scientific Name to search in the GBIF API: "+name);
          						rest.get('http://api.gbif.org/v1/species?name='+temp_name+'&limit=1').on('complete', function(data) {
          							console.log("gbif api for "+ name +JSON.stringify(data));
          							if(data.results.length > 0){
          								var taxonRecordName = {};
          								taxonRecordName.scientificName = {};
          								taxonRecordName.scientificName.canonicalName = {};
          								taxonRecordName.scientificName.canonicalAuthorship = {};
          								taxonRecordName.scientificName.publishedln = {};
  										taxonRecordName.scientificName.simple = (data.results[0].scientificName !== undefined) ? data.results[0].scientificName : '';
										taxonRecordName.scientificName.rank = (data.results[0].rank !== undefined) ? data.results[0].rank : '';
										taxonRecordName.scientificName.canonicalName.simple = (data.results[0].canonicalName !== undefined) ? data.results[0].canonicalName : '';
										taxonRecordName.scientificName.canonicalAuthorship.simple = (data.results[0].authorship !== undefined) ? data.results[0].authorship : '';
										taxonRecordName.scientificName.publishedln.simple = (data.results[0].publishedIn !== undefined) ? data.results[0].publishedIn : '';
										var create_new_record=true;
          							}else{
          								console.log("No results for the name!: " + name);
          								var create_new_record=false;
          							}
          						});
								*/

                    /*
								    taxonRecordName.scientificName.canonicalName = {};
								    taxonRecordName.scientificName.simple = sciName;
								    taxonRecordName.scientificName.canonicalName.simple = canName;
                    taxonRecordName.scientificName.rank = "SPECIES";
                    */
                    
                    scientificName.simple = sciName;
                    scientificName.rank = "SPECIES";
                    canonicalName.simple = canName;
                    scientificName.canonicalName = canonicalName;
                    taxonRecordName.scientificName = scientificName;



                    /*
                    hierarchyVal.kingdom = kingdom;
                    hierarchyVal.phylum = phylum;
                    hierarchyVal.classHierarchy = class_es;
                    hierarchyVal.order = order;
                    hierarchyVal.family = family;
                    hierarchyVal.genus = genus;
                    hierarchyVal.specificEpithet = specificEpithet;
                    hierarchy.push(hierarchyVal);
                    */
								      var create_new_record=true;
                      callback(null,taxonRecordName,id, create_new_record);
          					}else{
          						var create_new_record=false;
          						callback(null,taxonRecordName,id, create_new_record);
          					}
          				},
          				function(taxonRecordName, id, create_new_record, callback){
          					if(create_new_record){
                      console.log(JSON.stringify(taxonRecordName));
          						var id_rc = mongoose.Types.ObjectId();
								      var id_v = mongoose.Types.ObjectId();
                      var taxon_record_name_version = {};
								      taxon_record_name_version._id = id_v;
								      taxon_record_name_version.id_record=id_rc;
								      taxon_record_name_version.created=Date();
								      taxon_record_name_version.state="approved_in_use";
								      taxon_record_name_version.element="taxonRecordName";
								      taxon_record_name_version.id_user="sib+ac@humboldt.org.co";
                      var taxonRecordNameElement = taxon_record_name_version;
                      taxon_record_name_version.taxonRecordName = taxonRecordName;
								      taxon_record_name_version = new TaxonRecordNameVersion(taxon_record_name_version);
								      
								      var ver = 1;
                      var ob_ids= new Array();
                      console.log("!");
								      RecordVersion.create({ _id:id_rc, taxonRecordNameVersion: ob_ids },function(err, doc){
									     if(err){
										    console.log("Error creating a new RecordVersion for the name: " + canName);
										    callback(new Error("Error creating a new RecordVersion for the name: " + canName +" : " + err.message));
									     }else{
                        console.log("Create a new TaxonRecordNameVersion");
                        taxon_record_name_version.version=1;
                        taxon_record_name_version.save(function(err){
                          if(err){
                            console.log("Error creating a new taxonRecordNameVersion for the name: " + canName);
                            callback(new Error("Error creating a new taxonRecordNameVersion for the name: " + canName +" : " + err.message));
                          }else{
                            var update_date = Date();
                            var scientificNameSimple = taxonRecordName.scientificName.simple;
                            Record.create({ _id:id_rc, taxonRecordNameApprovedInUse: taxonRecordName, scientificNameSimple: scientificNameSimple, update_date: update_date, creation_date: update_date},function(err, doc){
                              if(err){
                                console.log("Error creating a new Record for the name: " + canName);
                                callback(new Error("Error creating a new Record for the name: " + canName +" : " + err.message));
                              }else{
                                console.log("Document Record: "+doc);
                                
                              }
                            });
                          }
                        });
									     }
								      });
          					}else{

          					}
          					console.log();
          				}
          			],function (err, result) {
    		
					});

          			/*
          			
          			*/

          		},function(err){
            		if(err){
                  		callback(new Error("Error: "+err));
              		}else{
                  		callback(null, data);
              		}
          		});
        	}

		], function (err, result) {
    		
		});

	}

});