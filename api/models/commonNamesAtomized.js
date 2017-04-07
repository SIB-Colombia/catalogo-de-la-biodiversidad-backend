var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

//temporalCoverage : { startDate : { type: Date, required: true, default: Date.now }, endDate : { type: Date, required: true, default: Date.now } },
var Distribution = new Schema({
	distributionScope : { type : {type: String}, ancillaryData: [AncillaryData] },
	temporalCoverage : { startDate : { type: Date, required: true, default: Date.now }, endDate : { type: Date, required: true, default: Date.now } },
	distributionAtomizedBranch: [String],
	distributionUnstructured : String
});


var CommonNamesAtomized = Element.extend({
	name : String,
	language : String,
	synonymStatus : String,
	usedIn : Distribution,
	usedBy : String
});


var CommonNamesAtomizedVersion = ElementVersion.extend ({
	commonNamesAtomized : [CommonNamesAtomized]
},{ collection: 'CommonNamesAtomizedVersion' });

module.exports = mongoose.model('CommonNamesAtomizedVersion', CommonNamesAtomizedVersion );