var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;

var Property = new Schema ({
	concept : String,
	language : String,
	plinianCoreElement : String,
	translation : String,
	definition: String
},{ collection: 'Properties', versionKey: false });

module.exports = mongoose.model('Property', Property );