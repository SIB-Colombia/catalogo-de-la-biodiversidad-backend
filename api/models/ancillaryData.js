var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var AncillaryDataVersion = ElementVersion.extend({
	ancillaryData : [AncillaryData]
}, { collection: 'AncillaryDataVersion', versionKey: false });

module.exports = mongoose.model( 'AncillaryDataVersion', AncillaryDataVersion );