var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;

var threatStatusAtomized = Element.extend({
	threatCategory: {
		measurementID : String,
		measurementType : String,
		measurementAccuracy : String,
		measurementUnit : String,
		measurementDeterminedDate : Date,
		measurementDeterminedBy : [String],
		measurementMethod: String,
		measurementRemarks : String,
		relatedTo: String,
		measurementValue: String
	},
	authority: [String],
	appliesTo: {
		country : String,
		stateProvince: String,
		county : String,
		municipality: String,
		locality: String
	},
	apendiceCITES: String
}, { versionKey: false });

var ThreatStatus = Element.extend({
	threatStatusAtomized : threatStatusAtomized,
	threatStatusUnstructured : String
},{collection: 'threatStatus', versionKey: false});

var ThreatStatusVersion = ElementVersion.extend({
	threatStatus : [ThreatStatus]
},{ collection: 'ThreatStatusVersion', versionKey: false });

module.exports =  mongoose.model('ThreatStatusVersion', ThreatStatusVersion );