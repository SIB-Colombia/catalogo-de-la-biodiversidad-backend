import mongoose from 'mongoose';
import async from 'async';
import winston from 'winston';
import TaxonRecordNameVersion from '../models/taxonRecordName.js';
import AssociatedPartyVersion from '../models/associatedParty.js';
import BaseElementsVersion from '../models/baseElements.js';
import CommonNamesAtomizedVersion from '../models/commonNamesAtomized.js';
import SynonymsAtomizedVersion from '../models/synonymsAtomized.js';
import LifeCycleVersion from '../models/lifeCycle.js';
import LifeFormVersion from '../models/lifeForm.js';
import IdentificationKeysVersion from '../models/identificationKeys.js';
import FullDescriptionVersion from '../models/fullDescription.js';
import BriefDescriptionVersion from '../models/briefDescription.js';
import AbstractVersion from '../models/abstract.js';
import HierarchyVersion from '../models/hierarchy.js';
import ReproductionVersion from '../models/reproduction.js';
import AnnualCyclesVersion from '../models/annualCycles.js';
import FeedingVersion from '../models/feeding.js';
import DispersalVersion from '../models/dispersal.js';
import BehaviorVersion from '../models/behavior.js';
import InteractionsVersion from '../models/interactions.js';
import MolecularDataVersion from '../models/molecularData.js';
import MigratoryVersion from '../models/migratory.js';
import HabitatsVersion from '../models/habitats.js';
import DistributionVersion from '../models/distribution.js';
import TerritoryVersion from '../models/territory.js';
import PopulationBiologyVersion from '../models/populationBiology.js';
import MoreInformationVersion from '../models/moreInformation.js';
import ThreatStatusVersion from '../models/threatStatus.js';
import LegislationVersion from '../models/legislation.js';
import UsesManagementAndConservationVersion from '../models/usesManagementAndConservation.js';
import DirectThreatsVersion from '../models/directThreats.js';
import AncillaryDataVersion from '../models/ancillaryData.js';
import EndemicAtomizedVersion from '../models/endemicAtomized.js';
import ReferencesVersion from '../models/references.js';
import EnvironmentalEnvelopeVersion from '../models/environmentalEnvelope.js';
import EcologicalSignificanceVersion from '../models/ecologicalSignificance.js';
import InvasivenessVersion from '../models/invasiveness.js';
import add_objects from '../models/additionalModels.js';

mongoose.Promise = require('bluebird');

function completeLastRecordTest(req, res) {
  var id_rc=req.swagger.params.id.value;
  add_objects.Record.findById(id_rc,function(err, result){
    if(err){
      res.send("Error: "+err);
    }else{
      res.json(result);
    }
  });
}

