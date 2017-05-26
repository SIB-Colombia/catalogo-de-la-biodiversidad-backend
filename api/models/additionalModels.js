var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Reference = new Schema ({
	profile_id : String,
	group_id : String,
	created : {type: Date},
	last_modified : {type: Date},
	identifiers : [String],
	abstract : String,
	tags : String,
	type : String,
	source : String,
	title : String,
	authors : [String],
	year : {type: Date, default: Date.now},
	//year : String,
	volume : String,
	issue : String,
	pages : String,
	series : String,
	chapter : String,
	websites : String,
	accessed : String,
	publisher : String,
	address : String,
	city : String, 
	edition : String,
	institution : String,
	editors : [String],
	keywords : [String],
	doi : String,
	isbn : String,
	issn : String,
	link : String,
	recordId : String
},{ collection: 'Reference', versionKey: false });

var Agent = new Schema({
	firstName: String,
	lastName: String,
	organisation: String,
	position: String,
	address: String,
	city : String,
	state : String,
	country : String,
	postalCode : String,
	phone: String,
	email: String,
	homepage : String,
	personnelDirectory : String,
	personnelIdentifier : String,
	role: String
}, { versionKey: false });

var AncillaryData = new Schema({
	//identifier : String,
	dataType : String,
	mimeType : String, 
	agent: [Agent],
	created : { type: Date },
	modified : { type: Date },
	title : String,
	license : String,
	rights  : String,
	rightsHolder : String,
	bibliographicCitation : String,
	audience: [String],
	source : String,
	subject : [String],
	description : String,
	mediaURL : [String],
	thumbnailURL : String,
	location : String,
	geoPoint : String,
	additionalInformation : String,
	dataObject: String,
	reference : [Reference]
},{ collection: 'ancillaryData', versionKey: false });

/*
var Element = new Schema ({
	ancillaryData : [{type: Schema.Types.ObjectId, ref: 'AncillaryData'}]
});
*/

var Record = new Schema({ creation_date : { type: Date, index: true }, update_date : { type: Date, index: true }, scientificNameSimple : { type: String, index: true }, threatStatusValue: { type: String, index: true } }, { collection: 'Record', strict: false, versionKey: false });

Record.plugin(mongoosePaginate);

var Element = new Schema ({
	//ancillaryData : [AncillaryData]
	ancillaryData: { type: [AncillaryData], default: void 0 }
}, { versionKey: false });

var ElementVersion = new Schema ({
	id_record : { type: Schema.Types.ObjectId, ref: 'RecordVersion' },
	created : { type: Date, default: Date.now },
	id_user : String,
	version : { type: Number, min: 0 },
	state : String,
	element : String,
	edition_type : String 
});

