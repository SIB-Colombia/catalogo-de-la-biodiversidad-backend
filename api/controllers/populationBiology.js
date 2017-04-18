import mongoose from 'mongoose';
import async from 'async';
import PopulationBiologyVersion from '../models/populationBiology.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postPopulationBiology(req, res) {
  var population_biology_version  = req.body; 
    population_biology_version._id = mongoose.Types.ObjectId();
    population_biology_version.created=Date();
    //population_biology_version.state="to_review";
    population_biology_version.state="accepted";
    population_biology_version.element="populationBiology";
    var user = population_biology_version.id_user;
    var elementValue = population_biology_version.populationBiology;
    population_biology_version = new PopulationBiologyVersion(population_biology_version);
    var id_v = population_biology_version._id;
    var id_rc = req.swagger.params.id.value;

    var ob_ids= new Array();
    ob_ids.push(id_v);

    var ver = "";

    if(typeof  id_rc!=="undefined" && id_rc!=""){
      if(typeof  elementValue!=="undefined" && elementValue!=""){
        async.waterfall([
          function(callback){ 
                add_objects.RecordVersion.findById(id_rc , function (err, data){
                  if(err){
                      callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist.:" + err.message));
                  }else{
                      callback(null, data);
                  }
                });
            },
            function(data,callback){
              if(data){
                if(data.populationBiologyVersion && data.populationBiologyVersion.length !=0){
                  var lenpopulationBiology = data.populationBiologyVersion.length;
                  var idLast = data.populationBiologyVersion[lenpopulationBiology-1];
                  PopulationBiologyVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of populationBiologyVersion:" + err.message));
                    }else{
                      var prev = doc.populationBiologyVersion;
                      var next = population_biology_version.populationBiologyVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        population_biology_version.id_record=id_rc;
                        population_biology_version.version=lenpopulationBiology+1;
                        callback(null, population_biology_version);
                      }else{
                        callback(new Error("The data in populationBiologyVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  population_biology_version.id_record=id_rc;
                  population_biology_version.version=1;
                  callback(null, population_biology_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(population_biology_version, callback){ 
                ver = population_biology_version.version;
                population_biology_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, population_biology_version);
                  }
                });
            },
            function(population_biology_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "populationBiologyVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
                  if(err){
                      callback(new Error("failed added id to RecordVersion:" + err.message));
                  }else{
                      callback();
                  }
                });
            }
            ],
            function(err, result) {
                if (err) {
                  logger.error('Error Creation of a new PopulationBiologyVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new PopulationBiologyVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save PopulationBiologyVersion', element: 'populationBiology', version : ver, _id: id_v, id_record : id_rc });
               }      
            });

      }else{
        logger.warn('Empty data in version of the element' );
        res.status(400);
        res.json({message: "Empty data in version of the element"});
      }
    }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
    }

}

function getPopulationBiology(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    PopulationBiologyVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated PopulationBiologyVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a PopulationBiologyVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a PopulationBiologyVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedPopulationBiology(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        PopulationBiologyVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a PopulationBiologyVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        PopulationBiologyVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        PopulationBiologyVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else{
            callback();
          }
        });
      }
    ],
    function(err, result) {
      if (err) {
        logger.error('Error to set PopulationBiologyVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated PopulationBiologyVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated PopulationBiologyVersion to accepted', element: 'populationBiology', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewPopulationBiology(req, res) {
  var id_rc = req.swagger.params.id.value;
  PopulationBiologyVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of PopulationBiologyVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of PopulationBiologyVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a PopulationBiologyVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a PopulationBiologyVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedPopulationBiology(req, res) {
  var id_rc = req.swagger.params.id.value;
  PopulationBiologyVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last PopulationBiologyVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last PopulationBiologyVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a PopulationBiologyVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postPopulationBiology,
  getPopulationBiology,
  setAcceptedPopulationBiology,
  getToReviewPopulationBiology,
  getLastAcceptedPopulationBiology
};