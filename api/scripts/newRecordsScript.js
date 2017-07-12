var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var TaxonRecordNameVersion = require('../models/taxonRecordName.js');
var SynonymsAtomizedVersion = require('../models/synonymsAtomized.js');
var CommonNamesAtomizedVersion = require('../models/commonNamesAtomized.js');
var AncillaryDataVersion = require ('../models/ancillaryData.js');
var HierarchyVersion = require('../models/hierarchy.js');
var ThreatStatusVersion = require('../models/threatStatus.js');
var add_objects = require('../models/additionalModels.js');
var parse = require('csv-parse');
var rest = require('restler');
var Schema = mongoose.Schema;

var CatalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDbNewAPI2', function(err) {
	if(err){
		console.log('connection error', err);
	}else{
    console.log('****Initial waterfal async****');
		async.waterfall([
			function(callback){ 
    			console.log("Step 1:Read the csv file ");
        		//RecordModel.find({}).exec(callback);
        		//Leer el archivo, Read the file
        		var data = [];
        		var input = fs.createReadStream('/home/oscar/Desktop/SpeciesCO.csv');
        		var parser = parse({delimiter: '\t'});
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
            console.log('Step 2: Asyn series for each line in the document ');
        		console.log('Number of scientific names to insert: '+data.length);
        		var newRecordSchema = add_objects.Record.schema;
          	var Record = CatalogoDb.model('Record', newRecordSchema );

            var recordVersionSchema = add_objects.RecordVersion.schema;
            var RecordVersion = CatalogoDb.model('RecordVersion', recordVersionSchema );

            var taxonSchema = TaxonRecordNameVersion.schema;
            TaxonRecordNameVersion = CatalogoDb.model('TaxonRecordNameVersion', taxonSchema );

            var hierarchySchema = HierarchyVersion.schema;
            HierarchyVersion = CatalogoDb.model('HierarchyVersion', hierarchySchema );

            var ancillarySchema = AncillaryDataVersion.schema;
            AncillaryDataVersion = CatalogoDb.model('AncillaryDataVersion', ancillarySchema );

            var number_new_records=0;
            var number_images_updated=0;

          	data=data.slice(1, data.length);
              var canName = '';
              var sciName = '';
              var kingdom = '';
              var phylum = '';
              var class_es = '';
              var order = '';
              var family = '';
              var genus = '';
              var specificEpithet = '';
              var Imagen_Thumbnail = '';
              var Imagen_Destacada = '';
          		async.eachSeries(data, function(line, callback) {
                console.log("Values to save");
          			console.log(line);
                //var serialArr = JSON.parse(line);
                //console.log("value 0: "+serialArr[0]);
          			//line = line+"";
          			//specie =line.split(",");
          			canName = line[1];
          			sciName = line[2];
          			kingdom = line[3];
          			phylum = line[4];
          			class_es = line[5];
          			order = line[6];
          			family = line[7];
          			genus = line[8];
                specificEpithet = line[9];
                status = line[10];
          			Imagen_Destacada = line[11];
                Imagen_Thumbnail = line[12];
                rightsHolder = line[13];
                source = line[14];
                license = line[15];
                agent = line[16];

          			console.log("canonical name to search: "+canName);
          			/*
          			var name='zantedeschia aethiopicax';
          			var image = 'test.jpg';
          			*/
          			//console.log(sciName);
                //canName ='zantedeschia aethiopicaxztqwbhlp';
          			var reg_ex = '^'+canName;
                console.log("waterfall for each line");
          			async.waterfall([
          				function(callback){
          					console.log("Step 2.1: Search by canonicalName: "+canName);
          					Record.findOne({'scientificNameSimple': {'$regex' : reg_ex, '$options' : 'i'} }, 'scientificNameSimple', function(err, record){
          						if(err){
          							console.log("Error finding scientificName in the database!: " + canName);
									       callback(new Error("Error to get EcologicalSignificance element for the record with id: "+id+" : " + err.message));
          						}else{	
          							if(record){
                          console.log("!!!Exist a record for the canonicalName: "+canName+" id: "+record._id);
          								callback(null, record._id);
          							}else{
          								console.log("No exist record for the canonicalName: "+canName);
          								callback(null, '');
          							}
          						}
          					});
          				},
          				function(id,callback){
                    console.log("Step 2.2: create new elements and record if not exist Record, in other case search by id: "+id);
          					var taxonRecordName = {};
                    var scientificName = {};
                    var canonicalName = {};
                    var create_new_record = false;
          					if(id == ''){
                      scientificName.simple = sciName;
                      scientificName.rank = "SPECIES";
                      canonicalName.simple = canName;
                      scientificName.canonicalName = canonicalName;
                      taxonRecordName.scientificName = scientificName;
								      var create_new_record=true;
          					}
                    callback(null,taxonRecordName,id, create_new_record);
          				},
          				function(taxonRecordName, id, create_new_record, callback){
                    console.log("Step 2.2: create a new Record?:"+create_new_record +" id: "+id);
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
                      ob_ids.push(id_v);
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
                            Record.create({ _id:id_rc, taxonRecordNameApprovedInUse: taxon_record_name_version, scientificNameSimple: scientificNameSimple, update_date: update_date, creation_date: update_date},function(err, doc){
                              if(err){
                                console.log("Error creating a new Record for the name: " + canName);
                                callback(new Error("Error creating a new Record for the name: " + canName +" : " + err.message));
                              }else{
                                number_new_records++;
                                console.log("Created a new Record id: " + id_rc + "; Created a new taxonRecordNameVersion, id: "+id_v);
                                callback(null,id_rc, create_new_record);
                              }
                            });
                          }
                        });
									     }
								      });
          					}else{
                      console.log("Not created a new Record");
                      callback(null,id, create_new_record);
          					}
          				},
                  function(id, create_new_record, callback){
                    console.log("Step 2.3: Create hierarchy object, create a new HierarchyVersion?:"+create_new_record +" id: "+id);
                    var hierarchy = [];
                    var hierarchyVal = {}; 
                    if(create_new_record){
                      console.log(create_new_record);
                      console.log(id);
                      hierarchyVal.kingdom = kingdom;
                      hierarchyVal.phylum = phylum;
                      hierarchyVal.classHierarchy = class_es;
                      hierarchyVal.order = order;
                      hierarchyVal.family = family;
                      hierarchyVal.genus = genus;
                      hierarchyVal.specificEpithet = specificEpithet;
                      hierarchy.push(hierarchyVal); 
                    }
                    callback(null,id, create_new_record, hierarchy);
                  },
                  function(id, create_new_record, hierarchy, callback){
                    console.log("Step 2.4: create a new HierarchyVersion?:"+create_new_record +" id: "+id);
                    //console.log(JSON.stringify(hierarchy));
                    if(create_new_record){
                      var hierarchy_version = {};
                      var id_v = mongoose.Types.ObjectId();
                      hierarchy_version._id = id_v;
                      hierarchy_version.created=Date();
                      hierarchy_version.state="approved_in_use";
                      hierarchy_version.id_user = 'sib+ac@humboldt.org.co';
                      hierarchy_version.element="hierarchy";
                      hierarchy_version.hierarchy = hierarchy;
                      //var elementValue = hierarchy_version.hierarchy;
                      hierarchy_version = new HierarchyVersion(hierarchy_version);
                      var id_v = hierarchy_version._id;
                      async.waterfall([
                        function(callback){
                          hierarchy_version.id_record=id;
                          hierarchy_version.version=1;
                          hierarchy_version.save(function(err){
                            if(err){
                              callback(new Error("failed saving the element version:" + err.message));
                            }else{
                              callback(null, hierarchy_version);
                            }
                          });
                      },
                      function(hierarchy_version, callback){ 
                        console.log("id to update:"+id);
                        RecordVersion.findByIdAndUpdate( id, { $push: { "hierarchyVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
                          if(err){
                            console.log(err.message);
                            callback(new Error("failed added id to RecordVersion:" + err.message));
                          }else{
                            console.log('!!');
                            callback();
                          }
                        });
                      },
                      function(callback){
                        var update_date = Date();
                        Record.update({_id:id},{ hierarchyApprovedInUse: hierarchy_version, update_date: update_date }, function(err, result){
                          if(err){
                            callback(new Error(err.message));
                          }else{
                            callback();
                          }
                        });
                      }
                      ],
                      function(err, result) {
                        if (err) {
                          callback(new Error("failed saving HierarchyVersion for the new record:" + err.message));
                        }else{
                          console.log("Created a new HierarchyVersion id: " +id_v);
                          callback(null, id, create_new_record);
                        }      
                      });
                    }else{
                      callback(null, id, create_new_record);
                    }
                  },
                  function(id, create_new_record, callback){
                    console.log("Step 2.5: Update image for a new Record?:"+create_new_record +" id: "+id);
                    console.log("id to update image: "+id);
                    if((Imagen_Destacada == '')&&(Imagen_Thumbnail == '')){
                      console.log('Not exists images to update or save');
                      callback();
                    }else{
                      var ancillaryData = [];
                      var mediaURL = [];
                      var ancillaryDataValue = {};
                      ancillaryDataValue.source = source;
                      ancillaryDataValue.thumbnailURL = Imagen_Thumbnail;
                      mediaURL.push(Imagen_Destacada);
                      ancillaryDataValue.mediaURL = mediaURL;
                      ancillaryDataValue.rightsHolder = rightsHolder;
                      ancillaryDataValue.license = license;
                      ancillaryData.push(ancillaryDataValue);
                      var imageInfo = {};
                      imageInfo.mainImage = Imagen_Destacada;
                      imageInfo.thumbnailImage = Imagen_Thumbnail;
                      imageInfo.source = source;
                      imageInfo.rightsHolder = rightsHolder;
                      imageInfo.license = license;
                      console.log(JSON.stringify(ancillaryData));
                      var ancillary_data_version = {}
                      var id_v = mongoose.Types.ObjectId();
                      ancillary_data_version._id = id_v;
                      ancillary_data_version.created=Date();
                      ancillary_data_version.state="approved_in_use";
                      ancillary_data_version.element="ancillaryData";
                      ancillary_data_version.id_user = 'sib+ac@humboldt.org.co';
                      ancillary_data_version.ancillaryData = ancillaryData;
                      ancillary_data_version = new AncillaryDataVersion(ancillary_data_version);
                      async.waterfall([
                        function(callback){ 
                          if(create_new_record){
                            var data ={};
                            callback(null, data);
                          }else{
                            RecordVersion.findById(id , function (err, data){
                              if(err){
                                callback(new Error("The Record (Ficha) with id: "+id+" doesn't exist.:" + err.message));
                              }else{
                                console.log("Found a record for the id: "+id);
                                callback(null, data);
                              }
                            });
                          }
                        },
                        function(data,callback){
                          if(create_new_record){
                            console.log("!");
                            ancillary_data_version.id_record=id;
                            ancillary_data_version.version=1;
                            callback(null, ancillary_data_version);
                          }else{
                            console.log("!*")
                            if(data.ancillaryDataVersion && data.ancillaryDataVersion.length !=0){
                              var lenancillaryData = data.ancillaryDataVersion.length;
                              var idLast = data.ancillaryDataVersion[lenancillaryData-1];
                              AncillaryDataVersion.findById(idLast , function (err, doc){
                                if(err){
                                  callback(new Error("failed getting the last version of ancillaryDataVersion:" + err.message));
                                }else{
                                  ancillary_data_version.id_record=id;
                                  ancillary_data_version.version=lenancillaryData+1;
                                  callback(null, ancillary_data_version);
                                }
                              });
                            }else{
                              ancillary_data_version.id_record=id;
                              ancillary_data_version.version=1;
                              callback(null, ancillary_data_version);
                            }
                          }
                        },
                        function(ancillary_data_version, callback){ 
                          ver = ancillary_data_version.version;
                          ancillary_data_version.save(function(err){
                            if(err){
                              callback(new Error("failed saving the element version:" + err.message));
                            }else{
                              console.log("saved new AncillaryDataVersion");
                              callback(null, ancillary_data_version);
                            }
                          });
                        },
                        function(ancillary_data_version, callback){ 
                          RecordVersion.findByIdAndUpdate( id, { $push: { "ancillaryDataVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
                            if(err){
                              callback(new Error("failed added id to RecordVersion:" + err.message));
                            }else{
                              callback(null, id);
                            }
                          });
                        },
                        function(id, callback){
                          //Record.update({_id:id, imageThumbnail:{$exists: true}, imageMain:{$exists: true}},{ imageThumbnail: Imagen_Thumbnail, imageMain:Imagen_Destacada }, function(err, result){
                          console.log("Update Record images");  
                          Record.update({_id:id, imageInfo:{$exists: false} },{ ancillaryDataApprovedInUse: ancillary_data_version, imageInfo: imageInfo }, function(err, result){
                            if(err){
                              callback(new Error(err.message));
                            }else{
                              number_images_updated++;
                              callback();
                            }
                          });
                        }
                      ],
                      function(err, result) {
                        if (err) {
                          callback(new Error("failed saving AncillaryDataVersion:  " + err.message));
                        }else{
                          console.log('Creation a new AncillaryDataVersion sucess for the record:'+id);
                          callback();
                        }      
                      })
                    }
                  },
                  function(callback){
                    console.log("Saved info for: "+canName);
                    callback();
                  }
          			],function (err, result) {
                  if(err){
                      callback(new Error("Error: "+err));
                  }else{
                      callback(null, data);
                  }
					      });
          		},function(err){
            		if(err){
                  		callback(new Error("Error: "+err));
              	}else{
                  		callback(null, data);
              	}
          		});
            console.log("Number: "+number_new_records);
        	}
		], function (err, result) {
    		if(err){
          console.log(err);
        }else{
          console.log("Disconnect the database");
          catalogoDb=mongoose.disconnect();
          console.log("End of the process");
        }
		});
	}
});