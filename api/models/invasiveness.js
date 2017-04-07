var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var InvasivenessAtomized = Element.extend({
	origin : String,
	presence : String,
	persistence : String,
	distribution : [String],
	harmful : String,
	modified : {type : Date, default : Date.now},
	startValidateDate : {type : Date, default : Date.now},
	endValidateDate : {type : Date, default : Date.now},
	countryCode : String,
	stateProvince : String,
	county : String,
	localityName : String,
	language : String,
	citation : String,
	abundance : String,
	trend : String,
	rateOfSpread : String,
	regulatoryListing : String,
	memo : String,
	localityType : String,
	locationValue : String,
	publicationDatePrecision : String,
	whatImpact : String,
	vector : String,
	route : String,
	target : String,
	mechanism : String
});

var Invasiveness = Element.extend({
	invasivenessAtomized : [InvasivenessAtomized],
	invasivenessUnstructured : String
},{collection: 'invasiveness'});

var InvasivenessVersion = ElementVersion.extend({
	invasiveness : Invasiveness
},{ collection: 'InvasivenessVersion' });

module.exports = mongoose.model('InvasivenessVersion', InvasivenessVersion );