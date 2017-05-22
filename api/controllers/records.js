import mongoose from 'mongoose';
import async from 'async';
import winston from 'winston';
import mongoosePaginate from 'mongoose-paginate';
import TaxonRecordNameVersion from '../models/taxonRecordName.js';
import add_objects from '../models/additionalModels.js';
import mapElements from '../models/elementNames.js';
import Property from '../models/property.js';
import { logger }  from '../../server/log';

mongoose.Promise = require('bluebird');

function completeLastRecordTest(req, res) {
  var id_rc=req.swagger.params.id.value;
  add_objects.Record.findById(id_rc,function(err, result){
    if(err){
      logger.error('Error getting the complete last Record', JSON.stringify({ message:err }) );
      res.send("Error getting the complete last Record: "+err);
    }else{
      if(!(result == null)){
        res.json(result);
      }else{
        res.send("Didn't find any record for the indicated id: "+id_rc);
      }
    }
  });
}


/*
  Returns the last version of a record according to id
 */
function lastRecord(req, res) {
  var id_rc=req.swagger.params.id.value;
  var lastRec={};
  add_objects.Record.findById(id_rc,function(err, result){
          if(err){
            logger.error('Error getting the last Record', JSON.stringify({ message:err }) );
            res.send("Error: "+err);
          }else{
            if(!(result == null)){
              if(!(result._doc.associatedPartyApprovedInUse == null)){
                lastRec.associatedParty = result._doc.associatedPartyApprovedInUse.associatedParty;
              }
              
              if(!(result._doc.commonNamesAtomizedApprovedInUse == null)){
                lastRec.commonNamesAtomized = result._doc.commonNamesAtomizedApprovedInUse.commonNamesAtomized;
              }

              if(!(result._doc.synonymsAtomizedApprovedInUse == null)){
                lastRec.synonymsAtomized = result._doc.synonymsAtomizedApprovedInUse.synonymsAtomized;
              }

              if(!(result._doc.taxonRecordNameApprovedInUse == null)){
                lastRec.taxonRecordName = result._doc.taxonRecordNameApprovedInUse.taxonRecordName;
              }

              if(!(result._doc.lifeCycleApprovedInUse == null)){
                lastRec.lifeCycle = result._doc.lifeCycleApprovedInUse.lifeCycle;
              }

              if(!(result._doc.lifeFormApprovedInUse == null)){
                lastRec.lifeForm = result._doc.lifeFormApprovedInUse.lifeForm;
              }

              if(!(result._doc.identificationKeysApprovedInUse == null)){
                lastRec.identificationKeys = result._doc.identificationKeysApprovedInUse.identificationKeys;
              }

              if(!(result._doc.fullDescriptionApprovedInUse == null)){
                lastRec.fullDescription = result._doc.fullDescriptionApprovedInUse.fullDescription;
              }

              if(!(result._doc.briefDescriptionApprovedInUse == null)){
                lastRec.briefDescription = result._doc.briefDescriptionApprovedInUse.briefDescription;
              }

              if(!(result._doc.abstractApprovedInUse == null)){
                lastRec.abstract = result._doc.abstractApprovedInUse.abstract;
              }

              if(!(result._doc.hierarchyApprovedInUse == null)){
                lastRec.hierarchy = result._doc.hierarchyApprovedInUse.hierarchy;
              }

              if(!(result._doc.reproductionApprovedInUse == null)){
                lastRec.reproduction = result._doc.reproductionApprovedInUse.reproduction;
              }

              if(!(result._doc.annualCyclesApprovedInUse == null)){
                lastRec.annualCycles = result._doc.annualCyclesApprovedInUse.annualCycles;
              }

              if(!(result._doc.feedingApprovedInUse == null)){
                lastRec.feeding = result._doc.feedingApprovedInUse.feeding;
              }

              if(!(result._doc.dispersalApprovedInUse == null)){
                lastRec.dispersal = result._doc.dispersalApprovedInUse.dispersal;
              }

              if(!(result._doc.behaviorApprovedInUse == null)){
                lastRec.behavior = result._doc.behaviorApprovedInUse.behavior;
              }

              if(!(result._doc.interactionsApprovedInUse == null)){
                lastRec.interactions = result._doc.interactionsApprovedInUse.interactions;
              }

              if(!(result._doc.molecularDataApprovedInUse == null)){
                lastRec.molecularData = result._doc.molecularDataApprovedInUse.molecularData;
              }

              if(!(result._doc.migratoryApprovedInUse == null)){
                lastRec.migratory = result._doc.migratoryApprovedInUse.migratory;
              }

              if(!(result._doc.habitatsApprovedInUse == null)){
                lastRec.habitats = result._doc.habitatsApprovedInUse.habitats;
              }

              if(!(result._doc.distributionApprovedInUse == null)){
                lastRec.distribution = result._doc.distributionApprovedInUse.distribution;
              }

              if(!(result._doc.territoryApprovedInUse == null)){
                lastRec.territory = result._doc.territoryApprovedInUse.territory;
              }

              if(!(result._doc.populationBiologyApprovedInUse == null)){
                lastRec.populationBiology = result._doc.populationBiologyApprovedInUse.populationBiology;
              }

              if(!(result._doc.moreInformationApprovedInUse == null)){
                lastRec.moreInformation = result._doc.moreInformationApprovedInUse.moreInformation;
              }

              if(!(result._doc.threatStatusApprovedInUse == null)){
                lastRec.threatStatus = result._doc.threatStatusApprovedInUse.threatStatus;
              }

              if(!(result._doc.legislationApprovedInUse == null)){
                lastRec.legislation = result._doc.legislationApprovedInUse.legislation;
              }

              if(!(result._doc.usesManagementAndConservationApprovedInUse == null)){
                lastRec.usesManagementAndConservation = result._doc.usesManagementAndConservationApprovedInUse.usesManagementAndConservation;
              }

              if(!(result._doc.directThreatsApprovedInUse == null)){
                lastRec.directThreats = result._doc.directThreatsApprovedInUse.directThreats;
              }

              if(!(result._doc.ancillaryDataApprovedInUse == null)){
                lastRec.ancillaryData = result._doc.ancillaryDataApprovedInUse.ancillaryData;
              }

              if(!(result._doc.endemicAtomizedApprovedInUse == null)){
                lastRec.endemicAtomized = result._doc.endemicAtomizedApprovedInUse.endemicAtomized;
              }

              if(!(result._doc.referencesApprovedInUse == null)){
                lastRec.references = result._doc.referencesApprovedInUse.references;
              }

              if(!(result._doc.environmentalEnvelopeApprovedInUse == null)){
                lastRec.environmentalEnvelope = result._doc.environmentalEnvelopeApprovedInUse.environmentalEnvelope;
              }

              if(!(result._doc.ecologicalSignificanceApprovedInUse == null)){
               lastRec.ecologicalSignificance = result._doc.ecologicalSignificanceApprovedInUse.ecologicalSignificance;
              }

              if(!(result._doc.invasivenessApprovedInUse == null)){
                lastRec.invasiveness = result._doc.invasivenessApprovedInUse.invasiveness;
              }
              logger.info('Get last version of the record', JSON.stringify({ _id: id_rc }) );
              res.json(lastRec);
          }else{
            logger.warn("Doesn't exist a Record with the indicated id: " + id_rc);
            res.json("Doesn't exist a Record with the indicated id: "+id_rc);
          }
      }       
  });
};