var RecordVersion = new Schema({
	language : String,
	moreInformationVersion : [{ type: Schema.Types.ObjectId, ref: 'MoreInformationVersion' }],
	associatedPartyVersion : [{ type: Schema.Types.ObjectId, ref: 'AssociatedPartyVersion' }],
	directThreatsVersion : [{ type: Schema.Types.ObjectId, ref: 'DirectThreatsVersion' }],
	baseElementsVersion : [{ type: Schema.Types.ObjectId, ref: 'BaseElementsVersion' }],
	taxonRecordNameVersion : [{ type: Schema.Types.ObjectId, ref: 'TaxonRecordNameVersion' }],
	synonymsAtomizedVersion : [{ type: Schema.Types.ObjectId, ref: 'SynonymsAtomizedVersion' }],
	commonNamesAtomizedVersion : [{ type: Schema.Types.ObjectId, ref: 'CommonNamesAtomizedVersion' }],
	hierarchyVersion : [{ type: Schema.Types.ObjectId, ref: 'HierarchyVersion' }],
	briefDescriptionVersion : [{ type: Schema.Types.ObjectId, ref: 'BriefDescriptionVersion' }],
	abstractVersion : [{ type: Schema.Types.ObjectId, ref: 'AbstractVersion' }],
	fullDescriptionVersion : [{ type: Schema.Types.ObjectId, ref: 'FullDescriptionVersion' }],
	identificationKeysVersion : [{ type: Schema.Types.ObjectId, ref: 'IdentificationKeysVersion' }],
	lifeFormVersion : [{ type: Schema.Types.ObjectId, ref: 'LifeFormVersion' }],
	lifeCycleVersion : [{ type: Schema.Types.ObjectId, ref: 'LifeCycleVersion' }],
	reproductionVersion : [{ type: Schema.Types.ObjectId, ref: 'ReproductionVersion' }],
	annualCyclesVersion : [{ type: Schema.Types.ObjectId, ref: 'AnnualCyclesVersion' }],
	molecularDataVersion : [{ type: Schema.Types.ObjectId, ref: 'MolecularDataVersion' }],
	migratoryVersion : [{ type: Schema.Types.ObjectId, ref: 'MigratoryVersion' }],
	ecologicalSignificanceVersion : [{ type: Schema.Types.ObjectId, ref: 'EcologicalSignificanceVersion' }],
	environmentalEnvelopeVersion : [{ type: Schema.Types.ObjectId, ref: 'EnvironmentalEnvelopeVersion' }],
	invasivenessVersion : [{ type: Schema.Types.ObjectId, ref: 'InvasivenessVersion' }],
	feedingVersion : [{ type: Schema.Types.ObjectId, ref: 'FeedingVersion' }],
	dispersalVersion : [{ type: Schema.Types.ObjectId, ref: 'DispersalVersion' }],
	behaviorVersion : [{ type: Schema.Types.ObjectId, ref: 'BehaviorVersion' }],
	interactionsVersion : [{ type: Schema.Types.ObjectId, ref: 'InteractionsVersion' }],
	habitatsVersion : [{ type: Schema.Types.ObjectId, ref: 'HabitatsVersion' }],
	distributionVersion : [{ type: Schema.Types.ObjectId, ref: 'DistributionVersion' }],
	territoryVersion : [{ type: Schema.Types.ObjectId, ref: 'TerritoryVersion' }],
	populationBiologyVersion : [{ type: Schema.Types.ObjectId, ref: 'PopulationBiologyVersion' }],
	threatStatusVersion : [{ type: Schema.Types.ObjectId, ref: 'ThreatStatusVersion' }],
	legislationVersion : [{ type: Schema.Types.ObjectId, ref: 'LegislationVersion' }],
	usesManagementAndConservationVersion : [{ type: Schema.Types.ObjectId, ref: 'UsesManagementAndConservationVersion' }],
	referencesVersion : [{ type: Schema.Types.ObjectId, ref: 'ReferencesVersion' }],
	ancillaryDataVersion : [{ type: Schema.Types.ObjectId, ref: 'AncillaryDataVersion' }],
	endemicAtomizedVersion : [{ type: Schema.Types.ObjectId, ref: 'EndemicAtomizedVersion' }]
}, { collection: 'RecordVersion', versionKey: false });

var MeasurementOrFact = new Schema({
	measurementID : String,
	measurementType : String,
	measurementValue : String,
	measurementAccuracy : String,
	measurementUnit : String,
	measurementDeterminedDate : String,
	measurementDeterminedBy: [String],
	measurementMethod : String,
	measurementRemarks : String,
	relatedTo : String
},{ collection : 'measurementOrFact', versionKey: false});



//module.exports = mongoose.model('Element', Element);


module.exports = {
	             	Element : mongoose.model('Element', Element),
	             	ElementVersion : mongoose.model('ElementVersion', ElementVersion),
	             	AncillaryData: mongoose.model('AncillaryData', AncillaryData ),
	             	Agent: mongoose.model('Agent', Agent ),
	             	RecordVersion : mongoose.model('RecordVersion', RecordVersion ),
	             	Record : mongoose.model('Record', Record ),
	             	Reference : mongoose.model('Reference', Reference ),
	             	MeasurementOrFact : mongoose.model('MeasurementOrFact', MeasurementOrFact)
	             };
	             