var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var DirectThreatsAtomized = Element.extend({
	measurementOrFact : MeasurementOrFact
});

var DirectThreats = Element.extend({
	directThreatsAtomized : [DirectThreatsAtomized],
	directThreatsUnstructured : String
},{collection: 'DirectThreats'});

var DirectThreatsVersion = ElementVersion.extend({
	directThreats : DirectThreats
},{ collection: 'DirectThreatsVersion' });

/*
DirectThreatsVersion.path('directThreats').required(true);
DirectThreats.path('directThreatsAtomized').required(true);
*/

module.exports = mongoose.model('DirectThreatsVersion', DirectThreatsVersion );