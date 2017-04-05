var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var Reference = require('mongoose').model('Reference').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var ReferencesVersion = ElementVersion.extend({
	references : [Reference]
}, { collection: 'ReferencesVersion', versionKey: false });

module.exports = mongoose.model( 'ReferencesVersion', ReferencesVersion );