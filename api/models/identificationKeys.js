var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var AncillaryData = require('mongoose').model('AncillaryData').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var IdentificationKeys = Element.extend({
	keys : String
}, { collection: 'identificationKeys' });

var IdentificationKeysVersion = ElementVersion.extend({
	identificationKeys : IdentificationKeys
}, { collection: 'IdentificationKeysVersion' });

module.exports = mongoose.model( 'IdentificationKeysVersion', IdentificationKeysVersion );