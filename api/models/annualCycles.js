var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var AnnualCycleAtomized = new Schema ({
	event : String,
	startTimeInterval : String,
	endTimeInterval : String,
	ancillaryData : AncillaryData
},{ strict: false, versionKey: false });

var AnnualCycles = Element.extend({
	annualCycleAtomized : [AnnualCycleAtomized],
	annualCycleUnstructured : String
},{ strict: false, versionKey: false });

var AnnualCyclesVersion = ElementVersion.extend({
	annualCycles : AnnualCycles
},{ collection: 'AnnualCyclesVersion', versionKey: false });

module.exports = mongoose.model('AnnualCyclesVersion', AnnualCyclesVersion );