function lastRecordTest(req, res) {
  var id_rc=req.swagger.params.id.value;
  var lastRec={};
  add_objects.Record.findById(id_rc,function(err, result){
          if(err){
            res.send("Error: "+err);
          }else{
            //null or undefined
            if(!(result == null)){
              //null or undefined
              if(result._doc.associatedPartyApprovedInUse == null){
                console.log("undefined");
              }else{
                //console.log(result._doc.associatedPartyApprovedInUse.associatedParty);
                lastRec.associatedParty = result._doc.associatedPartyApprovedInUse.associatedParty;
              }

              if(result._doc.commonNamesAtomizedApprovedInUse == null){
                console.log("undefined");
              }else{
                //console.log(result._doc.commonNamesAtomizedApprovedInUse.commonNamesAtomized);
                lastRec.commonNamesAtomized = result._doc.commonNamesAtomizedApprovedInUse.commonNamesAtomized;
              }

              if(result._doc.synonymsAtomizedApprovedInUse == null){
                //console.log("undefined");
              }else{
                //console.log(result._doc.synonymsAtomizedApprovedInUse.synonymsAtomized);
                lastRec.synonymsAtomized = result._doc.synonymsAtomizedApprovedInUse.synonymsAtomized;
              }

              if(result._doc.taxonRecordNameApprovedInUse == null){
                console.log("undefined");
              }else{
                //console.log(result._doc.taxonRecordNameApprovedInUse.taxonRecordName);
                lastRec.taxonRecordName = result._doc.taxonRecordNameApprovedInUse.taxonRecordName;
              }

              if(result._doc.lifeCycleApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.lifeCycle = result._doc.lifeCycleApprovedInUse.lifeCycle;
              }

              if(result._doc.lifeFormApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.lifeForm = result._doc.lifeFormApprovedInUse.lifeForm;
              }

              if(result._doc.identificationKeysApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.identificationKeys = result._doc.identificationKeysApprovedInUse.identificationKeys;
              }

              if(result._doc.fullDescriptionApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.fullDescription = result._doc.fullDescriptionApprovedInUse.fullDescription;
              }

              if(result._doc.briefDescriptionApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.briefDescription = result._doc.briefDescriptionApprovedInUse.briefDescription;
              }

              if(result._doc.abstractApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.abstract = result._doc.abstractApprovedInUse.abstract;
              }

              if(result._doc.hierarchyApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.hierarchy = result._doc.hierarchyApprovedInUse.hierarchy;
              }

              if(result._doc.reproductionApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.reproduction = result._doc.reproductionApprovedInUse.reproduction;
              }

              if(result._doc.annualCyclesApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.annualCycles = result._doc.annualCyclesApprovedInUse.annualCycles;
              }

              if(result._doc.feedingApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.feeding = result._doc.feedingApprovedInUse.feeding;
              }

              if(result._doc.dispersalApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.dispersal = result._doc.dispersalApprovedInUse.dispersal;
              }

              if(result._doc.behaviorApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.behavior = result._doc.behaviorApprovedInUse.behavior;
              }

              if(result._doc.interactionsApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.interactions = result._doc.interactionsApprovedInUse.interactions;
              }

              if(result._doc.molecularDataApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.molecularData = result._doc.molecularDataApprovedInUse.molecularData;
              }

              if(result._doc.migratoryApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.migratory = result._doc.migratoryApprovedInUse.migratory;
              }

              if(result._doc.habitatsApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.habitats = result._doc.habitatsApprovedInUse.habitats;
              }

              if(result._doc.distributionApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.distribution = result._doc.distributionApprovedInUse.distribution;
              }

              if(result._doc.territoryApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.territory = result._doc.territoryApprovedInUse.territory;
              }

              if(result._doc.populationBiologyApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.populationBiology = result._doc.populationBiologyApprovedInUse.populationBiology;
              }

              if(result._doc.moreInformationApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.moreInformation = result._doc.moreInformationApprovedInUse.moreInformation;
              }

              if(result._doc.threatStatusApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.threatStatus = result._doc.threatStatusApprovedInUse.threatStatus;
              }

              if(result._doc.legislationApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.legislation = result._doc.legislationApprovedInUse.legislation;
              }

              if(result._doc.usesManagementAndConservationApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.usesManagementAndConservation = result._doc.usesManagementAndConservationApprovedInUse.usesManagementAndConservation;
              }

              if(result._doc.directThreatsApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.directThreats = result._doc.directThreatsApprovedInUse.directThreats;
              }

              if(result._doc.ancillaryDataApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.ancillaryData = result._doc.ancillaryDataApprovedInUse.ancillaryData;
              }

              if(result._doc.endemicAtomizedApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.endemicAtomized = result._doc.endemicAtomizedApprovedInUse.endemicAtomized;
              }

              if(result._doc.referencesApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.references = result._doc.referencesApprovedInUse.references;
              }

              if(result._doc.environmentalEnvelopeApprovedInUse == null){
                console.log("undefined");
              }else{
               lastRec.environmentalEnvelope = result._doc.environmentalEnvelopeApprovedInUse.environmentalEnvelope;
              }

              if(result._doc.ecologicalSignificanceApprovedInUse == null){
               console.log("undefined");
              }else{
                lastRec.ecologicalSignificance = result._doc.ecologicalSignificanceApprovedInUse.ecologicalSignificance;
              }

              if(result._doc.invasivenessApprovedInUse == null){
                console.log("undefined");
              }else{
                lastRec.invasiveness = result._doc.invasivenessApprovedInUse.invasiveness;
              }
            res.json(lastRec);
          }else{
            res.json("No data");
          }
      }       
  });
};