/*
  Returns the last version of a record according to id
 */
function lastRecordLegacyId(req, res) {
  var legacy_id=req.swagger.params.legacy_id.value;
  var lastRec={};
  console.log(legacy_id);
  add_objects.Record.findOne({ legacy_id : legacy_id,  }).exec(function (err, result) {
          if(err){
            logger.error('Error getting the last Record', JSON.stringify({ message:err }) );
            res.send("Error: "+err);
          }else{
            if(!(result == null)){

              if(!(result._doc.associatedPartyApprovedInUse == null)){
                lastRec.associatedParty = result._doc.associatedPartyApprovedInUse.associatedParty;
              }
              
              if(!(result._doc.commonNamesAtomizedApprovedInUse == null)){
                lastRec.commonNamesAtomized = result._doc.commonNamesAtomizedApprovedInUse.commonNamesAtomized;
              }

              if(!(result._doc.synonymsAtomizedApprovedInUse == null)){
                lastRec.synonymsAtomized = result._doc.synonymsAtomizedApprovedInUse.synonymsAtomized;
              }

              if(!(result._doc.taxonRecordNameApprovedInUse == null)){
                lastRec.taxonRecordName = result._doc.taxonRecordNameApprovedInUse.taxonRecordName;
              }

              if(!(result._doc.lifeCycleApprovedInUse == null)){
                lastRec.lifeCycle = result._doc.lifeCycleApprovedInUse.lifeCycle;
              }

              if(!(result._doc.lifeFormApprovedInUse == null)){
                lastRec.lifeForm = result._doc.lifeFormApprovedInUse.lifeForm;
              }

              if(!(result._doc.identificationKeysApprovedInUse == null)){
                lastRec.identificationKeys = result._doc.identificationKeysApprovedInUse.identificationKeys;
              }

              if(!(result._doc.fullDescriptionApprovedInUse == null)){
                lastRec.fullDescription = result._doc.fullDescriptionApprovedInUse.fullDescription;
              }

              if(!(result._doc.briefDescriptionApprovedInUse == null)){
                lastRec.briefDescription = result._doc.briefDescriptionApprovedInUse.briefDescription;
              }

              if(!(result._doc.abstractApprovedInUse == null)){
                lastRec.abstract = result._doc.abstractApprovedInUse.abstract;
              }

              if(!(result._doc.hierarchyApprovedInUse == null)){
                lastRec.hierarchy = result._doc.hierarchyApprovedInUse.hierarchy;
              }

              if(!(result._doc.reproductionApprovedInUse == null)){
                lastRec.reproduction = result._doc.reproductionApprovedInUse.reproduction;
              }

              if(!(result._doc.annualCyclesApprovedInUse == null)){
                lastRec.annualCycles = result._doc.annualCyclesApprovedInUse.annualCycles;
              }

              if(!(result._doc.feedingApprovedInUse == null)){
                lastRec.feeding = result._doc.feedingApprovedInUse.feeding;
              }

              if(!(result._doc.dispersalApprovedInUse == null)){
                lastRec.dispersal = result._doc.dispersalApprovedInUse.dispersal;
              }

              if(!(result._doc.behaviorApprovedInUse == null)){
                lastRec.behavior = result._doc.behaviorApprovedInUse.behavior;
              }

              if(!(result._doc.interactionsApprovedInUse == null)){
                lastRec.interactions = result._doc.interactionsApprovedInUse.interactions;
              }

              if(!(result._doc.molecularDataApprovedInUse == null)){
                lastRec.molecularData = result._doc.molecularDataApprovedInUse.molecularData;
              }

              if(!(result._doc.migratoryApprovedInUse == null)){
                lastRec.migratory = result._doc.migratoryApprovedInUse.migratory;
              }

              if(!(result._doc.habitatsApprovedInUse == null)){
                lastRec.habitats = result._doc.habitatsApprovedInUse.habitats;
              }

              if(!(result._doc.distributionApprovedInUse == null)){
                lastRec.distribution = result._doc.distributionApprovedInUse.distribution;
              }

              if(!(result._doc.territoryApprovedInUse == null)){
                lastRec.territory = result._doc.territoryApprovedInUse.territory;
              }

              if(!(result._doc.populationBiologyApprovedInUse == null)){
                lastRec.populationBiology = result._doc.populationBiologyApprovedInUse.populationBiology;
              }

              if(!(result._doc.moreInformationApprovedInUse == null)){
                lastRec.moreInformation = result._doc.moreInformationApprovedInUse.moreInformation;
              }

              if(!(result._doc.threatStatusApprovedInUse == null)){
                lastRec.threatStatus = result._doc.threatStatusApprovedInUse.threatStatus;
              }

              if(!(result._doc.legislationApprovedInUse == null)){
                lastRec.legislation = result._doc.legislationApprovedInUse.legislation;
              }

              if(!(result._doc.usesManagementAndConservationApprovedInUse == null)){
                lastRec.usesManagementAndConservation = result._doc.usesManagementAndConservationApprovedInUse.usesManagementAndConservation;
              }

              if(!(result._doc.directThreatsApprovedInUse == null)){
                lastRec.directThreats = result._doc.directThreatsApprovedInUse.directThreats;
              }

              if(!(result._doc.ancillaryDataApprovedInUse == null)){
                lastRec.ancillaryData = result._doc.ancillaryDataApprovedInUse.ancillaryData;
              }

              if(!(result._doc.endemicAtomizedApprovedInUse == null)){
                lastRec.endemicAtomized = result._doc.endemicAtomizedApprovedInUse.endemicAtomized;
              }

              if(!(result._doc.referencesApprovedInUse == null)){
                lastRec.references = result._doc.referencesApprovedInUse.references;
              }

              if(!(result._doc.environmentalEnvelopeApprovedInUse == null)){
                lastRec.environmentalEnvelope = result._doc.environmentalEnvelopeApprovedInUse.environmentalEnvelope;
              }

              if(!(result._doc.ecologicalSignificanceApprovedInUse == null)){
               lastRec.ecologicalSignificance = result._doc.ecologicalSignificanceApprovedInUse.ecologicalSignificance;
              }

              if(!(result._doc.invasivenessApprovedInUse == null)){
                lastRec.invasiveness = result._doc.invasivenessApprovedInUse.invasiveness;
              }
              logger.info('Get last version of the record', JSON.stringify({ _id: legacy_id }) );
              res.json(lastRec);
          }else{
            logger.warn("Doesn't exist a Record with the indicated legacy id: " + legacy_id);
            res.json("Doesn't exist a Record with the indicated legacy id: "+legacy_id);
          }
      }       
  });
};

