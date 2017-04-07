var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var InteractionSpeciesType = new Schema({
	measurementOrFact : MeasurementOrFact,
	ancillaryData : AncillaryData
},{ versionKey: false });

var InteractionsAtomized = new Schema ({
	interactionSpecies : String, 
	interactionSpeciesType : [InteractionSpeciesType],
	ancillaryData : [AncillaryData]
},{ versionKey: false });

var Interactions = Element.extend({
	interactionsAtomized : [InteractionsAtomized],
	interactionsUnstructured : String
},{ versionKey: false });

var InteractionsVersion = ElementVersion.extend({
	interactions : Interactions
},{ collection: 'InteractionsVersion', versionKey: false });

module.exports = mongoose.model('InteractionsVersion', InteractionsVersion )