/*
  Returns the last version of a record according to id

  Param 1: isGeoreferenced (boolean), if true returns the count of georeferenced occurrences
 */
function lastRecord(req, res) {

  var RecordVersion = mongoose.model('RecordVersion').schema;
  var id_rc=req.swagger.params.id.value;
  var ver=req.params.version;
  var lastRec={};

    add_objects.RecordVersion.findOne({ _id : id_rc }).exec(function (err, record) {
      if (err){
        res.send(err);
      }
      lastRec._id=record._id;
      async.waterfall([
        function(callback){
          AssociatedPartyVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get AssociatedParty element for the record with id: "+id_rc+" : " + err.message));
             }else{ 
              if(elementVer){
                lastRec.associatedParty=elementVer.associatedParty;
              }
              callback();
            }
          });
        },
        /*
        function(callback){
          BaseElementsVersion.findOne({ id_record : id_rc, version: lenBasEl }).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get BaseElements element for the record with id: "+id_rc+" : " + err.message));
            }else{ 
              if(elementVer){
                lastRec.baseElements = elementVer.baseElements;
              }
              callback();
            }
          });
        },*/
        function(callback){
          CommonNamesAtomizedVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get CommonNamesAtomized element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.commonNamesAtomized = elementVer.commonNamesAtomized;
              }
              callback();
            }
          });
        },
        function(callback){
          SynonymsAtomizedVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
             if(err){
              callback(new Error("Error to get SynonymsAtomized element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.synonymsAtomized = elementVer.synonymsAtomized;
              }
              callback();
            }
          });
        },
        function(callback){
          TaxonRecordNameVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get TaxonRecordName element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.taxonRecordName = elementVer.taxonRecordName;
              }
              callback();
            }
          });
        },
        function(callback){
          LifeCycleVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get LifeCycle element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.lifeCycle = elementVer.lifeCycle;
              }
              callback();
            }
          });
        },
        function(callback){
          LifeFormVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get LifeForm element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.lifeForm = elementVer.lifeForm;
              }
              callback();
            }
          });
        },
        function(callback){
          IdentificationKeysVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get IdentificationKeys element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.identificationKeys=elementVer.identificationKeys;
              }
              callback();
            }
          });
        },
        function(callback){
          FullDescriptionVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get FullDescription element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.fullDescription = elementVer.fullDescription;
              }
              callback();
            }
          });
        },
        function(callback){
          BriefDescriptionVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get BriefDescription element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.briefDescription=elementVer.briefDescription;
              }
              callback();
            }
          });
        },
        function(callback){
          AbstractVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Abstract element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.abstract = elementVer.abstract;
              }
              callback();
            }
          });
        },
        function(callback){
          HierarchyVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Hierarchy element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.hierarchy=elementVer.hierarchy;
              }
              callback();
            }
          });
        },
        function(callback){
          ReproductionVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Reproduction element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.reproduction = elementVer.reproduction;
              }
              callback();
            }
          });
        },
        function(callback){
          AnnualCyclesVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get AnnualCycles element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.annualCycles = elementVer.annualCycles;
              }
              callback();
            }
          });
        },
        function(callback){
          FeedingVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Feeding element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.feeding = elementVer.feeding;
              }
              callback();
            }
          });
        },
        function(callback){
          DispersalVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Dispersal element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.dispersal = elementVer.dispersal;
              }
              callback();
            }
          });
        },
        function(callback){
          BehaviorVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Behavior element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.behavior = elementVer.behavior;
              }
              callback();
            }
          });
        },
        function(callback){
          InteractionsVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Interactions element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.interactions = elementVer.interactions;
              }
              callback();
            }
          });
        },
        function(callback){
          MolecularDataVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get MolecularData element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.molecularData = elementVer.molecularData;
              }
              callback();
            }
          });
        },
        function(callback){
          MigratoryVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Migratory element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.migratory = elementVer.migratory;
              }
              callback();
            }
          });
        },
        function(callback){
          HabitatsVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Habitats element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.habitats = elementVer.habitats;
              }
              callback();
            }
          });
        },
        function(callback){
          DistributionVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Distribution element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.distribution = elementVer.distribution;
              }
              callback();
            }
          });
        },
        function(callback){
          TerritoryVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Territory element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.territory = elementVer.territory;
              }
              callback();
            }
          });
        },
        function(callback){
          PopulationBiologyVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get PopulationBiology element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.populationBiology = elementVer.populationBiology;
              }
              callback();
            }
          });
        },
        function(callback){
          MoreInformationVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get PopulationBiology element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.moreInformation = elementVer.moreInformation;
              }
              callback();
            }
          });
        },
        function(callback){
          ThreatStatusVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get ThreatStatus element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.threatStatus = elementVer.threatStatus;
              }
              callback();
            }
          });
        },
        function(callback){
          LegislationVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Legislation element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.legislation = elementVer.legislation;
              }
              callback();
            }
          });
        },
        function(callback){
          console.log(id_rc);
          UsesManagementAndConservationVersion.findOne({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get UsesManagementAndConservation element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.usesManagementAndConservation = elementVer._doc.usesManagementAndConservation;
              }
              callback();
            }
          });
        },
        function(callback){
          DirectThreatsVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get DirectThreats element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.directThreats = elementVer.directThreats;
              }
              callback();
            }
          });
        },
        function(callback){
          AncillaryDataVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get AncillaryData element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.ancillaryData = elementVer.ancillaryData;
              }
              callback();
            }
          });
        },
        function(callback){
          EndemicAtomizedVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get EndemicAtomized element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.endemicAtomized = elementVer.endemicAtomized;
              }
              callback();
            }
          });
        },
        function(callback){
          ReferencesVersion.findOne({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "approved_in_use" }).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get References element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.references = elementVer.references;
              }
              callback();
            }
          });
        },
        function(callback){
          EnvironmentalEnvelopeVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get EnvironmentalEnvelope element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.environmentalEnvelope = elementVer.environmentalEnvelope;
              }
              callback();
            }
          });
        },
        function(callback){
          EcologicalSignificanceVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get EcologicalSignificance element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.ecologicalSignificance = elementVer.ecologicalSignificance;
              }
              callback();
            }
          });
        },
        function(callback){
          InvasivenessVersion.findOne({ id_record : id_rc, state: "approved_in_use" }).sort({created: -1}).exec(function (err, elementVer) {
            if(err){
              callback(new Error("Error to get Invasiveness element for the record with id: "+id_rc+" : " + err.message));
            }else{
              if(elementVer){
                lastRec.invasiveness = elementVer.invasiveness;
              }
              callback();
            }
          });
        },
        ],function(err, result) {
          if (err) {
            console.log("Error: "+err);
            winston.error("message: " + err );
            res.status(406);
            res.json({ message: ""+err });
          }else{
            winston.info('info', 'Get Record with _id: ' + id_rc);
            res.json(lastRec);
          }
        });
    });
};

