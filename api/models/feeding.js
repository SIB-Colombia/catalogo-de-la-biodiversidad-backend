var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var FeedingAtomized = new Schema ({
	type : String,
	//thropic : [{ strategy : String }],
	thropic: { type: [{ strategy : String }], default: void 0 },
	ancillaryData: { type: [AncillaryData], default: void 0 }
},{ strict: false, versionKey: false });

var Feeding = Element.extend({
	//feedingAtomized : [FeedingAtomized],
	feedingAtomized: { type: [FeedingAtomized], default: void 0 },
	feedingUnstructured : String
},{ strict: false, versionKey: false });

var FeedingVersion = ElementVersion.extend({
	feeding : Feeding
},{ collection: 'FeedingVersion', versionKey: false });

module.exports = mongoose.model('FeedingVersion', FeedingVersion );