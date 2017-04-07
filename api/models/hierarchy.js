var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var Hierarchy = Element.extend({
	classification: String,
	recommended: Number,
	kingdom : String,
	phylum : String,
	classHierarchy: String,
	order : String,
	family : String,
	genus : String,
	subgenus : String,
	taxonRank : String,
	specificEpithet : String,
	infraspecificEpithet : String,
	higherClassification : String,
	parentTaxon : String
});


var HierarchyVersion = ElementVersion.extend ({
	hierarchy : [Hierarchy]
},{ collection: 'HierarchyVersion' });

module.exports = mongoose.model('HierarchyVersion', HierarchyVersion );