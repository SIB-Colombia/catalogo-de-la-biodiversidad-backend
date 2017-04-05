var mongoose = require('mongoose');
var async = require('async');
var TaxonRecordNameVersion = require('../models/taxonRecordName.js');
var AssociatedPartyVersion = require('../models/associatedParty.js');
var BaseElementsVersion = require('../models/baseElements.js');
var CommonNamesAtomizedVersion = require('../models/commonNamesAtomized.js');
var SynonymsAtomizedVersion = require('../models/synonymsAtomized.js');
var LifeCycleVersion = require('../models/lifeCycle.js');
var LifeFormVersion = require('../models/lifeForm.js');
var IdentificationKeysVersion = require('../models/identificationKeys.js');
var FullDescriptionVersion = require('../models/fullDescription.js');
var BriefDescriptionVersion = require('../models/briefDescription.js');
var AbstractVersion = require('../models/abstract.js');
var HierarchyVersion = require('../models/hierarchy.js');
var ReproductionVersion = require('../models/reproduction.js');
var AnnualCyclesVersion = require('../models/annualCycles.js');
var FeedingVersion = require('../models/feeding.js');
var DispersalVersion = require('../models/dispersal.js');
var BehaviorVersion = require('../models/behavior.js');
var InteractionsVersion = require('../models/interactions.js');
var MolecularDataVersion = require('../models/molecularData.js');
var MigratoryVersion = require('../models/migratory.js');
var HabitatsVersion = require('../models/habitats.js');
var DistributionVersion = require('../models/distribution.js');
var TerritoryVersion = require('../models/territory.js');
var PopulationBiologyVersion = require('../models/populationBiology.js');
var MoreInformationVersion = require('../models/moreInformation.js');
var ThreatStatusVersion = require('../models/threatStatus.js');
var LegislationVersion = require('../models/legislation.js');
var UsesManagementAndConservationVersion = require('../models/usesManagementAndConservation.js');
var DirectThreatsVersion = require('../models/directThreats.js');
var AncillaryDataVersion = require('../models/ancillaryData.js');
var EndemicAtomizedVersion = require('../models/endemicAtomized.js');
var ReferencesVersion = require('../models/references.js');
var EnvironmentalEnvelopeVersion = require('../models/environmentalEnvelope.js');
var EcologicalSignificanceVersion = require('../models/ecologicalSignificance.js');
var InvasivenessVersion = require('../models/invasiveness.js');
var add_objects = require('../models/additionalModels.js');

var value={};
var response=[];
var dataObject ={};

//query = add_objects.RecordVersion.find({}).select('taxonRecordNameVersion associatedPartyVersion').populate('taxonRecordNameVersion associatedPartyVersion').sort({ _id: -1}).limit(1);
query = add_objects.RecordVersion.find({}).select('_id').sort({ _id: -1});

var lastRec ={};

