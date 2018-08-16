import mongoose from 'mongoose';
import async from 'async';
import mongoosePaginate from 'mongoose-paginate';
import TaxonRecordNameVersion from '../models/taxonRecordName.js';
import add_objects from '../models/additionalModels.js';
import mapElements from '../models/elementNames.js';
import Property from '../models/property.js';
import { logger }  from '../../server/log';

mongoose.Promise = require('bluebird');

var department_iso ={
  "CO-DC": "Bogotá Distrito Capital",
  "CO-AMA": "Amazonas",
  "CO-ANT": "Antioquia",
  "CO-ARA": "Arauca",
  "CO-ATL": "Atlántico",
  "CO-BOL": "Bolívar",
  "CO-BOY": "Boyacá",
  "CO-CAL": "Caldas",
  "CO-CAQ": "Caquetá",
  "CO-CAS": "Casanare",
  "CO-CAU": "Cauca",
  "CO-CES": "Cesar",
  "CO-COR": "Córdoba",
  "CO-CUN": "Cundinamarca",
  "CO-CHO": "Chocó",
  "CO-GUA": "Guainía",
  "CO-GUV": "Guaviare",
  "CO-HUI": "Huila",
  "CO-LAG": "La Guajira",
  "CO-MAG": "Magdalena",
  "CO-MET": "Meta",
  "CO-NAR": "Nariño",
  "CO-NSA": "Norte de Santander",
  "CO-PUT": "Putumayo",
  "CO-QUI": "Quindío",
  "CO-RIS": "Risaralda",
  "CO-SAP": "San Andrés, Providencia y Santa Catalina",
  "CO-SAN": "Santander",
  "CO-SUC": "Sucre",
  "CO-TOL": "Tolima",
  "CO-VAC": "Valle del Cauca",
  "CO-VAU": "Vaupés",
  "CO-VID": "Vichada"
}

