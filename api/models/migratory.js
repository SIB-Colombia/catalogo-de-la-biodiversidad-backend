var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var MigratoryAtomized = Element.extend({
	causes : String,
	patterns : String,
	routes : String,
	season : String
});

var Migratory = Element.extend({
	migratoryAtomized : [MigratoryAtomized],
	migratoryUnstructured : String,
	additionalInformation : String,
	dataObject : String,
},{collection: 'migratory'});

var MigratoryVersion = ElementVersion.extend({
	migratory : Migratory
},{ collection: 'MigratoryVersion' });

module.exports = mongoose.model('MigratoryVersion', MigratoryVersion );