function getProperties(req, res) {
  var element_name=req.swagger.params.element.value;
  console.log(element_name);
  console.log(JSON.stringify(mapElements));
  console.log(mapElements[element_name]);
  //propertyDoc = new FeedingVersion(feeding_version);
  Property.find({ plinianCoreElement : mapElements[element_name] }).exec(function (err, doc) {
    if(err){
      logger.error('Error getting the properties for the element: ' + mapElements[element_name], JSON.stringify({ message:err }) );
      res.send("Error: "+err);
    }else{
      res.json(doc);
    }
  });

}

function getMostRecentRecordsUpdated(req, res) {
  var query_u = add_objects.Record.find({}).select('_id scientificNameSimple creation_date update_date').sort({update_date: -1}).limit(5);
  //var query_c = add_objects.Record.find({}).select('_id scientificNameSimple associatedParty creation_date update_date').sort({creation_date: 1}).limit(5);
  query_u.exec(function (err, data_u) {
    if(err){
      logger.error('Error getting most recent updated records', JSON.stringify({ message:err }) );
      res.json({ message:err });
    }else if(data_u.length == 0){
      res.json({"message" : "No data in the database"});
    }else{
      res.json(data_u);
    }
  });
}

function getMostRecentRecordsUpdatedNumber(req, res) {
  var numberRecords=req.swagger.params.numberRecords.value;
  var query_u = add_objects.Record.find({}).select('_id scientificNameSimple creation_date update_date').sort({update_date: -1}).limit(numberRecords);
  //var query_c = add_objects.Record.find({}).select('_id scientificNameSimple associatedParty creation_date update_date').sort({creation_date: 1}).limit(5);
  query_u.exec(function (err, data_u) {
    if(err){
      logger.error('Error getting most recent updated records', JSON.stringify({ message:err }) );
      res.json({ message:err });
    }else if(data_u.length == 0){
      res.json({"message" : "No data in the database"});
    }else{
      res.json(data_u);
    }
  });
}

