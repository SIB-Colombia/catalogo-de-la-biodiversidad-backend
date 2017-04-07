var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var PopulationBiologyAtomized = Element.extend({
	region : {
		measurementValue : String
	},
	abundanceData : {
		measurementValue : String
	},
	densityData : {
		measurementValue : String
	},
	patternDistribution : {
		measurementValue : String
	},
	size : {
		measurementValue : String
	},
	sexRatio : {
		measurementValue : String
	},
	fecundity : {
		measurementValue : String
	},
	mortalityRate : {
		measurementValue : String
	},
	birthRate : {
		measurementValue : String
	},
	numberIndividualsPerObservation : {
		measurementValue : String
	},
	averageDensity : {
		measurementValue : String
	},
	populationTrend : {
		measurementValue : String
	},
	recruitment : {
		measurementValue : String
	},
	populationGrowthRate : {
		measurementValue : String
	},
	emigration : {
		measurementValue : String
	},
	immigration : {
		measurementValue : String
	},
	descriptionLifeStages : {
		measurementValue : String
	},
	proportionIndividualsPerStageLife : {
		measurementValue : String
	},
	carryingCapacity : {
		measurementValue : String
	}
}, {versionKey: false});

var PopulationBiology = Element.extend({
	populationBiologyAtomized: [PopulationBiologyAtomized],
	populationBiologyUnstructured : String
},{collection: 'populationBiology', versionKey: false});

var PopulationBiologyVersion = ElementVersion.extend({
	populationBiology : PopulationBiology
},{ collection: 'PopulationBiologyVersion', versionKey: false });

module.exports = mongoose.model('PopulationBiologyVersion', PopulationBiologyVersion );