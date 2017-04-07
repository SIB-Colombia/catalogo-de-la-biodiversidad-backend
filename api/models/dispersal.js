var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
//var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var MeasurementOrFact = new Schema({
	measurementID : String,
	measurementType : String,
	measurementValue : String,
	measurementAccuracy : String,
	measurementUnit : String,
	measurementDeterminedDate : String,
	measurementDeterminedBy: [String],
	measurementMethod : String,
	measurementRemarks : String,
	relatedTo : String
},{ collection : 'measurementOrFact', strict: false,  versionKey: false });

var Distance = new Schema({
	measurementOrFact : MeasurementOrFact,
	ancillaryData : AncillaryData
},{ versionKey: false });

var DispersalAtomized = new Schema ({
	purpose : String,
	type : { type: String },
	structureDispersed : String,
	distance : Distance,
	ancillaryData : AncillaryData
},{ versionKey: false });

var Dispersal = Element.extend({
	dispersalAtomized : DispersalAtomized,
	dispersalUnstructured : String
},{ versionKey: false });

var DispersalVersion = ElementVersion.extend({
	dispersal : Dispersal
},{ collection: 'DispersalVersion', versionKey: false });

module.exports = mongoose.model('DispersalVersion', DispersalVersion );