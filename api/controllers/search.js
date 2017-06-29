import mongoose from 'mongoose';
import async from 'async';
import mongoosePaginate from 'mongoose-paginate';
import TaxonRecordNameVersion from '../models/taxonRecordName.js';
import add_objects from '../models/additionalModels.js';
import mapElements from '../models/elementNames.js';
import Property from '../models/property.js';
import { logger }  from '../../server/log';

mongoose.Promise = require('bluebird');

function simpleSearchRecord(req, res) {
	if (req.swagger.params.q.value) {
		var qword = req.swagger.params.q.value;
		console.log(qword);
		var reg_ex = '.*'+qword+'.*';
		//var query = add_objects.Record.find({$or:[ {'scientificNameSimple':{'$regex' : reg_ex, '$options' : 'i'}}, {'taxonRecordNameApprovedInUse.taxonRecordName.scientificName.canonicalName':{'$regex' : reg_ex, '$options' : 'i'}}, {'commonNames.name':{'$regex' : reg_ex, '$options' : 'i'}}, {'AbstractApprovedInUse.abstract':{'$regex' : reg_ex, '$options' : 'i'}}, {'FullDescriptionApprovedInUse.fullDescription.fullDescriptionUnstructured':{'$regex' : reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple creation_date update_date');
		var query = add_objects.Record.find({$or:[ {'scientificNameSimple':{ '$regex': reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple creation_date update_date');
  		query.exec(function (err, data) {
    		if(err){
      			logger.error('Error getting list of records', JSON.stringify({ message:err }) );
      			res.json(err);
    		}else if(data.length==0){
    			res.status(406);
      			res.json({"message" : "Not found results for the simple search: "+req.swagger.params.q.value});
    		}else{
      			logger.info('Simple search', JSON.stringify({ query: req.swagger.params.q.value }) );
        		res.json(data);
    		}
  		});
 	}else{
 		console.log("No query");
 	}
}

module.exports = {
  simpleSearchRecord
};