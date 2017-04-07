var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;


var scientificName = Element.extend ({
	attributes : { id : Number, isAnamorphic: Boolean, nomenclaturalCode: String },
	simple : String,
	rank : String,
	canonicalName : { simple : String, uninomial : String, genus : { ref : String, linkType : String }, epithet :{ infragenericEpithet : String, specificEpithet : String, infraspecificEpithet : String }},
	canonicalAuthorship : { simple : String, authorship : { simple : String, year : [String], authors : [String] }},
	specialAuthorship :{ basionymAuthorship : { simple : String, year : [String], authors : [String], combinationAuthorship : [String]}},
	publishedln : { identifier : String, datatype : String, source : String, simple : String },
	year : String,
	microReference : String,
	typificacion : { simple : String, typeVoucherEntity : { voucherReference : [String], lectotypePublicationVoucher : [String], lectotypeMicroReferenceVoucher : [String], typeOfType : String }},
	typeNameEntity : { nameReference : { identifier : String, datatype : String, source : String }, lectotypePublication : { identifier : String , datatype : String, source : String }, lectotypeMicroReference : { identifier : String , datatype : String, source : String }},
	spellingCorrentionOf : [String],
	basionym : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	basedOn :  { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	conservedAgainst : [String],
	laterHomonymOf : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	sanctioned : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	replacementNameFor : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	publicationStatus : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	providerLink : String,
	providerSpecificData : { anyOne : [String], anyTwo : String }
}, { versionKey: false });


var SynonymsAtomized = Element.extend({
	synonymName : scientificName,
	synonymStatus : String
},{ versionKey: false });


var SynonymsAtomizedVersion = ElementVersion.extend({
	synonymsAtomized : [SynonymsAtomized]
},{ collection: 'SynonymsAtomizedVersion' });



module.exports = mongoose.model('SynonymsAtomizedVersion', SynonymsAtomizedVersion );

