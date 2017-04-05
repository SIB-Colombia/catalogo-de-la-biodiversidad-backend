var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var recordSchema = new Schema({name:String}, { strict: false, versionKey: false });

/*
BaseElements
Language
Version
Revision
taxonRecordName
*/


module.exports = mongoose.model('Record', recordSchema);