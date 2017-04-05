var mongoose = require('mongoose');
var async = require('async');
var TaxonRecordNameVersion = require('../models/taxonRecordName.js');
var MoreInformationVersion = require('../models/moreInformation.js');
var DirectThreatsVersion = require('../models/directThreats.js');
var AssociatedPartyVersion = require('../models/associatedParty.js');
var SynonymsAtomizedVersion = require('../models/synonymsAtomized.js');
var CommonNamesAtomizedVersion = require('../models/commonNamesAtomized.js');
var HierarchyVersion = require('../models/hierarchy.js');
var BriefDescriptionVersion = require('../models/briefDescription.js');
var AbstractVersion = require('../models/abstract.js');
var FullDescriptionVersion = require('../models/fullDescription.js');
var IdentificationKeysVersion = require('../models/identificationKeys.js');
var LifeFormVersion = require('../models/lifeForm.js');
var LifeCycleVersion = require('../models/lifeCycle.js');
var ReproductionVersion = require('../models/reproduction.js');
var AnnualCyclesVersion = require('../models/annualCycles.js');
var MolecularDataVersion = require('../models/molecularData.js');
var MigratoryVersion = require('../models/migratory.js');
var EcologicalSignificanceVersion = require('../models/ecologicalSignificance.js');
var EnvironmentalEnvelopeVersion = require('../models/environmentalEnvelope.js');
var InvasivenessVersion = require('../models/invasiveness.js');
var FeedingVersion = require('../models/feeding.js');
var DispersalVersion = require('../models/dispersal.js');
var BehaviorVersion = require('../models/behavior.js');
var InteractionsVersion = require('../models/interactions.js');
var HabitatsVersion = require('../models/habitats.js');
var DistributionVersion = require('../models/distribution.js');
var TerritoryVersion = require('../models/territory.js');
var PopulationBiologyVersion = require('../models/populationBiology.js');
var ThreatStatusVersion = require('../models/threatStatus.js');
var LegislationVersion = require('../models/legislation.js');
var UsesManagementAndConservationVersion = require('../models/usesManagementAndConservation.js');
var ReferencesVersion = require('../models/references.js');
var AncillaryDataVersion = require('../models/ancillaryData.js');
var EndemicAtomizedVersion = require('../models/endemicAtomized.js');
var add_objects = require('../models/additionalModels.js');
//var direct_threats = require('../migration/directThreatsMg.js');
var Schema = mongoose.Schema;



  var editorDb = mongoose.createConnection('mongodb://localhost:27017/editorDb', function(err) {
    if(err) {
      console.log('connection error', err);
    } else {
      console.log('connection successful');
      var recordSchema = new Schema({name:String}, { strict: false, versionKey: false });
      var RecordModel = editorDb.model('Record', recordSchema);

      async.waterfall([
        function(callback){ 
          RecordModel.find({}).exec(callback);
        },
        function(data,callback){ 
          var dataN = data;
          console.log("Number of records: "+data.length);
          console.log("***Saving RecordVersion and taxonRecordName***");
          var catalogoDb=editorDb.useDb("catalogoDbTest");
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var texSchema = TaxonRecordNameVersion.schema;
          var TaxonRecordNameVersionModel = catalogoDb.model('TaxonRecordNameVersion', texSchema );
          var ob_ids= new Array();

          async.eachSeries(data, function(record, callback) {
            console.log("ID record: "+record._id);
            var taxon_record_name_version = {};
            ob_ids= new Array();
            taxon_record_name_version.taxonRecordName = record._doc.taxonRecordName;
            taxon_record_name_version._id = mongoose.Types.ObjectId();
            taxon_record_name_version.id_record=record._id;
            taxon_record_name_version.created=record._id.getTimestamp(); //***
            taxon_record_name_version.id_user="sib+ac@humboldt.org.co";
            taxon_record_name_version.state="accepted";
            taxon_record_name_version.element="taxonRecordName";
            if(taxon_record_name_version.taxonRecordName.scientificName.attributes.id == ""){
              //taxon_record_name_version.taxonRecordName.scientificName.attributes.id = 0;
              delete taxon_record_name_version.taxonRecordName.scientificName.attributes.id;
            }
            taxon_record_name_version = new TaxonRecordNameVersionModel(taxon_record_name_version);
            var id_v = taxon_record_name_version._id;
            var id_rc = taxon_record_name_version.id_record;
            var ver = 1; //**
            ob_ids.push(id_v);
            if(typeof  taxon_record_name_version.taxonRecordName!=="undefined" && taxon_record_name_version.taxonRecordName!=""){
              newRecordModel.create({ _id:id_rc, taxonRecordNameVersion: ob_ids },function(err, doc){
              if(err){
                console.log("Saving taxonRecordName Error!: "+err+" id_record: "+id_rc);
                callback();
              }else{
                taxon_record_name_version.version=1;
                taxon_record_name_version.save(function(err){
                  if(err){
                    console.log("Saving taxonRecordName Error!: "+err+" id_record: "+id_rc);
                    callback();
                  }else{
                    console.log({ message: 'Created a new Record and Save TaxonRecordNameVersion', element: 'TaxonRecordName', version : ver, _id: id_v, id_record : id_rc });
                    callback();
                  }
                });
              }  
              });
            }else{
              console.log({message: "Empty data in version of the element taxonRecordName, id_record: "+id_rc});
              callback();
            }
          }, function(err){
              // if any of the file processing produced an error, err would equal that error
              if( err ) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('A file failed to process');
              } else {
                console.log('All files have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving directThreats***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var directThreatsSchema = DirectThreatsVersion.schema;
          var DirectThreatsVersionModel = catalogoDb.model('DirectThreatsVersion', directThreatsSchema );

          var direct_threats_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var direct_threats_version = {}; 
            ob_ids= new Array();
            direct_threats_version.directThreats = record._doc.directThreats;
            direct_threats_version._id = mongoose.Types.ObjectId();
            direct_threats_version.id_record=record._id;
            direct_threats_version.created=record._id.getTimestamp(); //***
            direct_threats_version.id_user="sib+ac@humboldt.org.co";
            direct_threats_version.state="accepted";
            direct_threats_version.element="directThreats";
            direct_threats_version = new DirectThreatsVersionModel(direct_threats_version);
            var id_v = direct_threats_version._id;
            var id_rc = direct_threats_version.id_record;
            ob_ids.push(id_v);
            if(typeof  direct_threats_version.directThreats!=="undefined" && direct_threats_version.directThreats!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "directThreatsVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving directThreats Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        direct_threats_version.id_record=id_rc;
                        direct_threats_version.version=doc.directThreatsVersion.length+1;
                        var ver = direct_threats_version.version;
                        direct_threats_version.save(function(err){
                          if(err){
                            console.log("Saving directThreats Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save DirectThreatsVersion', element: 'directThreats', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element directThreats, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process element directThreats: '+err);
              } else {
                console.log('All files have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving moreInformation***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var moreInformationSchema = MoreInformationVersion.schema;
          var MoreInformationVersionModel = catalogoDb.model('MoreInformationVersion', moreInformationSchema );
          var more_information_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var more_information_version = {}; 
            ob_ids= new Array();
            more_information_version.moreInformation = record._doc.moreInformation;
            more_information_version._id = mongoose.Types.ObjectId();
            more_information_version.id_record=record._id;
            more_information_version.created=record._id.getTimestamp(); //***
            more_information_version.id_user="sib+ac@humboldt.org.co";
            more_information_version.state="accepted";
            more_information_version.element="moreInformation";
            more_information_version = new MoreInformationVersionModel(more_information_version);
            var id_v = more_information_version._id;
            var id_rc = more_information_version.id_record;
            ob_ids.push(id_v);
            if(typeof  more_information_version.moreInformation!=="undefined" && more_information_version.moreInformation!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "moreInformationVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving moreInformation Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        more_information_version.id_record=id_rc;
                        more_information_version.version=doc.moreInformationVersion.length+1;
                        var ver = more_information_version.version;
                        more_information_version.save(function(err){
                          if(err){
                            console.log("Saving moreInformation Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save MoreInformationVersion', element: 'moreInformation', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element moreInformation, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving moreInformation have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving associatedParty***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var associatedPartySchema = AssociatedPartyVersion.schema;
          var AssociatedPartyVersionModel = catalogoDb.model('AssociatedPartyVersion', associatedPartySchema );
          var associated_party_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var associated_party_version = {}; 
            ob_ids= new Array();
            associated_party_version.associatedParty = record._doc.associatedParty;
            associated_party_version._id = mongoose.Types.ObjectId();
            associated_party_version.id_record=record._id;
            associated_party_version.created=record._id.getTimestamp(); //***
            associated_party_version.id_user="sib+ac@humboldt.org.co";
            associated_party_version.state="accepted";
            associated_party_version.element="associatedParty";
            associated_party_version = new AssociatedPartyVersionModel(associated_party_version);
            var id_v = associated_party_version._id;
            var id_rc = associated_party_version.id_record;
            ob_ids.push(id_v);
            if(typeof  associated_party_version.associatedParty!=="undefined" && associated_party_version.associatedParty!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "associatedPartyVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving associatedParty Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        associated_party_version.id_record=id_rc;
                        associated_party_version.version=doc.associatedPartyVersion.length+1;
                        var ver = associated_party_version.version;
                        associated_party_version.save(function(err){
                          if(err){
                            console.log("Saving associatedParty Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save AssociatedPartyVersion', element: 'associatedParty', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element associatedParty, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving associatedParty have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving synonymsAtomized***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var synonymsAtomizedSchema = SynonymsAtomizedVersion.schema;
          var SynonymsAtomizedVersionModel = catalogoDb.model('SynonymsAtomizedVersion', synonymsAtomizedSchema );
          var synonyms_atomized_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var synonyms_atomized_version = {}; 
            ob_ids= new Array();
            synonyms_atomized_version.synonymsAtomized = record._doc.synonymsAtomized;
            synonyms_atomized_version._id = mongoose.Types.ObjectId();
            synonyms_atomized_version.id_record=record._id;
            synonyms_atomized_version.created=record._id.getTimestamp(); //***
            synonyms_atomized_version.id_user="sib+ac@humboldt.org.co";
            synonyms_atomized_version.state="accepted";
            synonyms_atomized_version.element="synonymsAtomized";
            if(typeof synonyms_atomized_version.synonymsAtomized!=="undefined"){
              for(var i=0;i<synonyms_atomized_version.synonymsAtomized.length;i++){
                if(synonyms_atomized_version.synonymsAtomized[i].synonymName.attributes.id== ""){
                  delete synonyms_atomized_version.synonymsAtomized[i].synonymName.attributes.id;
                }
              }
            }
            synonyms_atomized_version = new SynonymsAtomizedVersionModel(synonyms_atomized_version);
            var id_v = synonyms_atomized_version._id;
            var id_rc = synonyms_atomized_version.id_record;
            ob_ids.push(id_v);
            if(typeof  synonyms_atomized_version.synonymsAtomized!=="undefined" && synonyms_atomized_version.synonymsAtomized!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "synonymsAtomizedVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving synonymsAtomized Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        synonyms_atomized_version.id_record=id_rc;
                        synonyms_atomized_version.version=doc.synonymsAtomizedVersion.length+1;
                        var ver = synonyms_atomized_version.version;
                        synonyms_atomized_version.save(function(err){
                          if(err){
                            console.log("Saving synonymsAtomized Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save SynonymsAtomizedVersion', element: 'synonymsAtomized', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element synonymsAtomized, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving synonymsAtomized have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving commonNamesAtomized***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var commonNamesAtomizedSchema = CommonNamesAtomizedVersion.schema;
          var CommonNamesAtomizedVersionModel = catalogoDb.model('CommonNamesAtomizedVersion', commonNamesAtomizedSchema );
          var common_names_atomized = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var common_names_atomized = {};
            ob_ids= new Array(); 
            var elementTemp=record._doc.commonNamesAtomized;
            if(typeof  elementTemp!=="undefined" && elementTemp.length!=0){
              common_names_atomized.commonNamesAtomized=elementTemp;
            }else{
              common_names_atomized.commonNamesAtomized=record._doc.commonNameAtomized;
            }
            common_names_atomized._id = mongoose.Types.ObjectId();
            common_names_atomized.id_record=record._id;
            common_names_atomized.created=record._id.getTimestamp(); //***
            common_names_atomized.id_user="sib+ac@humboldt.org.co";
            common_names_atomized.state="accepted";
            common_names_atomized.element="commonNamesAtomized";
            if(typeof common_names_atomized.commonNamesAtomized!=="undefined"){
              for(var i=0;i<common_names_atomized.commonNamesAtomized.length;i++){
                if(common_names_atomized.commonNamesAtomized[i].usedIn.temporalCoverage.endDate== "" || common_names_atomized.commonNamesAtomized[i].usedIn.temporalCoverage.endDate== ""){
                  delete common_names_atomized.commonNamesAtomized[i].usedIn.temporalCoverage;
                }
              }
            }
            common_names_atomized = new CommonNamesAtomizedVersionModel(common_names_atomized);
            var id_v = common_names_atomized._id;
            var id_rc = common_names_atomized.id_record;
            ob_ids.push(id_v);
            if(typeof  common_names_atomized.commonNamesAtomized!=="undefined" && common_names_atomized.commonNamesAtomized!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "commonNamesAtomizedVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving commonNamesAtomized Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        common_names_atomized.id_record=id_rc;
                        common_names_atomized.version=doc.commonNamesAtomizedVersion.length+1;
                        var ver = common_names_atomized.version;
                        common_names_atomized.save(function(err){
                          if(err){
                            console.log("Saving commonNamesAtomized Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save CommonNamesAtomizedVersion', element: 'commonNamesAtomized', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element commonNamesAtomized, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving commonNamesAtomized have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving hierarchy***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var hierarchySchema = HierarchyVersion.schema;
          var HierarchyVersionModel = catalogoDb.model('HierarchyVersion', hierarchySchema );
          var hierarchy_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var hierarchy_version = {}; 
            ob_ids= new Array();
            hierarchy_version.hierarchy = record._doc.hierarchy;
            hierarchy_version._id = mongoose.Types.ObjectId();
            hierarchy_version.id_record=record._id;
            hierarchy_version.created=record._id.getTimestamp(); //***
            hierarchy_version.id_user="sib+ac@humboldt.org.co";
            hierarchy_version.state="accepted";
            hierarchy_version.element="hierarchy";
            hierarchy_version = new HierarchyVersionModel(hierarchy_version);
            var id_v = hierarchy_version._id;
            var id_rc = hierarchy_version.id_record;
            ob_ids.push(id_v);
            if(typeof  hierarchy_version.hierarchy!=="undefined" && hierarchy_version.hierarchy!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "hierarchyVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving hierarchy Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        hierarchy_version.id_record=id_rc;
                        hierarchy_version.version=doc.hierarchyVersion.length+1;
                        var ver = hierarchy_version.version;
                        hierarchy_version.save(function(err){
                          if(err){
                            console.log("Saving hierarchy Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save HierarchyVersion', element: 'hierarchy', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element hierarchy, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving hierarchy have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving briefDescription***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var briefDescriptionSchema = BriefDescriptionVersion.schema;
          var BriefDescriptionVersionModel = catalogoDb.model('BriefDescriptionVersion', briefDescriptionSchema );
          var brief_description_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var brief_description_version = {}; 
            ob_ids= new Array();
            brief_description_version.briefDescription = record._doc.briefDescription;
            brief_description_version._id = mongoose.Types.ObjectId();
            brief_description_version.id_record=record._id;
            brief_description_version.created=record._id.getTimestamp(); //***
            brief_description_version.id_user="sib+ac@humboldt.org.co";
            brief_description_version.state="accepted";
            brief_description_version.element="briefDescription";
            brief_description_version = new BriefDescriptionVersionModel(brief_description_version);
            var id_v = brief_description_version._id;
            var id_rc = brief_description_version.id_record;
            ob_ids.push(id_v);
            if(typeof  brief_description_version.briefDescription!=="undefined" && brief_description_version.briefDescription!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "briefDescriptionVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving briefDescription Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        brief_description_version.id_record=id_rc;
                        brief_description_version.version=doc.briefDescriptionVersion.length+1;
                        var ver = brief_description_version.version;
                        brief_description_version.save(function(err){
                          if(err){
                            console.log("Saving briefDescription Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save BriefDescriptionVersion', element: 'briefDescription', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element briefDescription, id_record: "+id_rc });
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving element briefDescription have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving abstract***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var abstractSchema = AbstractVersion.schema;
          var AbstractVersionModel = catalogoDb.model('AbstractVersion', abstractSchema );
          var abstract_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var abstract_version = {}; 
            ob_ids= new Array();
            abstract_version.abstract = record._doc.abstract;
            abstract_version._id = mongoose.Types.ObjectId();
            abstract_version.id_record=record._id;
            abstract_version.created=record._id.getTimestamp(); //***
            abstract_version.id_user="sib+ac@humboldt.org.co";
            abstract_version.state="accepted";
            abstract_version.element="abstract";
            abstract_version = new AbstractVersionModel(abstract_version);
            var id_v = abstract_version._id;
            var id_rc = abstract_version.id_record;
            ob_ids.push(id_v);
            if(typeof  abstract_version.abstract!=="undefined" && abstract_version.abstract!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "abstractVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving abstract Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        abstract_version.id_record=id_rc;
                        abstract_version.version=doc.abstractVersion.length+1;
                        var ver = abstract_version.version;
                        abstract_version.save(function(err){
                          if(err){
                            console.log("Saving abstract Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save AbstractVersion', element: 'abstract', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element abstract, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A file failed to process');
              } else {
                console.log('All record for saving abstract have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving fullDescription***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var fullDescriptionSchema = FullDescriptionVersion.schema;
          var FullDescriptionVersionModel = catalogoDb.model('FullDescriptionVersion', fullDescriptionSchema );
          var full_description_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var full_description_version = {}; 
            ob_ids= new Array();
            full_description_version.fullDescription = record._doc.fullDescription;
            full_description_version._id = mongoose.Types.ObjectId();
            full_description_version.id_record=record._id;
            full_description_version.created=record._id.getTimestamp(); //***
            full_description_version.id_user="sib+ac@humboldt.org.co";
            full_description_version.state="accepted";
            full_description_version.element="fullDescription";
            if(typeof full_description_version.fullDescription!=="undefined"){
              for(var i=0;i<full_description_version.fullDescription.ancillaryData.length;i++){
                if(full_description_version.fullDescription.ancillaryData[i].modified== ""){
                  delete full_description_version.fullDescription.ancillaryData[i].modified;
                }
                if(full_description_version.fullDescription.ancillaryData[i].created== ""){
                  delete full_description_version.fullDescription.ancillaryData[i].created;
                }
                for(var j=0;j<full_description_version.fullDescription.ancillaryData[i].reference.length;j++){
                  if(full_description_version.fullDescription.ancillaryData[i].reference[j].created == ""){
                    delete full_description_version.fullDescription.ancillaryData[i].reference[j].created;
                  }
                  if(full_description_version.fullDescription.ancillaryData[i].reference[j].last_modified == ""){
                    delete full_description_version.fullDescription.ancillaryData[i].reference[j].last_modified;
                  }
                }
              }
            }
            full_description_version = new FullDescriptionVersionModel(full_description_version);
            var id_v = full_description_version._id;
            var id_rc = full_description_version.id_record;
            ob_ids.push(id_v);
            if(typeof  full_description_version.fullDescription!=="undefined" && full_description_version.fullDescription!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "fullDescriptionVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving fullDescription Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        full_description_version.id_record=id_rc;
                        full_description_version.version=doc.fullDescriptionVersion.length+1;
                        var ver = full_description_version.version;
                        full_description_version.save(function(err){
                          if(err){
                            console.log("Saving fullDescription Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save FullDescriptionVersion', element: 'fullDescription', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element fullDescription, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving fullDescription have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving identificationKeys***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var identificationKeysSchema = IdentificationKeysVersion.schema;
          var IdentificationKeysVersionModel = catalogoDb.model('IdentificationKeysVersion', identificationKeysSchema );
          var identification_keys_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var identification_keys_version = {}; 
            ob_ids= new Array();
            identification_keys_version.identificationKeys = record._doc.identificationKeys;
            identification_keys_version._id = mongoose.Types.ObjectId();
            identification_keys_version.id_record=record._id;
            identification_keys_version.created=record._id.getTimestamp(); //***
            identification_keys_version.id_user="sib+ac@humboldt.org.co";
            identification_keys_version.state="accepted";
            identification_keys_version.element="identificationKeys";
            identification_keys_version = new IdentificationKeysVersionModel(identification_keys_version);
            var id_v = identification_keys_version._id;
            var id_rc = identification_keys_version.id_record;
            ob_ids.push(id_v);
            if(typeof  identification_keys_version.identificationKeys!=="undefined" && identification_keys_version.identificationKeys!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "identificationKeysVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving identificationKeys Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        identification_keys_version.id_record=id_rc;
                        identification_keys_version.version=doc.identificationKeysVersion.length+1;
                        var ver = identification_keys_version.version;
                        identification_keys_version.save(function(err){
                          if(err){
                            console.log("Saving identificationKeys Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save IdentificationKeysVersion', element: 'identificationKeys', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element identificationKeys, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving identificationKeys have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving lifeForm***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var lifeFormSchema = LifeFormVersion.schema;
          var LifeFormVersionModel = catalogoDb.model('LifeFormVersion', lifeFormSchema );
          var life_form_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var life_form_version = {};
            ob_ids= new Array(); 
            life_form_version.lifeForm = record._doc.lifeForm;
            life_form_version._id = mongoose.Types.ObjectId();
            life_form_version.id_record=record._id;
            life_form_version.created=record._id.getTimestamp(); //***
            life_form_version.id_user="sib+ac@humboldt.org.co";
            life_form_version.state="accepted";
            life_form_version.element="lifeForm";
            if(typeof life_form_version.lifeForm!=="undefined"){
              for(var i=0;i<life_form_version.lifeForm.lifeFormAtomized.length;i++){
                if(life_form_version.lifeForm.lifeFormAtomized[i].ancillaryData.modified== ""){
                  delete life_form_version.lifeForm.lifeFormAtomized[i].ancillaryData.modified;
                }
                if(life_form_version.lifeForm.lifeFormAtomized[i].ancillaryData.created== ""){
                  delete life_form_version.lifeForm.lifeFormAtomized[i].ancillaryData.created;
                }
              }
            }
            life_form_version = new LifeFormVersionModel(life_form_version);
            var id_v = life_form_version._id;
            var id_rc = life_form_version.id_record;
            ob_ids.push(id_v);
            if(typeof  life_form_version.lifeForm!=="undefined" && life_form_version.lifeForm!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "lifeFormVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving lifeForm Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        life_form_version.id_record=id_rc;
                        life_form_version.version=doc.lifeFormVersion.length+1;
                        var ver = life_form_version.version;
                        life_form_version.save(function(err){
                          if(err){
                            console.log("Saving lifeForm Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save LifeFormVersion', element: 'lifeForm', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element lifeForm, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving lifeForm have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving lifeCycle***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var lifeCycleSchema = LifeCycleVersion.schema;
          var LifeCycleVersionModel = catalogoDb.model('LifeCycleVersion', lifeCycleSchema );
          var life_cycle_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var life_cycle_version = {}; 
            ob_ids= new Array();
            life_cycle_version.lifeCycle = record._doc.lifeCycle;
            life_cycle_version._id = mongoose.Types.ObjectId();
            life_cycle_version.id_record=record._id;
            life_cycle_version.created=record._id.getTimestamp(); //***
            life_cycle_version.id_user="sib+ac@humboldt.org.co";
            life_cycle_version.state="accepted";
            life_cycle_version.element="lifeCycle";
            life_cycle_version = new LifeCycleVersionModel(life_cycle_version);
            var id_v = life_cycle_version._id;
            var id_rc = life_cycle_version.id_record;
            ob_ids.push(id_v);
            if(typeof  life_cycle_version.lifeCycle!=="undefined" && life_cycle_version.lifeCycle!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "lifeCycleVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving lifeCycle Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        life_cycle_version.id_record=id_rc;
                        life_cycle_version.version=doc.lifeCycleVersion.length+1;
                        var ver = life_cycle_version.version;
                        life_cycle_version.save(function(err){
                          if(err){
                            console.log("Saving lifeCycle Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save LifeCycleVersion', element: 'lifeCycle', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element lifeCycle, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving lifeCycle have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving reproduction***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var reproductionSchema = ReproductionVersion.schema;
          var ReproductionVersionModel = catalogoDb.model('ReproductionVersion', reproductionSchema );
          var reproduction_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var reproduction_version = {}; 
            ob_ids= new Array();
            reproduction_version.reproduction = record._doc.reproduction;
            reproduction_version._id = mongoose.Types.ObjectId();
            reproduction_version.id_record=record._id;
            reproduction_version.created=record._id.getTimestamp(); //***
            reproduction_version.id_user="sib+ac@humboldt.org.co";
            reproduction_version.state="accepted";
            reproduction_version.element="reproduction";
            if(typeof reproduction_version.reproduction!=="undefined"){
              for(var i=0;i<reproduction_version.reproduction.reproductionAtomized.length;i++){
                if(reproduction_version.reproduction.reproductionAtomized[i].ancillaryData.modified == ""){
                  delete reproduction_version.reproduction.reproductionAtomized[i].ancillaryData.modified;
                }
                if(reproduction_version.reproduction.reproductionAtomized[i].ancillaryData.created == ""){
                  delete reproduction_version.reproduction.reproductionAtomized[i].ancillaryData.created;
                }
              }
            }
            reproduction_version = new ReproductionVersionModel(reproduction_version);
            var id_v = reproduction_version._id;
            var id_rc = reproduction_version.id_record;
            ob_ids.push(id_v);
            if(typeof  reproduction_version.reproduction!=="undefined" && reproduction_version.reproduction!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "reproductionVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving reproduction Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        reproduction_version.id_record=id_rc;
                        reproduction_version.version=doc.reproductionVersion.length+1;
                        var ver = reproduction_version.version;
                        reproduction_version.save(function(err){
                          if(err){
                            console.log("Saving reproduction Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save ReproductionVersion', element: 'reproduction', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element reproduction, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving reproduction have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving annualCycles***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var annualCyclesSchema = AnnualCyclesVersion.schema;
          var AnnualCyclesVersionModel = catalogoDb.model('AnnualCyclesVersion', annualCyclesSchema );
          var annual_cycles_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var annual_cycles_version = {}; 
            ob_ids= new Array();
            var elementTemp=record._doc.annualCycles;
            if(typeof  elementTemp!=="undefined" && elementTemp.length!=0){
              annual_cycles_version.annualCycles=elementTemp;
            }else{
              annual_cycles_version.annualCycles=record._doc.annualCycle;
            }
            annual_cycles_version._id = mongoose.Types.ObjectId();
            annual_cycles_version.id_record=record._id;
            annual_cycles_version.created=record._id.getTimestamp(); //***
            annual_cycles_version.id_user="sib+ac@humboldt.org.co";
            annual_cycles_version.state="accepted";
            annual_cycles_version.element="annualCycles";
            annual_cycles_version = new AnnualCyclesVersionModel(annual_cycles_version);
            var id_v = annual_cycles_version._id;
            var id_rc = annual_cycles_version.id_record;
            ob_ids.push(id_v);
            if(typeof  annual_cycles_version.annualCycles!=="undefined" && annual_cycles_version.annualCycles!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "annualCyclesVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving annualCycles Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        annual_cycles_version.id_record=id_rc;
                        annual_cycles_version.version=doc.annualCyclesVersion.length+1;
                        var ver = annual_cycles_version.version;
                        annual_cycles_version.save(function(err){
                          if(err){
                            console.log("Saving annualCycles Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save AnnualCyclesVersion', element: 'annualCycles', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element annualCycles, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving annualCycles have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving molecularData***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var molecularDataSchema = MolecularDataVersion.schema;
          var MolecularDataVersionModel = catalogoDb.model('MolecularDataVersion', molecularDataSchema );
          var molecular_data_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var molecular_data_version = {}; 
            ob_ids= new Array();
            molecular_data_version.molecularData = record._doc.molecularData;
            molecular_data_version._id = mongoose.Types.ObjectId();
            molecular_data_version.id_record=record._id;
            molecular_data_version.created=record._id.getTimestamp(); //***
            molecular_data_version.id_user="sib+ac@humboldt.org.co";
            molecular_data_version.state="accepted";
            molecular_data_version.element="molecularData";
            if(typeof molecular_data_version.molecularData!=="undefined"){
              for(var i=0;i<molecular_data_version.molecularData.ancillaryData.length;i++){
                if(molecular_data_version.molecularData.ancillaryData[i].modified== ""){
                  delete molecular_data_version.molecularData.ancillaryData[i].modified;
                }
                if(molecular_data_version.molecularData.ancillaryData[i].created== ""){
                  delete molecular_data_version.molecularData.ancillaryData[i].created;
                }
                for(var j=0;j<molecular_data_version.molecularData.ancillaryData[i].reference.length;j++){
                  if(molecular_data_version.molecularData.ancillaryData[i].reference[j].created == ""){
                    delete molecular_data_version.molecularData.ancillaryData[i].reference[j].created;
                  }
                  if(molecular_data_version.molecularData.ancillaryData[i].reference[j].last_modified == ""){
                    delete molecular_data_version.molecularData.ancillaryData[i].reference[j].last_modified;
                  }
                }
              }
            }
            molecular_data_version = new MolecularDataVersionModel(molecular_data_version);
            var id_v = molecular_data_version._id;
            var id_rc = molecular_data_version.id_record;
            ob_ids.push(id_v);
            if(typeof  molecular_data_version.molecularData!=="undefined" && molecular_data_version.molecularData!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "molecularDataVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving molecularData Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        molecular_data_version.id_record=id_rc;
                        molecular_data_version.version=doc.molecularDataVersion.length+1;
                        var ver = molecular_data_version.version;
                        molecular_data_version.save(function(err){
                          if(err){
                            console.log("Saving molecularData Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save MolecularDataVersion', element: 'molecularData', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element molecularData, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving molecularData have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving migratory***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var migratorySchema = MigratoryVersion.schema;
          var MigratoryVersionModel = catalogoDb.model('MigratoryVersion', migratorySchema );
          var migratory_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var migratory_version = {}; 
            ob_ids= new Array();
            migratory_version.migratory = record._doc.migratory;
            migratory_version._id = mongoose.Types.ObjectId();
            migratory_version.id_record=record._id;
            migratory_version.created=record._id.getTimestamp(); //***
            migratory_version.id_user="sib+ac@humboldt.org.co";
            migratory_version.state="accepted";
            migratory_version.element="migratory";
            migratory_version = new MigratoryVersionModel(migratory_version);
            var id_v = migratory_version._id;
            var id_rc = migratory_version.id_record;
            ob_ids.push(id_v);
            if(typeof  migratory_version.migratory!=="undefined" && migratory_version.migratory!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "migratoryVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving migratory Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        migratory_version.id_record=id_rc;
                        migratory_version.version=doc.migratoryVersion.length+1;
                        var ver = migratory_version.version;
                        migratory_version.save(function(err){
                          if(err){
                            console.log("Saving migratory Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save MigratoryVersion', element: 'migratory', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element migratory, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving migratory have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving ecologicalSignificance***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var ecologicalSignificanceSchema = EcologicalSignificanceVersion.schema;
          var EcologicalSignificanceVersionModel = catalogoDb.model('EcologicalSignificanceVersion', ecologicalSignificanceSchema );
          var ecological_significance_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var ecological_significance_version = {}; 
            ob_ids= new Array();
            ecological_significance_version.ecologicalSignificance = record._doc.ecologicalSignificance;
            ecological_significance_version._id = mongoose.Types.ObjectId();
            ecological_significance_version.id_record=record._id;
            ecological_significance_version.created=record._id.getTimestamp(); //***
            ecological_significance_version.id_user="sib+ac@humboldt.org.co";
            ecological_significance_version.state="accepted";
            ecological_significance_version.element="ecologicalSignificance";
            ecological_significance_version = new EcologicalSignificanceVersionModel(ecological_significance_version);
            var id_v = ecological_significance_version._id;
            var id_rc = ecological_significance_version.id_record;
            ob_ids.push(id_v);
            if(typeof  ecological_significance_version.ecologicalSignificance!=="undefined" && ecological_significance_version.ecologicalSignificance!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "ecologicalSignificanceVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving ecologicalSignificance Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        ecological_significance_version.id_record=id_rc;
                        ecological_significance_version.version=doc.ecologicalSignificanceVersion.length+1;
                        var ver = ecological_significance_version.version;
                        ecological_significance_version.save(function(err){
                          if(err){
                            console.log("Saving ecologicalSignificance Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save EcologicalSignificanceVersion', element: 'ecologicalSignificance', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element ecologicalSignificance, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving ecologicalSignificance have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving environmentalEnvelope***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var environmentalEnvelopeSchema = EnvironmentalEnvelopeVersion.schema;
          var EnvironmentalEnvelopeVersionModel = catalogoDb.model('EnvironmentalEnvelopeVersion', environmentalEnvelopeSchema );
          var environmental_envelope_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var environmental_envelope_version = {}; 
            ob_ids= new Array();
            environmental_envelope_version.environmentalEnvelope = record._doc.environmentalEnvelope;
            environmental_envelope_version._id = mongoose.Types.ObjectId();
            environmental_envelope_version.id_record=record._id;
            environmental_envelope_version.created=record._id.getTimestamp(); //***
            environmental_envelope_version.id_user="sib+ac@humboldt.org.co";
            environmental_envelope_version.state="accepted";
            environmental_envelope_version.element="environmentalEnvelope";
            environmental_envelope_version = new EnvironmentalEnvelopeVersionModel(environmental_envelope_version);
            var id_v = environmental_envelope_version._id;
            var id_rc = environmental_envelope_version.id_record;
            ob_ids.push(id_v);
            if(typeof  environmental_envelope_version.environmentalEnvelope!=="undefined" && environmental_envelope_version.environmentalEnvelope!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "environmentalEnvelopeVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving environmentalEnvelope Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        environmental_envelope_version.id_record=id_rc;
                        environmental_envelope_version.version=doc.environmentalEnvelopeVersion.length+1;
                        var ver = environmental_envelope_version.version;
                        environmental_envelope_version.save(function(err){
                          if(err){
                            console.log("Saving environmentalEnvelope Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save EnvironmentalEnvelopeVersion', element: 'environmentalEnvelope', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element environmentalEnvelope, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving environmentalEnvelope have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving invasiveness***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var invasivenessSchema = InvasivenessVersion.schema;
          var InvasivenessVersionModel = catalogoDb.model('InvasivenessVersion', invasivenessSchema );
          var invasiveness_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var invasiveness_version = {}; 
            ob_ids= new Array();
            invasiveness_version.invasiveness = record._doc.invasiveness;
            invasiveness_version._id = mongoose.Types.ObjectId();
            invasiveness_version.id_record=record._id;
            invasiveness_version.created=record._id.getTimestamp(); //***
            invasiveness_version.id_user="sib+ac@humboldt.org.co";
            invasiveness_version.state="accepted";
            invasiveness_version.element="invasiveness";
            invasiveness_version = new InvasivenessVersionModel(invasiveness_version);
            var id_v = invasiveness_version._id;
            var id_rc = invasiveness_version.id_record;
            ob_ids.push(id_v);
            if(typeof  invasiveness_version.invasiveness!=="undefined" && invasiveness_version.invasiveness!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "invasivenessVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving invasiveness Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        invasiveness_version.id_record=id_rc;
                        invasiveness_version.version=doc.invasivenessVersion.length+1;
                        var ver = invasiveness_version.version;
                        invasiveness_version.save(function(err){
                          if(err){
                            console.log("Saving invasiveness Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save InvasivenessVersion', element: 'invasiveness', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element invasiveness, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving invasiveness have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving feeding***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var feedingSchema = FeedingVersion.schema;
          var FeedingVersionModel = catalogoDb.model('FeedingVersion', feedingSchema );
          var feeding_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var feeding_version = {}; 
            ob_ids= new Array();
            feeding_version.feeding = record._doc.feeding;
            feeding_version._id = mongoose.Types.ObjectId();
            feeding_version.id_record=record._id;
            feeding_version.created=record._id.getTimestamp(); //***
            feeding_version.id_user="sib+ac@humboldt.org.co";
            feeding_version.state="accepted";
            feeding_version.element="feeding";
            if(typeof feeding_version.feeding!=="undefined"){
              for(var i=0;i<feeding_version.feeding.ancillaryData.length;i++){
                if(feeding_version.feeding.ancillaryData[i].modified== ""){
                  delete feeding_version.feeding.ancillaryData[i].modified;
                }
                if(feeding_version.feeding.ancillaryData[i].created== ""){
                  delete feeding_version.feeding.ancillaryData[i].created;
                }
                for(var j=0;j<feeding_version.feeding.ancillaryData[i].reference.length;j++){
                  if(feeding_version.feeding.ancillaryData[i].reference[j].created == ""){
                    delete feeding_version.feeding.ancillaryData[i].reference[j].created;
                  }
                  if(feeding_version.feeding.ancillaryData[i].reference[j].last_modified == ""){
                    delete feeding_version.feeding.ancillaryData[i].reference[j].last_modified;
                  }
                }
              }
            }
            feeding_version = new FeedingVersionModel(feeding_version);
            var id_v = feeding_version._id;
            var id_rc = feeding_version.id_record;
            ob_ids.push(id_v);
            if(typeof  feeding_version.feeding!=="undefined" && feeding_version.feeding!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "feedingVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving feeding Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        feeding_version.id_record=id_rc;
                        feeding_version.version=doc.feedingVersion.length+1;
                        var ver = feeding_version.version;
                        feeding_version.save(function(err){
                          if(err){
                            console.log("Saving feeding Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save FeedingVersion', element: 'feeding', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element feeding, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving feeding have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving dispersal***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var dispersalSchema = DispersalVersion.schema;
          var DispersalVersionModel = catalogoDb.model('DispersalVersion', dispersalSchema );
          var dispersal_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var dispersal_version = {}; 
            ob_ids= new Array();
            dispersal_version.dispersal = record._doc.dispersal;
            dispersal_version._id = mongoose.Types.ObjectId();
            dispersal_version.id_record=record._id;
            dispersal_version.created=record._id.getTimestamp(); //***
            dispersal_version.id_user="sib+ac@humboldt.org.co";
            dispersal_version.state="accepted";
            dispersal_version.element="dispersal";
            dispersal_version = new DispersalVersionModel(dispersal_version);
            var id_v = dispersal_version._id;
            var id_rc = dispersal_version.id_record;
            ob_ids.push(id_v);
            if(typeof  dispersal_version.dispersal!=="undefined" && dispersal_version.dispersal!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "dispersalVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving dispersal Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        dispersal_version.id_record=id_rc;
                        dispersal_version.version=doc.dispersalVersion.length+1;
                        var ver = dispersal_version.version;
                        dispersal_version.save(function(err){
                          if(err){
                            console.log("Saving dispersal Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save DispersalVersion', element: 'dispersal', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element dispersal, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving dispersal have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("Number of records: "+data.length);
          console.log("***Saving behavior***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var behaviorSchema = BehaviorVersion.schema;
          var BehaviorVersionModel = catalogoDb.model('BehaviorVersion', behaviorSchema );
          var behavior_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var behavior_version = {}; 
            ob_ids= new Array();
            behavior_version.behavior = record._doc.behavior;
            behavior_version._id = mongoose.Types.ObjectId();
            behavior_version.id_record=record._id;
            behavior_version.created=record._id.getTimestamp(); //***
            behavior_version.id_user="sib+ac@humboldt.org.co";
            behavior_version.state="accepted";
            behavior_version.element="behavior";
            behavior_version = new BehaviorVersionModel(behavior_version);
            var id_v = behavior_version._id;
            var id_rc = behavior_version.id_record;
            ob_ids.push(id_v);
            if(typeof  behavior_version.behavior!=="undefined" && behavior_version.behavior!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "behaviorVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving behavior Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        behavior_version.id_record=id_rc;
                        behavior_version.version=doc.behaviorVersion.length+1;
                        var ver = behavior_version.version;
                        behavior_version.save(function(err){
                          if(err){
                            console.log("Saving behavior Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save BehaviorVersion', element: 'behavior', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element behavior, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving behavior have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving interactions***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var interactionsSchema = InteractionsVersion.schema;
          var InteractionsVersionModel = catalogoDb.model('InteractionsVersion', interactionsSchema );
          var interactions_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var interactions_version = {}; 
            ob_ids= new Array();
            interactions_version.interactions = record._doc.interactions;
            interactions_version._id = mongoose.Types.ObjectId();
            interactions_version.id_record=record._id;
            interactions_version.created=record._id.getTimestamp(); //***
            interactions_version.id_user="sib+ac@humboldt.org.co";
            interactions_version.state="accepted";
            interactions_version.element="interactions";
            if(typeof interactions_version.interactions!=="undefined"){
              for(var i=0;i<interactions_version.interactions.ancillaryData.length;i++){
                if(interactions_version.interactions.ancillaryData[i].modified== ""){
                  delete interactions_version.interactions.ancillaryData[i].modified;
                }
                if(interactions_version.interactions.ancillaryData[i].created== ""){
                  delete interactions_version.interactions.ancillaryData[i].created;
                }
                for(var j=0;j<interactions_version.interactions.ancillaryData[i].reference.length;j++){
                  if(interactions_version.interactions.ancillaryData[i].reference[j].created == ""){
                    delete interactions_version.interactions.ancillaryData[i].reference[j].created;
                  }
                  if(interactions_version.interactions.ancillaryData[i].reference[j].last_modified == ""){
                    delete interactions_version.interactions.ancillaryData[i].reference[j].last_modified;
                  }
                }
              }
            }
            interactions_version = new InteractionsVersionModel(interactions_version);
            var id_v = interactions_version._id;
            var id_rc = interactions_version.id_record;
            ob_ids.push(id_v);
            if(typeof  interactions_version.interactions!=="undefined" && interactions_version.interactions!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "interactionsVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving interactions Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        interactions_version.id_record=id_rc;
                        interactions_version.version=doc.interactionsVersion.length+1;
                        var ver = interactions_version.version;
                        interactions_version.save(function(err){
                          if(err){
                            console.log("Saving interactions Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save InteractionsVersion', element: 'interactions', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element interactions, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving interactions have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving habitats***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var habitatsSchema = HabitatsVersion.schema;
          var HabitatsVersionModel = catalogoDb.model('HabitatsVersion', habitatsSchema );
          var habitats_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var habitats_version = {};
            ob_ids= new Array(); 
            var elementTemp = record._doc.habitats;
            if(typeof  elementTemp!=="undefined" && elementTemp.length!=0){
              habitats_version.habitats=elementTemp;
            }else{
              habitats_version.habitats=record._doc.habitat;
            }
            habitats_version._id = mongoose.Types.ObjectId();
            habitats_version.id_record=record._id;
            habitats_version.created=record._id.getTimestamp(); //***
            habitats_version.id_user="sib+ac@humboldt.org.co";
            habitats_version.state="accepted";
            habitats_version.element="habitats";
            habitats_version = new HabitatsVersionModel(habitats_version);
            var id_v = habitats_version._id;
            var id_rc = habitats_version.id_record;
            ob_ids.push(id_v);
            if(typeof  habitats_version.habitats!=="undefined" && habitats_version.habitats!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "habitatsVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving habitats Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        habitats_version.id_record=id_rc;
                        habitats_version.version=doc.habitatsVersion.length+1;
                        var ver = habitats_version.version;
                        habitats_version.save(function(err){
                          if(err){
                            console.log("Saving habitats Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save HabitatsVersion', element: 'habitats', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element habitats, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving habitats have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving distribution***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var distributionSchema = DistributionVersion.schema;
          var DistributionVersionModel = catalogoDb.model('DistributionVersion', distributionSchema );
          var distribution_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var distribution_version = {}; 
            ob_ids= new Array();
            distribution_version.distribution = record._doc.distribution;
            distribution_version._id = mongoose.Types.ObjectId();
            distribution_version.id_record=record._id;
            distribution_version.created=record._id.getTimestamp(); //***
            distribution_version.id_user="sib+ac@humboldt.org.co";
            distribution_version.state="accepted";
            distribution_version.element="distribution";
            distribution_version = new DistributionVersionModel(distribution_version);
            var id_v = distribution_version._id;
            var id_rc = distribution_version.id_record;
            ob_ids.push(id_v);
            if(typeof  distribution_version.distribution!=="undefined" && distribution_version.distribution!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "distributionVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving distribution Error!: "+err+" id_record: "+id_rc);
                      callback();
                      }else{
                        distribution_version.id_record=id_rc;
                        distribution_version.version=doc.distributionVersion.length+1;
                        var ver = distribution_version.version;
                        distribution_version.save(function(err){
                          if(err){
                            console.log("Saving distribution Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save DistributionVersion', element: 'distribution', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element distribution, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving distribution have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving territory***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var territorySchema = TerritoryVersion.schema;
          var TerritoryVersionModel = catalogoDb.model('TerritoryVersion', territorySchema );
          var territory_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var territory_version = {}; 
            ob_ids= new Array();
            territory_version.territory = record._doc.territory;
            territory_version._id = mongoose.Types.ObjectId();
            territory_version.id_record=record._id;
            territory_version.created=record._id.getTimestamp(); //***
            territory_version.id_user="sib+ac@humboldt.org.co";
            territory_version.state="accepted";
            territory_version.element="territory";
            territory_version = new TerritoryVersionModel(territory_version);
            var id_v = territory_version._id;
            var id_rc = territory_version.id_record;
            ob_ids.push(id_v);
            if(typeof  territory_version.territory!=="undefined" && territory_version.territory!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "territoryVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving territory Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        territory_version.id_record=id_rc;
                        territory_version.version=doc.territoryVersion.length+1;
                        var ver = territory_version.version;
                        territory_version.save(function(err){
                          if(err){
                            console.log("Saving territory Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save TerritoryVersion', element: 'territory', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element territory, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving territory have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving populationBiology***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var populationBiologySchema = PopulationBiologyVersion.schema;
          var PopulationBiologyVersionModel = catalogoDb.model('PopulationBiologyVersion', populationBiologySchema );
          var population_biology_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var population_biology_version = {}; 
            ob_ids= new Array();
            population_biology_version.populationBiology = record._doc.populationBiology;
            population_biology_version._id = mongoose.Types.ObjectId();
            population_biology_version.id_record=record._id;
            population_biology_version.created=record._id.getTimestamp(); //***
            population_biology_version.id_user="sib+ac@humboldt.org.co";
            population_biology_version.state="accepted";
            population_biology_version.element="populationBiology";
            population_biology_version = new PopulationBiologyVersionModel(population_biology_version);
            var id_v = population_biology_version._id;
            var id_rc = population_biology_version.id_record;
            ob_ids.push(id_v);
            if(typeof  population_biology_version.populationBiology!=="undefined" && population_biology_version.populationBiology!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "populationBiologyVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving populationBiology Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        population_biology_version.id_record=id_rc;
                        population_biology_version.version=doc.populationBiologyVersion.length+1;
                        var ver = population_biology_version.version;
                        population_biology_version.save(function(err){
                          if(err){
                            console.log("Saving populationBiology Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save PopulationBiologyVersion', element: 'populationBiology', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element populationBiology, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving populationBiology have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving threatStatus***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var threatStatusSchema = ThreatStatusVersion.schema;
          var ThreatStatusVersionModel = catalogoDb.model('ThreatStatusVersion', threatStatusSchema );
          var threat_status_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var threat_status_version = {}; 
            ob_ids= new Array();
            threat_status_version.threatStatus = record._doc.threatStatus;
            threat_status_version._id = mongoose.Types.ObjectId();
            threat_status_version.id_record=record._id;
            threat_status_version.created=record._id.getTimestamp(); //***
            threat_status_version.id_user="sib+ac@humboldt.org.co";
            threat_status_version.state="accepted";
            threat_status_version.element="threatStatus";
            threat_status_version = new ThreatStatusVersionModel(threat_status_version);
            var id_v = threat_status_version._id;
            var id_rc = threat_status_version.id_record;
            ob_ids.push(id_v);
            if(typeof  threat_status_version.threatStatus!=="undefined" && threat_status_version.threatStatus!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "threatStatusVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving threatStatus Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        threat_status_version.id_record=id_rc;
                        threat_status_version.version=doc.threatStatusVersion.length+1;
                        var ver = threat_status_version.version;
                        threat_status_version.save(function(err){
                          if(err){
                            console.log("Saving threatStatus Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save ThreatStatusVersion', element: 'threatStatus', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element threatStatus, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving threatStatus have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving legislation***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var legislationSchema = LegislationVersion.schema;
          var LegislationVersionModel = catalogoDb.model('LegislationVersion', legislationSchema );
          var legislation_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var legislation_version = {}; 
            ob_ids= new Array();
            legislation_version.legislation = record._doc.legislation;
            legislation_version._id = mongoose.Types.ObjectId();
            legislation_version.id_record=record._id;
            legislation_version.created=record._id.getTimestamp(); //***
            legislation_version.id_user="sib+ac@humboldt.org.co";
            legislation_version.state="accepted";
            legislation_version.element="legislation";
            legislation_version = new LegislationVersionModel(legislation_version);
            var id_v = legislation_version._id;
            var id_rc = legislation_version.id_record;
            ob_ids.push(id_v);
            if(typeof  legislation_version.legislation!=="undefined" && legislation_version.legislation!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "legislationVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving legislation Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        legislation_version.id_record=id_rc;
                        legislation_version.version=doc.legislationVersion.length+1;
                        var ver = legislation_version.version;
                        legislation_version.save(function(err){
                          if(err){
                            console.log("Saving legislation Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save LegislationVersion', element: 'legislation', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element legislation, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving legislation have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving usesManagementAndConservation***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var usesManagementAndConservationSchema = UsesManagementAndConservationVersion.schema;
          var UsesManagementAndConservationVersionModel = catalogoDb.model('UsesManagementAndConservationVersion', usesManagementAndConservationSchema );
          var uses_management_and_conservation_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var uses_management_and_conservation_version = {}; 
            ob_ids= new Array();
            uses_management_and_conservation_version.usesManagementAndConservation = record._doc.usesManagementAndConservation;
            uses_management_and_conservation_version._id = mongoose.Types.ObjectId();
            uses_management_and_conservation_version.id_record=record._id;
            uses_management_and_conservation_version.created=record._id.getTimestamp(); //***
            uses_management_and_conservation_version.id_user="sib+ac@humboldt.org.co";
            uses_management_and_conservation_version.state="accepted";
            uses_management_and_conservation_version.element="usesManagementAndConservation";
            uses_management_and_conservation_version = new UsesManagementAndConservationVersionModel(uses_management_and_conservation_version);
            var id_v = uses_management_and_conservation_version._id;
            var id_rc = uses_management_and_conservation_version.id_record;
            ob_ids.push(id_v);
            if(typeof  uses_management_and_conservation_version.usesManagementAndConservation!=="undefined" && uses_management_and_conservation_version.usesManagementAndConservation!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "usesManagementAndConservationVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving usesManagementAndConservation Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        uses_management_and_conservation_version.id_record=id_rc;
                        uses_management_and_conservation_version.version=doc.usesManagementAndConservationVersion.length+1;
                        var ver = uses_management_and_conservation_version.version;
                        uses_management_and_conservation_version.save(function(err){
                          if(err){
                            console.log("Saving usesManagementAndConservation Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save UsesManagementAndConservationVersion', element: 'usesManagementAndConservation', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element usesManagementAndConservation, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving usesManagementAndConservation have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving references***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var referencesSchema = ReferencesVersion.schema;
          var ReferencesVersionModel = catalogoDb.model('ReferencesVersion', referencesSchema );
          var references_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var references_version = {}; 
            ob_ids= new Array();
            references_version.references = record._doc.references;
            references_version._id = mongoose.Types.ObjectId();
            references_version.id_record=record._id;
            references_version.created=record._id.getTimestamp(); //***
            references_version.id_user="sib+ac@humboldt.org.co";
            references_version.state="accepted";
            references_version.element="references";
            references_version = new ReferencesVersionModel(references_version);
            var id_v = references_version._id;
            var id_rc = references_version.id_record;
            ob_ids.push(id_v);
            if(typeof  references_version.references!=="undefined" && references_version.references!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "referencesVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving references Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        references_version.id_record=id_rc;
                        references_version.version=doc.referencesVersion.length+1;
                        var ver = references_version.version;
                        references_version.save(function(err){
                          if(err){
                            console.log("Saving references Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save ReferencesVersion', element: 'references', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element references, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving references have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving ancillaryData***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var ancillaryDataSchema = AncillaryDataVersion.schema;
          var AncillaryDataVersionModel = catalogoDb.model('AncillaryDataVersion', ancillaryDataSchema );
          var ancillary_data_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var ancillary_data_version = {}; 
            ob_ids= new Array();
            ancillary_data_version.ancillaryData = record._doc.ancillaryData;
            ancillary_data_version._id = mongoose.Types.ObjectId();
            ancillary_data_version.id_record=record._id;
            ancillary_data_version.created=record._id.getTimestamp(); //***
            ancillary_data_version.id_user="sib+ac@humboldt.org.co";
            ancillary_data_version.state="accepted";
            ancillary_data_version.element="ancillaryData";
            /*
            for(var i=0;i<ancillary_data_version.ancillaryData.length;i++){
              if(ancillary_data_version.ancillaryData[i].modified==""){
                ancillary_data_version.ancillaryData[i].modified = Date();
              }
              if(ancillary_data_version.ancillaryData[i].created==""){
                ancillary_data_version.ancillaryData[i].created = Date();
              }
            }
            */
            ancillary_data_version = new AncillaryDataVersionModel(ancillary_data_version);
            var id_v = ancillary_data_version._id;
            var id_rc = ancillary_data_version.id_record;
            ob_ids.push(id_v);
            if(typeof  ancillary_data_version.ancillaryData!=="undefined" && ancillary_data_version.ancillaryData!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "ancillaryDataVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving ancillaryData Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        ancillary_data_version.id_record=id_rc;
                        ancillary_data_version.version=doc.ancillaryDataVersion.length+1;
                        var ver = ancillary_data_version.version;
                        ancillary_data_version.save(function(err){
                          if(err){
                            console.log("Saving ancillaryData Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save AncillaryDataVersion', element: 'ancillaryData', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element ancillaryData, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving ancillaryData have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          console.log("***Saving endemicAtomized***");
          var dataN = data;
          var newRecordSchema = add_objects.RecordVersion.schema;
          var newRecordModel = catalogoDb.model('RecordVersion', newRecordSchema );

          var endemicAtomizedSchema = EndemicAtomizedVersion.schema;
          var EndemicAtomizedVersionModel = catalogoDb.model('EndemicAtomizedVersion', endemicAtomizedSchema );
          var endemic_atomized_version = {}; 
          var ob_ids= new Array();
          async.eachSeries(data, function(record, callback) {
            var endemic_atomized_version = {}; 
            ob_ids= new Array();
            endemic_atomized_version.endemicAtomized = record._doc.endemicAtomized;
            endemic_atomized_version._id = mongoose.Types.ObjectId();
            endemic_atomized_version.id_record=record._id;
            endemic_atomized_version.created=record._id.getTimestamp(); //***
            endemic_atomized_version.id_user="sib+ac@humboldt.org.co";
            endemic_atomized_version.state="accepted";
            endemic_atomized_version.element="endemicAtomized";
            endemic_atomized_version = new EndemicAtomizedVersionModel(endemic_atomized_version);
            var id_v = endemic_atomized_version._id;
            var id_rc = endemic_atomized_version.id_record;
            ob_ids.push(id_v);
            if(typeof  endemic_atomized_version.endemicAtomized!=="undefined" && endemic_atomized_version.endemicAtomized!=""){
              newRecordModel.count({ _id : id_rc }, function (err, count){
                if(typeof count!=="undefined"){
                  if(count==0){
                    console.log({message: "The Record (Ficha) with id: "+id_rc+" doesn't exist."});
                  }else{
                    newRecordModel.findByIdAndUpdate( id_rc, { $push: { "endemicAtomizedVersion": id_v } },{safe: true, upsert: true},function(err, doc) {
                      if (err){
                        console.log("Saving endemicAtomized Error!: "+err+" id_record: "+id_rc);
                        callback();
                      }else{
                        endemic_atomized_version.id_record=id_rc;
                        endemic_atomized_version.version=doc.endemicAtomizedVersion.length+1;
                        var ver = endemic_atomized_version.version;
                        endemic_atomized_version.save(function(err){
                          if(err){
                            console.log("Saving endemicAtomized Error!: "+err+" id_record: "+id_rc);
                            callback();
                          }else{
                            console.log({ message: 'Save EndemicAtomizedVersion', element: 'endemicAtomized', version : ver, _id: id_v, id_record : id_rc });
                            callback();
                          }
                        });
                      }
                    });
                  }
                }
              });
            }else{
              console.log({message: "Empty data in version of the element endemicAtomized, id_record: "+id_rc});
              callback();
            }
          },function(err){
              if( err ) {
                console.log('A record failed to process');
              } else {
                console.log('All record for saving endemicAtomized have been processed successfully');
                callback(null, dataN, catalogoDb);
              }
          });
        },
        function(data, catalogoDb,callback){ 
          editorDb=mongoose.disconnect();
        },
        function(callback){ 
          editorDb=mongoose.disconnect();
        },
        function(err, result) {
          if (err) {
            console.log("Error: "+err);
          }else{
            console.log('done!');
          }
        }
      ]);
    }
  });