function getMostRecentRecordsUpdatedPagination(req, res) {
  var pageNum=req.swagger.params.page.value;
  var limitNum=req.swagger.params.limit.value;
  var options = {
    select: '_id scientificNameSimple creation_date update_date',
    sort: { update_date: -1 },
    page: pageNum,
    limit: limitNum
  };
  add_objects.Record.paginate(query, options).then(function(result) {
    if(err){
      logger.error('Error getting most recent updated records pagination', JSON.stringify({ message:err }) );
      res.json({ message:err });
    }else{
      res.json(data_u);
    }
  });
}


function getRecordList(req, res) {
  var query = add_objects.Record.find({}).select('_id scientificNameSimple creation_date update_date');
  query.exec(function (err, data) {
    if(err){
      logger.error('Error getting list of records', JSON.stringify({ message:err }) );
      res.json(err);
    }else if(data.length==0){
      res.json({"message" : "No data in the database"});
    }else{
      res.json(data);
    }
  });
}


function deleteRecord(req, res) {
  var RecordVersion = mongoose.model('RecordVersion').schema;
  var id_rc=req.swagger.params.id.value;
  var ver=req.params.version;
  var lastRec={};
  add_objects.RecordVersion.remove({ _id : id_rc }).exec(function (err, result) {
    if(err){
        console.log("error");
      }else{
        console.log(result);
      }
  });
};

module.exports = {
  lastRecord,
  getRecordList,
  completeLastRecordTest,
  lastRecordLegacyId,
  getMostRecentRecordsUpdated,
  getMostRecentRecordsUpdatedNumber,
  getMostRecentRecordsUpdatedPagination,
  getProperties
};
