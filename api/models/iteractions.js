var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;


var InteractionsSpeciesType = Element.extend({
	measurementOrFact : MeasurementOrFact
});

var InteractionsAtomized = Element.extend({
	interactionSpecies: String,
	interactionSpeciesType: [InteractionsSpeciesType]
});

var Interactions = Element.extend({
	interactionsAtomized : [InteractionsAtomized],
	interactionUnstructured : String
},{collection: 'interactions'});

var InteractionsVersion = ElementVersion.extend({
	iteractions : Iteractions
},{ collection: 'InteractionsVersion' });

module.exports = {
	             	InteractionsVersion: mongoose.model('InteractionsVersion', InteractionsVersion ),
	             	Interactions: mongoose.model('Interactions', Interactions )
	             };