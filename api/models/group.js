var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');

//group or collection
var Group = new Schema ({
	title : String,
	users : [String],
	admins : {type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 3'] }, //***************
	institution : String, //***
	image : String,
	created : { type: Date, default: Date.now },
	description : String,
	tags : [String],
	records : [{ type: Schema.Types.ObjectId, ref: 'Records' }]
},{ collection: 'Groups' });

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model('Group', Group );