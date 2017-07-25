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
    var numberRecords = req.swagger.params.size.value;
		var reg_ex = '.*'+qword+'.*';
    var query = add_objects.Record.find({$or:[ {'scientificNameSimple':{ '$regex': reg_ex, '$options' : 'i'}}, {'taxonRecordNameApprovedInUse.taxonRecordName.scientificName.canonicalName': {'$regex': reg_ex, '$options' : 'i'}}, {'commonNames.name': {'$regex': reg_ex, '$options' : 'i'}}, {'abstractApprovedInUse.abstract': {'$regex': reg_ex, '$options' : 'i'}}, {'fullDescriptionApprovedInUse.fullDescription.fullDescriptionUnstructured': {'$regex': reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).limit(numberRecords);
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
    res.json({message: "No query for search" });
 	}
}


function advancedSearchRecord(req, res) {
  var query = {};
  var queryParam = {};
  var queryArray = [];
  var queryHierarchyArray = [];
  var num = 0;
  var num_hier = 0;
  var numberRecords = req.swagger.params.size.value;

  //console.log(req.swagger.params);
  //console.log(numberRecords);

  if(req.swagger.params.scientificName.value){
    var scientificNameArray = req.swagger.params.scientificName.value;
    console.log(req.swagger.params.scientificName.value.length);
    for(var i=0; i < req.swagger.params.scientificName.value.length; i++){
      scientificNameArray[i] = new RegExp('.*'+req.swagger.params.scientificName.value[i]+'.*', 'i');
    }
    console.log(scientificNameArray.length);
    console.log(scientificNameArray);
    queryArray[num]={'scientificNameSimple': { $in: scientificNameArray }};
    num++;
  }

 
  if(req.swagger.params.kingdomName.value){
    var kingdomNameArray = req.swagger.params.kingdomName.value;
    console.log(req.swagger.params.kingdomName.value.length);
    for(var i=0; i < req.swagger.params.kingdomName.value.length; i++){
      kingdomNameArray[i] = new RegExp('.*'+req.swagger.params.kingdomName.value[i]+'.*', 'i');
    }
    console.log(kingdomNameArray.length);
    console.log(kingdomNameArray);
    queryHierarchyArray[num_hier]={'hierarchy.kingdom': { $in: kingdomNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.phylumName.value){
    var phylumNameArray = req.swagger.params.phylumName.value;
    console.log(req.swagger.params.phylumName.value.length);
    for(var i=0; i < req.swagger.params.phylumName.value.length; i++){
      phylumNameArray[i] = new RegExp('.*'+req.swagger.params.phylumName.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.phylum': { $in: phylumNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.className.value){
    var classNameArray = req.swagger.params.className.value;
    console.log(req.swagger.params.className.value.length);
    for(var i=0; i < req.swagger.params.className.value.length; i++){
      classNameArray[i] = new RegExp('.*'+req.swagger.params.className.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.classHierarchy': { $in: classNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.orderName.value){
    var orderNameArray = req.swagger.params.orderName.value;
    console.log(req.swagger.params.orderName.value.length);
    for(var i=0; i < req.swagger.params.orderName.value.length; i++){
      orderNameArray[i] = new RegExp('.*'+req.swagger.params.orderName.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.order': { $in: orderNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.familyName.value){
    var familyNameArray = req.swagger.params.familyName.value;
    console.log(req.swagger.params.familyName.value.length);
    for(var i=0; i < req.swagger.params.familyName.value.length; i++){
      familyNameArray[i] = new RegExp('.*'+req.swagger.params.familyName.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.family': { $in: familyNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.genusName.value){
    var genusNameArray = req.swagger.params.genusName.value;
    console.log(req.swagger.params.genusName.value.length);
    for(var i=0; i < req.swagger.params.genusName.value.length; i++){
      genusNameArray[i] = new RegExp('.*'+req.swagger.params.genusName.value[i]+'.*', 'i');
    }
    queryHierarchyArray[num_hier]={'hierarchy.genus': { $in: genusNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.subGenusName.value){
    var subGenusNameArray = req.swagger.params.subGenusName.value;
    console.log(req.swagger.params.subGenusName.value.length);
    for(var i=0; i < req.swagger.params.subGenusName.value.length; i++){
      subGenusNameArray[i] = new RegExp('.*'+req.swagger.params.subGenusName.value[i]+'.*', 'i');
    }
    queryHierarchyArray[num_hier]={'hierarchy.subgenus': { $in: subGenusNameArray  }};
    num_hier++;
  }

  /*
  console.log('!');
  console.log('length: '+queryHierarchyArray.length);
  */
  if(queryHierarchyArray.length !=0){
    queryArray[num]= {$or:queryHierarchyArray};
    num++;
  }

  
  if(req.swagger.params.departmentName.value){
    var departmentNameArray = req.swagger.params.departmentName.value;
    console.log(req.swagger.params.departmentName.value.length);
    for(var i=0; i < req.swagger.params.departmentName.value.length; i++){
      departmentNameArray[i] = new RegExp('.*'+req.swagger.params.departmentName.value[i]+'.*', 'i');
    }
    queryArray[num]={'distributionApprovedInUse.distribution.distributionAtomized.stateProvince': { $in: departmentNameArray }};
    num++;
  }

  /*
  if(req.swagger.params.threatCategory.value){
    var threatCategoryArray = req.swagger.params.threatCategory.value;
    console.log(req.swagger.params.threatCategory.value.length);
    for(var i=0; i < req.swagger.params.threatCategory.value.length; i++){
      threatCategoryArray[i] = new RegExp('.*'+req.swagger.params.threatCategory.value[i]+'.*', 'i');
    }
    queryArray[num]={'threatStatusApprovedInUse.threatStatus.threatStatusAtomized.threatCategory.measurementValue': { $in: threatCategoryArray }};
    num++;
  }
  */

  if(req.swagger.params.threatCategory.value){
    var queryThreatCategoryArray = [];
    var threatCategoryArray = req.swagger.params.threatCategory.value;
    for(var i=0; i < req.swagger.params.threatCategory.value.length; i++){
      //threatCategoryArray[i] = new RegExp('.*'+req.swagger.params.threatCategory.value[i]+'.*', 'i');
      threatCategoryArray[i] = req.swagger.params.threatCategory.value[i];
    }
    queryThreatCategoryArray[0]={'threatStatusApprovedInUse.threatStatus.threatStatusAtomized.threatCategory.measurementValue': { $in: threatCategoryArray  }};
    queryThreatCategoryArray[1]={'threatStatusApprovedInUse.threatStatus.threatStatusAtomized.apendiceCITES': { $in: threatCategoryArray  }};
    queryArray[num]= {$or:queryThreatCategoryArray};
    num++;
  }

  
  /*
  console.log(req.swagger.params.count.value);
  console.log(num);
  console.log(JSON.stringify(queryArray));
  console.log(queryArray.length);
  */

  var isCount = req.swagger.params.count.value;

  if(queryArray.length > 0){
    if(isCount){
      query = add_objects.Record.find({$and:queryArray}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).count();
    }else{
      query = add_objects.Record.find({$and:queryArray}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).limit(numberRecords);
    }
  }else{
    query = add_objects.Record.find({}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).count();
    isCount = true;
  }

  query.exec(function (err, data) {
    if(err){
      logger.error('Error getting list of records', JSON.stringify({ message:err }) );
      res.json(err);
    }else if(data.length==0){
      res.status(406);
      res.json({"message" : "Not found results for the advaced search"});
    }else{
      if(isCount){
        logger.info('Number or documents', JSON.stringify({ total: data }) );
        res.json({ total: data });
      }else{
        logger.info('Number or documents', JSON.stringify({ total: data.length }) );
        res.json(data);
      }
    }
  });

}


module.exports = {
  simpleSearchRecord,
  advancedSearchRecord
};