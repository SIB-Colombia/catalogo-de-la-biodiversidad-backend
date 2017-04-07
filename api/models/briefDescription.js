var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Element = require('mongoose').model('Element').schema;
var ElementVersion = require('mongoose').model('ElementVersion').schema;
var RecordVersion = require('mongoose').model('RecordVersion').schema;

var BriefDescriptionVersion = ElementVersion.extend ({
	briefDescription : String
},{ collection: 'BriefDescriptionVersion' });

module.exports = mongoose.model('BriefDescriptionVersion', BriefDescriptionVersion );