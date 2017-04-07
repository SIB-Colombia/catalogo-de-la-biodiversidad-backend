var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var EcologicalSignificanceAtomized = Element.extend({
	measurementOrFact : MeasurementOrFact
});

var EcologicalSignificance = Element.extend({
	ecologicalSignificanceAtomized : [EcologicalSignificanceAtomized],
	ecologicalSignificanceUnstructured : String,
},{collection: 'ecologicalSignificance'});

var EcologicalSignificanceVersion = ElementVersion.extend({
	ecologicalSignificance : EcologicalSignificance
},{ collection: 'EcologicalSignificanceVersion' });

module.exports = mongoose.model('EcologicalSignificanceVersion', EcologicalSignificanceVersion );