var catalogoDb = mongoose.createConnection('mongodb://localhost:27017/catalogoDbJunio', function(err) {
	if(err) {
    	console.log('connection error', err);
    }else{
    	console.log('connection successful');
    	//var RecordVersion = mongoose.model('RecordVersion').schema;

    	var recordSchema = add_objects.Record.schema;
      var Record = catalogoDb.model('Record', recordSchema );

      var recordVersionSchema = add_objects.RecordVersion.schema;
      var RecordVersion = catalogoDb.model('RecordVersion', recordVersionSchema );

      var taxonSchema = TaxonRecordNameVersion.schema;
      TaxonRecordNameVersion = catalogoDb.model('TaxonRecordNameVersion', taxonSchema );

      var associatedPartySchema = AssociatedPartyVersion.schema;
      AssociatedPartyVersion = catalogoDb.model('AssociatedPartyVersion', associatedPartySchema );

      var commonNamesAtomizedSchema = CommonNamesAtomizedVersion.schema;
      CommonNamesAtomizedVersion = catalogoDb.model('CommonNamesAtomizedVersion', commonNamesAtomizedSchema );

      var synonymsAtomizedSchema = SynonymsAtomizedVersion.schema;
      SynonymsAtomizedVersion = catalogoDb.model('SynonymsAtomizedVersion', synonymsAtomizedSchema );

      var lifeCycleSchema = LifeCycleVersion.schema;
      LifeCycleVersion =  catalogoDb.model('LifeCycleVersion', lifeCycleSchema );

      var lifeFormSchema = LifeFormVersion.schema;
      LifeFormVersion =  catalogoDb.model('LifeFormVersion', lifeFormSchema );

      var identificationKeysSchema = IdentificationKeysVersion.schema;
      IdentificationKeysVersion = catalogoDb.model('IdentificationKeysVersion', identificationKeysSchema );

      var fullDescriptionSchema = FullDescriptionVersion.schema;
      FullDescriptionVersion = catalogoDb.model('FullDescriptionVersion', fullDescriptionSchema );

      var briefDescriptionSchema = BriefDescriptionVersion.schema;
      BriefDescriptionVersion = catalogoDb.model('BriefDescriptionVersion', briefDescriptionSchema );

      var abstractSchema = AbstractVersion.schema;
      AbstractVersion = catalogoDb.model('AbstractVersion', abstractSchema );

      var hierarchySchema = HierarchyVersion.schema;
      HierarchyVersion = catalogoDb.model('HierarchyVersion', hierarchySchema );

      var reproductionSchema = ReproductionVersion.schema;
      ReproductionVersion = catalogoDb.model('ReproductionVersion', reproductionSchema );

      var annualCyclesSchema = AnnualCyclesVersion.schema;
      AnnualCyclesVersion = catalogoDb.model('AnnualCyclesVersion', annualCyclesSchema );

      var feedingSchema = FeedingVersion.schema;
      FeedingVersion = catalogoDb.model('FeedingVersion', feedingSchema );

      var dispersalSchema = DispersalVersion.schema;
      DispersalVersion = catalogoDb.model('DispersalVersion', dispersalSchema );

      var behaviorSchema = BehaviorVersion.schema;
      BehaviorVersion = catalogoDb.model('BehaviorVersion', behaviorSchema );

      var interactionsSchema = InteractionsVersion.schema;
      InteractionsVersion = catalogoDb.model('InteractionsVersion', interactionsSchema );

      var molecularDataSchema = MolecularDataVersion.schema;
      MolecularDataVersion = catalogoDb.model('MolecularDataVersion', molecularDataSchema );

      var migratorySchema = MigratoryVersion.schema;
      MigratoryVersion = catalogoDb.model('MigratoryVersion', migratorySchema );

      var habitatsSchema = HabitatsVersion.schema;
      HabitatsVersion = catalogoDb.model('HabitatsVersion', habitatsSchema );

      var distributionSchema = DistributionVersion.schema;
      DistributionVersion = catalogoDb.model('DistributionVersion', distributionSchema );

      var territorySchema = TerritoryVersion.schema;
      TerritoryVersion = catalogoDb.model('TerritoryVersion', territorySchema );

      var populationBiologySchema = PopulationBiologyVersion.schema;
      PopulationBiologyVersion = catalogoDb.model('PopulationBiologyVersion', populationBiologySchema );

      var moreInformationSchema = MoreInformationVersion.schema;
      MoreInformationVersion = catalogoDb.model('MoreInformationVersion', moreInformationSchema );

      var threatStatusSchema = ThreatStatusVersion.schema;
      ThreatStatusVersion = catalogoDb.model('ThreatStatusVersion', threatStatusSchema );

      var legislationSchema = LegislationVersion.schema;
      LegislationVersion = catalogoDb.model('LegislationVersion', legislationSchema );

      var usesManagementAndConservationSchema = UsesManagementAndConservationVersion.schema;
      UsesManagementAndConservationVersion = catalogoDb.model('UsesManagementAndConservationVersion', usesManagementAndConservationSchema );

      var directThreatsSchema = DirectThreatsVersion.schema;
      DirectThreatsVersion = catalogoDb.model('DirectThreatsVersion', directThreatsSchema );

      var ancillaryDataSchema = AncillaryDataVersion.schema;
      AncillaryDataVersion = catalogoDb.model('AncillaryDataVersion', ancillaryDataSchema );

      var endemicAtomizedSchema = EndemicAtomizedVersion.schema;
      EndemicAtomizedVersion = catalogoDb.model('EndemicAtomizedVersion', endemicAtomizedSchema );

      var referencesSchema = ReferencesVersion.schema;
      ReferencesVersion = catalogoDb.model('ReferencesVersion', referencesSchema );

      var environmentalEnvelopeSchema = EnvironmentalEnvelopeVersion.schema;
      EnvironmentalEnvelopeVersion = catalogoDb.model('EnvironmentalEnvelopeVersion', environmentalEnvelopeSchema );

      var ecologicalSignificanceSchema = EcologicalSignificanceVersion.schema;
      EcologicalSignificanceVersion = catalogoDb.model('EcologicalSignificanceVersion', ecologicalSignificanceSchema );

      var InvasivenessSchema = InvasivenessVersion.schema;
      InvasivenessVersion = catalogoDb.model('InvasivenessVersion', InvasivenessSchema );


    	async.waterfall([
    		function(callback){
    			console.log("***!Execution of the query***");
    			query = RecordVersion.find({}).select('_id').sort({ _id: -1});
    			query.exec(function (err, data) {
        			if(err){
                  console.log("1");
          				callback(new Error("Error getting the total of Records:" + err.message));
        			}else{
                  console.log("2");
          				callback(null, data);
        			}
      			});
    		},
    		function(data,callback){
    			console.log(data.length);
    			async.eachSeries(data, function(record_data, callback){
    				console.log(record_data._id);
            //record_data._id = "56702bfef289f5a40c0cd2ac";
            async.waterfall([
              function(callback){
                //console.log("! "+record_data._id);
                TaxonRecordNameVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("TaxonRecordName");
                  if(err){
                    callback(new Error("Error to get TaxonRecordName element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec._id = mongoose.Types.ObjectId(record_data._id);
                      lastRec.taxonRecordNameAccepted = elementVer;
                    }else{
                      console.log("No existe TaxonRecordNameVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                //console.log("!*");
                AssociatedPartyVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("AssociatedParty");
                  if(err){
                    callback(new Error("Error to get AssociatedParty element for the record with id: "+record_data._id+" : " + err.message));
                  }else{ 
                    if(elementVer){
                      lastRec.associatedPartyAccepted = elementVer;
                    }else{
                      console.log("No exist AssociatedPartyVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                CommonNamesAtomizedVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("CommonNamesAtomized");
                  if(err){
                    console.log(err);
                    callback(new Error("Error to get CommonNamesAtomized element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.commonNamesAtomizedAccepted = elementVer;
                    }else{
                      console.log("No exist CommonNamesAtomizedVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                SynonymsAtomizedVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("SynonymsAtomized");
                  if(err){
                    callback(new Error("Error to get SynonymsAtomized element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.synonymsAtomizedAccepted = elementVer;
                    }else{
                      console.log("No exist SynonymsAtomizedVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                LifeCycleVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("LifeCycle");
                  if(err){
                    callback(new Error("Error to get LifeCycle element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.lifeCycleAccepted = elementVer;
                    }else{
                      console.log("No exist LifeCycleVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                LifeFormVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("LifeForm");
                  if(err){
                    callback(new Error("Error to get LifeForm element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.lifeFormAccepted = elementVer;
                    }else{
                      console.log("No exist LifeFormVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                IdentificationKeysVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("IdentificationKeys");
                  if(err){
                    callback(new Error("Error to get IdentificationKeys element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.identificationKeysAccepted = elementVer;
                    }else{
                      console.log("No exist IdentificationKeysVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                FullDescriptionVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("FullDescription");
                  if(err){
                    callback(new Error("Error to get FullDescription element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.fullDescriptionAccepted = elementVer;
                    }else{
                      console.log("No exist FullDescriptionVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                BriefDescriptionVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("BriefDescription");
                  if(err){
                    callback(new Error("Error to get BriefDescription element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.briefDescriptionAccepted = elementVer;
                    }else{
                      console.log("No exist BriefDescriptionVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                AbstractVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Abstract");
                  if(err){
                    callback(new Error("Error to get Abstract element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.abstractAccepted = elementVer;
                    }else{
                      console.log("No exist AbstractVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                HierarchyVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Hierarchy");
                  if(err){
                    callback(new Error("Error to get Hierarchy element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.hierarchyAccepted = elementVer;
                    }else{
                      console.log("No exist HierarchyVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                ReproductionVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Reproduction");
                  if(err){
                    callback(new Error("Error to get Reproduction element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.reproductionAccepted = elementVer;
                    }else{
                      console.log("No exist ReproductionVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                AnnualCyclesVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("AnnualCycles");
                  if(err){
                    callback(new Error("Error to get AnnualCycles element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.annualCyclesAccepted = elementVer;
                    }else{
                      console.log("No exist AnnualCyclesVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                FeedingVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Feeding");
                  if(err){
                    callback(new Error("Error to get Feeding element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.feedingAccepted = elementVer;
                    }else{
                      console.log("No exist FeedingVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                DispersalVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Dispersal");
                  if(err){
                    callback(new Error("Error to get Dispersal element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.dispersalAccepted = elementVer;
                    }else{
                      console.log("No exist DispersalVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                BehaviorVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Behavior");
                  if(err){
                    callback(new Error("Error to get Behavior element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.behaviorAccepted = elementVer;
                    }else{
                      console.log("No exist BehaviorVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                InteractionsVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Interactions");
                  if(err){
                    callback(new Error("Error to get Interactions element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.interactionsAccepted = elementVer;
                    }else{
                      console.log("No exist InteractionsVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                MolecularDataVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("MolecularData");
                  if(err){
                    callback(new Error("Error to get MolecularData element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.molecularDataAccepted = elementVer;
                    }else{
                      console.log("No exist MolecularDataVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                MigratoryVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Migratory");
                  if(err){
                    callback(new Error("Error to get Migratory element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.migratoryAccepted = elementVer;
                    }else{
                      console.log("No exist MolecularDataVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                HabitatsVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Habitats");
                  if(err){
                    callback(new Error("Error to get Habitats element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.habitatsAccepted = elementVer;
                    }else{
                      console.log("No exist HabitatsVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                DistributionVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Distribution");
                  if(err){
                    callback(new Error("Error to get Distribution element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.distributionAccepted = elementVer;
                    }else{
                      console.log("No exist DistributionVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                TerritoryVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("TerritoryVersion");
                  if(err){
                    callback(new Error("Error to get Territory element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.territoryAccepted = elementVer;
                    }else{
                      console.log("No exist TerritoryVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                PopulationBiologyVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("PopulationBiology");
                  if(err){
                    callback(new Error("Error to get PopulationBiology element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.populationBiologyAccepted = elementVer;
                    }else{
                      console.log("No exist PopulationBiologyVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                MoreInformationVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("MoreInformation");
                  if(err){
                    callback(new Error("Error to get PopulationBiology element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.moreInformationAccepted = elementVer;
                    }else{
                      console.log("No exist MoreInformationVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                ThreatStatusVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("ThreatStatus");
                  if(err){
                    callback(new Error("Error to get ThreatStatus element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.threatStatusAccepted = elementVer;
                    }else{
                      console.log("No exist ThreatStatusVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                LegislationVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("Legislation");
                  if(err){
                    callback(new Error("Error to get Legislation element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.legislationAccepted = elementVer;
                    }else{
                      console.log("No exist LegislationVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                UsesManagementAndConservationVersion.findOne({ "id_record" : mongoose.Types.ObjectId(record_data._id), state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("UsesManagementAndConservation");
                  if(err){
                    callback(new Error("Error to get UsesManagementAndConservation element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.usesManagementAndConservationAccepted = elementVer._doc;
                    }else{
                      console.log("No exist UsesManagementAndConservationVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                DirectThreatsVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("DirectThreats");
                  if(err){
                    callback(new Error("Error to get DirectThreats element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.directThreatsAccepted = elementVer;
                    }else{
                      console.log("No exist DirectThreatsVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                AncillaryDataVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("AncillaryData");
                  if(err){
                    callback(new Error("Error to get AncillaryData element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.ancillaryDataAccepted = elementVer
                    }else{
                      console.log("No exist AncillaryDataVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                EndemicAtomizedVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("EndemicAtomized");
                  if(err){
                    callback(new Error("Error to get EndemicAtomized element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.endemicAtomizedAccepted = elementVer;
                    }else{
                      console.log("No exist EndemicAtomizedVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                
                ReferencesVersion.findOne({ "id_record" : mongoose.Types.ObjectId(record_data._id), state: "accepted" }).exec(function (err, elementVer) {
                  console.log("References");
                  if(err){
                    callback(new Error("Error to get References element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.referencesAccepted = elementVer;
                    }else{
                      console.log("No exist ReferencesVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                EnvironmentalEnvelopeVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  console.log("EnvironmentalEnvelope");
                  if(err){
                    callback(new Error("Error to get EnvironmentalEnvelope element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.environmentalEnvelopeAccepted = elementVer;
                    }else{
                      console.log("No exist EnvironmentalEnvelopeVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                  });
                },
              function(callback){
                EcologicalSignificanceVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  if(err){
                    callback(new Error("Error to get EcologicalSignificance element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.ecologicalSignificanceAccepted = elementVer
                    }else{
                      console.log("No exist EcologicalSignificanceVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                InvasivenessVersion.findOne({ id_record : record_data._id, state: "accepted" }).sort({created: -1}).exec(function (err, elementVer) {
                  if(err){
                    callback(new Error("Error to get Invasiveness element for the record with id: "+record_data._id+" : " + err.message));
                  }else{
                    if(elementVer){
                      lastRec.invasivenessAccepted = elementVer;
                    }else{
                      console.log("No exist InvasivenessVersion for id record : "+record_data._id);
                    }
                    callback();
                  }
                });
              },
              function(callback){
                acceptedRecord = new Record(lastRec);
                acceptedRecord.save(function (err){
                  if(err){
                    console.log("aquí está el error");
                    console.log(err);
                    callback(new Error(err.message));
                  }else{
                    console.log("Saved last accpeted version with id: "+record_data._id);
                    callback();
                  }
                });
              }
            ],function(err, result) {
              if(err){
                callback(new Error("Error"));
              }else{
                //console.log("ok");
                callback();
              }
            });
    			},function(err){
    				if(err){
          				callback(new Error("Error: "+err));
        			}else{
          				callback(null, data);
        			}
    			});
    			//callback(null, data);
    		},
        function(data,callback){
	    		console.log("End cascade");
          catalogoDb=mongoose.disconnect();
	    	}
	    	],
    	   function(err, result) {
      		if(err){
        		console.log(err);
      		}else{
            catalogoDb=mongoose.disconnect();
        		console.log("End of the process");
        		//logger.info('Creation a new AncillaryDataVersion sucess', JSON.stringify({id_record: record_data._id, version: ver, _id: id_v, id_user: user}));
        		//res.json("End of the process");
      		}
    	});
    }

});