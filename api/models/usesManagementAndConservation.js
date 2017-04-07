var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var MeasurementOrFact = require('mongoose').model('MeasurementOrFact').schema;

var UsesAtomized = Element.extend({
	sourceOfInformation : {
		references : [String],
		sourceOfInformationText : String
	},
	useValue : String,
	partUsed : String,
	users : String,
	organisms : String,
	vernacularNameUseAnnotations : String,
	productionDetails : String,
	meansOfApplicationAdministration : String,
	seasonOfAvailabilityUse : String,
	conservationExplotationData : String,
	useTypeAtomized : String,
	economics : String,
	ratingPopularity : String,
	properties : String,
	potential : String,
	useNotes : String
});

var Actions = Element.extend({
	measurementOrFact : [MeasurementOrFact]
});

var ManagementAndConservationAtomized = Element.extend({
	type : String,
	objetive : String,
	managementPlan : String,
	actions : [Actions],
	humanAndEnviromentalrelevanc : String
}, { strict: false, versionKey: false });

var ManagementAndConservation = Element.extend({
	managementAndConservationAtomized : [ManagementAndConservationAtomized],
	managementAndConservationUnstructured : String
}, { strict: false, versionKey: false });

var UsesManagementAndConservation = Element.extend({
	usesAtomized : [UsesAtomized],
	managementAndConservation : ManagementAndConservation
},{collection: 'UsesManagementAndConservation', strict: false, versionKey: false });

/*
var UsesManagementAndConservationVersion = ElementVersion.extend({
	usesManagementAndConservation : UsesManagementAndConservation
},{ collection: 'UsesManagementAndConservationVersion', strict: false });
*/

var UsesManagementAndConservationVersion = new Schema({
	name : String
},{ collection: 'UsesManagementAndConservationVersion', strict: false, versionKey: false });

module.exports = mongoose.model('UsesManagementAndConservationVersion', UsesManagementAndConservationVersion );