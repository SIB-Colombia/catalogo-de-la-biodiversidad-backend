import mongoose from 'mongoose';
import async from 'async';
import winston from 'winston';
import mongoosePaginate from 'mongoose-paginate';
import TaxonRecordNameVersion from '../models/taxonRecordName.js';
import add_objects from '../models/additionalModels.js';
import mapElements from '../models/elementNames.js';
import Property from '../models/property.js';
import { logger }  from '../../server/log';


function searchRecord(req, res) {
 if (req.swagger.params.q.value) {
 	console.log(req.swagger.params.q.value);
 }else{
 	console.log("No query");
 }
}

module.exports = {
  searchRecord
};