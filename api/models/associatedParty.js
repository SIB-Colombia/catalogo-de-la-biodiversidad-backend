var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var Agent = require('mongoose').model('Agent').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var AssociatedPartyVersion = ElementVersion.extend({
	associatedParty : [Agent]
}, { collection: 'AssociatedPartyVersion', versionKey: false });

module.exports = mongoose.model( 'AssociatedPartyVersion', AssociatedPartyVersion );