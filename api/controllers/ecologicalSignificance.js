import mongoose from 'mongoose';
import async from 'async';
import EcologicalSignificanceVersion from '../models/ecologicalSignificance.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';


function postEcologicalSignificance(req, res) {
  var ecological_significance_version  = req.body; 
    ecological_significance_version._id = mongoose.Types.ObjectId();
    ecological_significance_version.created=Date();
    //ecological_significance_version.state="to_review";
    ecological_significance_version.state="accepted";
    ecological_significance_version.element="ecologicalSignificance";
    var user = ecological_significance_version.id_user;
    var elementValue = ecological_significance_version.ecologicalSignificance;
    ecological_significance_version = new EcologicalSignificanceVersion(ecological_significance_version);
    var id_v = ecological_significance_version._id;
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
                if(data.ecologicalSignificanceVersion && data.ecologicalSignificanceVersion.length !=0){
                  var lenEcologicalSignificance = data.ecologicalSignificanceVersion.length;
                  var idLast = data.ecologicalSignificanceVersion[lenEcologicalSignificance-1];
                  EcologicalSignificanceVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of EcologicalSignificanceVersion:" + err.message));
                    }else{
                      var prev = doc.ecologicalSignificanceVersion;
                      var next = ecological_significance_version.ecologicalSignificanceVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        ecological_significance_version.id_record=id_rc;
                        ecological_significance_version.version=lenEcologicalSignificance+1;
                        callback(null, ecological_significance_version);
                      }else{
                        callback(new Error("The data in EcologicalSignificanceVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  ecological_significance_version.id_record=id_rc;
                  ecological_significance_version.version=1;
                  callback(null, ecological_significance_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(ecological_significance_version, callback){ 
                ver = ecological_significance_version.version;
                ecological_significance_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, ecological_significance_version);
                  }
                });
            },
            function(ecological_significance_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "ecologicalSignificanceVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new EcologicalSignificanceVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new EcologicalSignificanceVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save EcologicalSignificanceVersion', element: 'ecologicalSignificance', version : ver, _id: id_v, id_record : id_rc });
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

function getEcologicalSignificance(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    EcologicalSignificanceVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated EcologicalSignificance', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a EcologicalSignificance with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a EcologicalSignificanceVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedEcologicalSignificance(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        EcologicalSignificanceVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a EcologicalSignificanceVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        EcologicalSignificanceVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        EcologicalSignificanceVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set EcologicalSignificanceVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated EcologicalSignificanceVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated EcologicalSignificanceVersion to accepted', element: 'ecologicalSignificance', version : version, id_record : id_rc });
      }      
    });
  }else{
    //res.status(406);
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewEcologicalSignificance(req, res) {
  var id_rc = req.swagger.params.id.value;
  EcologicalSignificanceVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of EcologicalSignificance at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of EcologicalSignificanceVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a EcologicalSignificanceVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a EcologicalSignificanceVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedEcologicalSignificance(req, res) {
  var id_rc = req.swagger.params.id.value;
  EcologicalSignificanceVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last EcologicalSignificanceVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer.length !== 0){
        logger.info('Get last EcologicalSignificanceVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a EcologicalSignificanceVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postEcologicalSignificance,
  getEcologicalSignificance,
  setAcceptedEcologicalSignificance,
  getToReviewEcologicalSignificance,
  getLastAcceptedEcologicalSignificance
};