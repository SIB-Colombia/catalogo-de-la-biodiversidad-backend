var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var HabitatAtomized = Element.extend({
	measurementOrFact : MeasurementOrFact,
	relatedTo : String
},{ versionKey: false });

var Habitats = Element.extend({
	habitatAtomized : [HabitatAtomized],
	habitatUnstructured : String
},{ collection: 'habitats', versionKey: false});

var HabitatsVersion = ElementVersion.extend({
	habitats : Habitats
},{ collection: 'HabitatsVersion', versionKey: false });

module.exports = mongoose.model('HabitatsVersion', HabitatsVersion );