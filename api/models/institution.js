var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var ad_objects = require('./additionalModels.js');
var Agent = require('mongoose').model('Agent').schema;


var Institution = new Schema ({
//var User = Agent.extend({
	//id_user: { type: String, required: true, unique: true }, //***
	id_institution : { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
	description: String,
	groups : [{ type: Schema.Types.ObjectId, ref: 'Groups' }]
},{ collection: 'Institution' });

User.plugin(uniqueValidator);

module.exports = mongoose.model('User', User );