function getRecordListTest(req, res) {
  var query = add_objects.Record.find({}).select('taxonRecordNameApprovedInUse.taxonRecordName.scientificName.simple associatedPartyApprovedInUse.associatedParty _id');
  query.exec(function (err, data) {
    if(err){
      res.json(err);
    }else if(data.length==0){
      res.json({"message" : "No data in the database"});
    }else{
      res.json(data);
    }
  });
  

}

function getRecordList(req, res) {
  console.log("getRecordList");
  var lastRec={};
  var response=[];
  var dataObject ={};
  var query = add_objects.Record.find({}).select('taxonRecordNameVersion associatedPartyVersion creation_date').populate('taxonRecordNameVersion associatedPartyVersion').sort({ _id: -1});
  /*
  var skip = parseInt(req.query.skip);
  var limit = parseInt(req.query.limit) ;
  */
  
  
  if(typeof skip ==="undefined" || typeof limit ==="undefined" || skip.length==0 || limit.length==0){
    query.exec(function (err, data) {
        if (err) 
          res.json(err);
        if(data.length==0){
          res.json({"message" : "No data in the database"});
        }else{
          if(data){

            var lenData=data.length;
            var lenTaxRecNam=0;
            var lenAsPar=0;
            console.log(lenData);
            console.log(data);
            /*
            for (i = 0; i < lenData ; i++) {
              lastRec._id=data[i]._id;
              lastRec.creation_date=data[i]._id.getTimestamp();
              lenTaxRecNam=data[i].taxonRecordNameVersion.length;
              lenAsPar=data[i].associatedPartyVersion.length;
              if(typeof data[i].associatedPartyVersion[lenAsPar-1]!=="undefined"){
                lastRec.associatedParty=data[i].associatedPartyVersion[lenAsPar-1].associatedParty;
              }else{
                lastRec.associatedParty="";
              }
  
              if(typeof data[i].taxonRecordNameVersion[lenTaxRecNam-1]!=="undefined"){
                lastRec.taxonRecordName=data[i].taxonRecordNameVersion[lenTaxRecNam-1].taxonRecordName;
              }else{
                lastRec.taxonRecordName="";
              }
              response.push(lastRec);
              lastRec={};
            }
            */
          res.json(response);


        }else{
          res.json({"message" : "No data in the database"});
        }
      }
    });
  }else{
    if (skip === 1) {
      skip = 0;
    }else {
      skip = ((skip -1)*limit) + 1;
    };
    //query=add_objects.RecordVersion.find({}).select('taxonRecordNameVersion associatedPartyVersion creation_date').populate({path: 'taxonRecordNameVersion'}).sort({ _id: -1}).limit(limit).skip(skip);
    var totalRecords = 0;
    add_objects.RecordVersion.find({}).count(function (err, count){
      totalRecords = count;
    });
    query = add_objects.RecordVersion.find({});
    
    query.skip(skip).limit(limit).select('taxonRecordNameVersion associatedPartyVersion creation_date').populate('taxonRecordNameVersion associatedPartyVersion').exec('find', function (err, data) {
        if (err) 
          res.send(err);
        if(data.length==0){
          res.json({"message" : "No data in the database"});
        }else{
          if(data){
          var lenData=data.length;
          var lenTaxRecNam=0;
          var lenAsPar=0;
          for (i = 0; i < lenData ; i++) {
            lastRec._id=data[i]._id;
            lastRec.creation_date=data[i]._id.getTimestamp();
            lenTaxRecNam=data[i].taxonRecordNameVersion.length;
            lenAsPar=data[i].associatedPartyVersion.length;
            if(typeof data[i].associatedPartyVersion[lenAsPar-1]!=="undefined"){
              lastRec.associatedParty=data[i].associatedPartyVersion[lenAsPar-1].associatedParty;
            }else{
              lastRec.associatedParty="";
            }
  
            if(typeof data[i].taxonRecordNameVersion[lenTaxRecNam-1]!=="undefined"){
              lastRec.taxonRecordName=data[i].taxonRecordNameVersion[lenTaxRecNam-1].taxonRecordName;
            }else{
              lastRec.taxonRecordName="";
            }

            response.push(lastRec);
            lastRec={};
          }
          dataObject.docs = response;
          dataObject.total = totalRecords;
          console.log(totalRecords);
          //console.log("Resultado: "+data);
          res.json(dataObject);
        }else{
          res.json({"message" : "No data in the database"});
        }
      }
    });
  }
  
};

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
  lastRecordTest,
  getRecordListTest,
  completeLastRecordTest 
};