function simpleSearchRecord(req, res) {
	if (req.swagger.params.q.value) {
		var qword = req.swagger.params.q.value;
    var numberRecords = req.swagger.params.size.value;
    var regexR1=/[^a-zA-Z0-9,:;óíáéúñ()\-\.\s]+/g;
    var alter_qword = qword.replace(regexR1,'').replace(/\s+/g," ");
		//var reg_ex = '.*'+qword+'.*';
    //var reg_ex = '^'+qword+'$';
    var reg_ex = '\\b'+qword+'\\b';
    var isCount = req.swagger.params.count.value;
    var query;
    if(isCount){
      query = add_objects.Record.find({$or:[ {'scientificNameSimple':{ '$regex': reg_ex, '$options' : 'i'}}, {'taxonRecordNameApprovedInUse.taxonRecordName.scientificName.canonicalName': {'$regex': reg_ex, '$options' : 'i'}}, {'commonNames.name': {'$regex': reg_ex, '$options' : 'i'}}, {'abstractApprovedInUse.abstract': {'$regex': reg_ex, '$options' : 'i'}}, {'fullDescriptionApprovedInUse.fullDescription.fullDescriptionUnstructured': {'$regex': reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).count();
    }else{
      query = add_objects.Record.find({$or:[ {'scientificNameSimple':{ '$regex': reg_ex, '$options' : 'i'}}, {'taxonRecordNameApprovedInUse.taxonRecordName.scientificName.canonicalName': {'$regex': reg_ex, '$options' : 'i'}}, {'commonNames.name': {'$regex': reg_ex, '$options' : 'i'}}, {'abstractApprovedInUse.abstract': {'$regex': reg_ex, '$options' : 'i'}}, {'fullDescriptionApprovedInUse.fullDescription.fullDescriptionUnstructured': {'$regex': reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).limit(numberRecords);
    }
  		query.exec(function (err, data) {
    		if(err){
      			logger.error('Error getting list of records', JSON.stringify({ message:err }) );
      			res.json(err);
    		}else if(data.length==0){
          /*
    			res.status(406);
      	  res.json({"message" : "Not found results for the simple search: "+req.swagger.params.q.value});
          */
          reg_ex = '\\b'+alter_qword+'\\b';
          
          
          if(isCount){
            query = add_objects.Record.find({$or:[ {'scientificNameSimple':{ '$regex': reg_ex, '$options' : 'i'}}, {'taxonRecordNameApprovedInUse.taxonRecordName.scientificName.canonicalName': {'$regex': reg_ex, '$options' : 'i'}}, {'commonNames.name': {'$regex': reg_ex, '$options' : 'i'}}, {'abstractApprovedInUse.abstract': {'$regex': reg_ex, '$options' : 'i'}}, {'fullDescriptionApprovedInUse.fullDescription.fullDescriptionUnstructured': {'$regex': reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).count();
          }else{
            query = add_objects.Record.find({$or:[ {'scientificNameSimple':{ '$regex': reg_ex, '$options' : 'i'}}, {'taxonRecordNameApprovedInUse.taxonRecordName.scientificName.canonicalName': {'$regex': reg_ex, '$options' : 'i'}}, {'commonNames.name': {'$regex': reg_ex, '$options' : 'i'}}, {'abstractApprovedInUse.abstract': {'$regex': reg_ex, '$options' : 'i'}}, {'fullDescriptionApprovedInUse.fullDescription.fullDescriptionUnstructured': {'$regex': reg_ex, '$options' : 'i'}} ]}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date ').sort({update_date: -1}).limit(numberRecords);
          }
          query.exec(function (err, data) {
            if(err){
              logger.error('Error getting list of records', JSON.stringify({ message:err }) );
              res.json(err);
            }else if(data.length==0){
              res.status(406);
              res.json({"message" : "Not found results for the simple search: "+req.swagger.params.q.value});
            }else{
            if(isCount){
                logger.info('Number or documents', JSON.stringify({ total: data }) );
                res.json({ total: data });
              }else{
                logger.info('Simple search', JSON.stringify({ total: data.length }) );
                res.json(data);
              }
              //logger.info('Simple search', JSON.stringify({ query: req.swagger.params.q.value }) );
              //res.json(data);
              }
            });
      		}else{
        			logger.info('Simple search', JSON.stringify({ query: req.swagger.params.q.value }) );
              if(isCount){
                res.json({ total: data });
              }else{
            		res.json(data);
              }
        		
    		}
  		});
 	}else{
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

  if(req.swagger.params.scientificName.value){
    var scientificNameArray = req.swagger.params.scientificName.value;
    for(var i=0; i < req.swagger.params.scientificName.value.length; i++){
      scientificNameArray[i] = new RegExp('.*'+req.swagger.params.scientificName.value[i]+'.*', 'i');
    }
    queryArray[num]={'scientificNameSimple': { $in: scientificNameArray }};
    num++;
  }

 
  if(req.swagger.params.kingdom.value){
    var kingdomNameArray = req.swagger.params.kingdom.value;
    for(var i=0; i < req.swagger.params.kingdom.value.length; i++){
      kingdomNameArray[i] = new RegExp('.*'+req.swagger.params.kingdom.value[i]+'.*', 'i');
    }
    queryHierarchyArray[num_hier]={'hierarchy.kingdom': { $in: kingdomNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.phylum.value){
    var phylumNameArray = req.swagger.params.phylum.value;
    for(var i=0; i < req.swagger.params.phylum.value.length; i++){
      phylumNameArray[i] = new RegExp('.*'+req.swagger.params.phylum.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.phylum': { $in: phylumNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.class.value){
    var classNameArray = req.swagger.params.class.value;
    for(var i=0; i < req.swagger.params.class.value.length; i++){
      classNameArray[i] = new RegExp('.*'+req.swagger.params.class.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.classHierarchy': { $in: classNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.order.value){
    var orderNameArray = req.swagger.params.order.value;
    for(var i=0; i < req.swagger.params.order.value.length; i++){
      orderNameArray[i] = new RegExp('.*'+req.swagger.params.order.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.order': { $in: orderNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.family.value){
    var familyNameArray = req.swagger.params.family.value;
    for(var i=0; i < req.swagger.params.family.value.length; i++){
      familyNameArray[i] = new RegExp('.*'+req.swagger.params.family.value[i]+'.*', 'i');
    }
    //queryParam['hierarchy.kingdom']={ $in: kingdomNameArray };
    queryHierarchyArray[num_hier]={'hierarchy.family': { $in: familyNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.genus.value){
    var genusNameArray = req.swagger.params.genus.value;
    for(var i=0; i < req.swagger.params.genus.value.length; i++){
      genusNameArray[i] = new RegExp('.*'+req.swagger.params.genus.value[i]+'.*', 'i');
    }
    queryHierarchyArray[num_hier]={'hierarchy.genus': { $in: genusNameArray  }};
    num_hier++;
  }

  if(req.swagger.params.subGenus.value){
    var subGenusNameArray = req.swagger.params.subGenus.value;
    for(var i=0; i < req.swagger.params.subGenus.value.length; i++){
      subGenusNameArray[i] = new RegExp('.*'+req.swagger.params.subGenus.value[i]+'.*', 'i');
    }
    queryHierarchyArray[num_hier]={'hierarchy.subgenus': { $in: subGenusNameArray  }};
    num_hier++;
  }


  if(queryHierarchyArray.length !=0){
    queryArray[num]= {$or:queryHierarchyArray};
    num++;
  }

  
  
  if(req.swagger.params.department.value){
    var departmentNameArray = req.swagger.params.department.value;
    for(var i=0; i < req.swagger.params.department.value.length; i++){
      departmentNameArray[i] = new RegExp('.*'+department_iso[req.swagger.params.department.value[i]]+'.*', 'i');
    }
    queryArray[num]={'distributionApprovedInUse.distribution.distributionAtomized.stateProvince': { $in: departmentNameArray }};
    num++;
  }
  


  

  /*
  if(req.swagger.params.department.value){
    var departmentNameArray = req.swagger.params.department.value;
    console.log(req.swagger.params.department.value.length);
    for(var i=0; i < req.swagger.params.department.value.length; i++){
      departmentNameArray[i] = new RegExp('.*'+req.swagger.params.department.value[i]+'.*', 'i');
    }
    queryArray[num]={'distributionApprovedInUse.distribution.distributionAtomized.stateProvince': { $in: departmentNameArray }};
    num++;
  }

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
  if(req.swagger.params.multimedia.value){
    var multimediaArray = req.swagger.params.multimedia.value;
    console.log(req.swagger.params.multimedia.value.length);
    for(var i=0; i < req.swagger.params.multimedia.value.length; i++){
      multimediaArray[i] = req.swagger.params.multimedia.value[i];
    }
    queryArray[num]={'ancillaryDataApprovedInUse.ancillaryData.dataType': { $in: multimediaArray }};
    num++;
  }
  */

  if(req.swagger.params.multimedia.value){
    var queryMultimediaArray = [];
    var multimediaArray = req.swagger.params.multimedia.value;
    for(var i=0; i < req.swagger.params.multimedia.value.length; i++){
      multimediaArray[i] = req.swagger.params.multimedia.value[i];
    }
    queryMultimediaArray[0]={'ancillaryDataApprovedInUse.ancillaryData.dataType': { $in: multimediaArray }};
    if(multimediaArray.includes('image')){
      queryMultimediaArray[1]={'imageInfo': {$exists: true}};
    }
    queryArray[num]= {$or:queryMultimediaArray};
    num++;
  }


  if(req.swagger.params.invasiveness.value){
    queryArray[num]={'invasivenessApprovedInUse.invasiveness.invasivenessUnstructured': {$exists: true, $not: {$size: 0}, $ne: '' }};
    num++; 
  }


  
  var isCount = req.swagger.params.count.value;

  if(queryArray.length > 0){
    if(isCount){
      query = add_objects.Record.find({$and:queryArray}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date threatStatusApprovedInUse fullDescriptionApprovedInUse').sort({update_date: -1}).count();
    }else{
      query = add_objects.Record.find({$and:queryArray}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date threatStatusApprovedInUse fullDescriptionApprovedInUse').sort({update_date: -1}).limit(numberRecords);
    }
  }else{
    query = add_objects.Record.find({}).select('_id scientificNameSimple imageInfo threatStatusValue commonNames creation_date update_date threatStatusApprovedInUse fullDescriptionApprovedInUse').sort({update_date: -1}).count();
    isCount = true;
  }

  
  console.log("query: ", query)
  
  query.exec(function (err, data) {
    if(err){
      logger.error('Error getting list of records', JSON.stringify({ message:err }) );
      res.json(err);
    }else if(data.length==0){
      res.status(406);
      res.json({"message" : "Not found results for the advancedSearchRecordced search"});
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
