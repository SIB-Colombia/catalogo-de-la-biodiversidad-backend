var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
//var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var InnerMeasurementOrFact = new Schema({
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
},{ collection : 'measurementOrFact', strict: false });

var MeasurementOrFact = new Schema({
	measurementOrFact : InnerMeasurementOrFact,
	relatedTo : String
},{ collection : 'measurementOrFact', strict: false });

var MolecularDataAtomized = Element.extend({
	measurementOrFact : MeasurementOrFact,
	relatedTo : String
});

var MolecularData = Element.extend({
	molecularDataAtomized : [MolecularDataAtomized],
	molecularDataUnstructured : String
},{collection: 'molecularData'});

var MolecularDataVersion = ElementVersion.extend({
	molecularData : MolecularData
},{ collection: 'MolecularDataVersion' });

module.exports = mongoose.model('MolecularDataVersion', MolecularDataVersion );