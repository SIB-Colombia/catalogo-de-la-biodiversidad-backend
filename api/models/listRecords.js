var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');

var ListRecords = new Schema ({
	id_user : String,
	records : [{ type: Schema.Types.ObjectId, ref: 'RecordVersion' }],
	created : { type: Date, default: Date.now },
	updated : { type: Date },
	description : String,
	tags : [String],
	group : { type: Schema.Types.ObjectId, ref: 'Groups' }
},{ collection: 'ListRecords' });

module.exports = mongoose.model('ListRecords', ListRecords );