var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;


var scientificName = Element.extend({
	attributes : { id : {type: Number, required: [true, 'required value'], min: 0, default: 0 }, isAnamorphic: Boolean, nomenclaturalCode: String },
	simple : String,
	rank : String,
	canonicalName : { simple : String, uninomial : String, genus : { ref : String, linkType : String }, epithet :{ infragenericEpithet : String, specificEpithet : String, infraspecificEpithet : String }},
	canonicalAuthorship : { simple : String, authorship : { simple : String, year : {type: [String], default: void 0 }, authors : {type: [String], default: void 0 } }},
	specialAuthorship :{ basionymAuthorship : { simple : String, year : {type: [String], default: void 0 }, authors : {type: [String], default: void 0 }}, combinationAuthorship : {type: [String], default: void 0 }},
	publishedln : { identifier : String, datatype : String, source : String, simple : String },
	//year : { type: Date, default: Date.now },
	year : String,
	microReference : String,
	typificacion : { simple : String, typeVoucherEntity : { voucherReference : {type: [String], default: void 0 }, lectotypePublicationVoucher : {type: [String], default: void 0 }, lectotypeMicroReferenceVoucher : {type: [String], default: void 0 }, typeOfType : String }},
	typeNameEntity : { nameReference : { identifier : String, datatype : String, source : String }, lectotypePublication : { identifier : String , datatype : String, source : String }, lectotypeMicroReference : { identifier : String , datatype : String, source : String }},
	spellingCorrentionOf : {type: [String], default: void 0 },
	basionym : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	basedOn :  { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	conservedAgainst : {type: [String], default: void 0 },
	laterHomonymOf : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	sanctioned : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	replacementNameFor : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	publicationStatus : { ruleConsidered : String, note : String, reletedName : { identifier : String, datatype : String, source : String }, publishedln : { identifier : String, datatype : String, source : String }, microReference : String },
	providerLink : String,
	providerSpecificData : { anyOne :{type: [String], default: void 0 }, anyTwo : String }
}, { versionKey: false });

var TaxonRecordName = Element.extend({
	scientificName : scientificName
}, { versionKey: false });

var TaxonRecordNameVersion = ElementVersion.extend({
	taxonRecordName : TaxonRecordName
}, { collection: 'TaxonRecordNameVersion' });



module.exports = mongoose.model('TaxonRecordNameVersion', TaxonRecordNameVersion );