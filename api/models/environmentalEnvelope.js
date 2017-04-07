var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var EnvironmentalEnvelopeAtomized = Element.extend({
	measurementOrFact : MeasurementOrFact
});

var EnvironmentalEnvelope = Element.extend({
	environmentalEnvelopeAtomized : [EnvironmentalEnvelopeAtomized],
	environmentalEnvelopeUnstructured : String,
},{collection: 'environmentalEnvelope'});

var EnvironmentalEnvelopeVersion = ElementVersion.extend({
	environmentalEnvelope : EnvironmentalEnvelope
},{ collection: 'EnvironmentalEnvelopeVersion' });

module.exports = mongoose.model('EnvironmentalEnvelopeVersion', EnvironmentalEnvelopeVersion );