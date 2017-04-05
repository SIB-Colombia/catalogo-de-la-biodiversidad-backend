import mongoose from 'mongoose';
import async from 'async';
import ReferencesVersion from '../models/references.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postReferences(req, res) {
  var references_version  = req.body; 
    references_version._id = mongoose.Types.ObjectId();
    references_version.created=Date();
    //references_version.state="to_review";
    references_version.state="accepted";
    references_version.element="references";
    var user = references_version.id_user;
    var elementValue = references_version.references;
    references_version = new ReferencesVersion(references_version);
    var id_v = references_version._id;
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
                if(data.referencesVersion && data.referencesVersion.length !=0){
                  var lenreferences = data.referencesVersion.length;
                  var idLast = data.referencesVersion[lenreferences-1];
                  ReferencesVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of referencesVersion:" + err.message));
                    }else{
                      var prev = doc.referencesVersion;
                      var next = references_version.referencesVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        references_version.id_record=id_rc;
                        references_version.version=lenreferences+1;
                        callback(null, references_version);
                      }else{
                        callback(new Error("The data in referencesVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  references_version.id_record=id_rc;
                  references_version.version=1;
                  callback(null, references_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(references_version, callback){ 
                ver = references_version.version;
                references_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, references_version);
                  }
                });
            },
            function(references_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "referencesVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new ReferencesVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new ReferencesVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save ReferencesVersion', element: 'references', version : ver, _id: id_v, id_record : id_rc });
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

function getReferences(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    ReferencesVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated ReferencesVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a ReferencesVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a ReferencesVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedReferences(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        ReferencesVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a ReferencesVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        ReferencesVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        ReferencesVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set ReferencesVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated ReferencesVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated ReferencesVersion to accepted', element: 'references', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewReferences(req, res) {
  var id_rc = req.swagger.params.id.value;
  ReferencesVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of ReferencesVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of ReferencesVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a ReferencesVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a ReferencesVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedReferences(req, res) {
  var id_rc = req.swagger.params.id.value;
  ReferencesVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last ReferencesVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last ReferencesVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a ReferencesVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postReferences,
  getReferences,
  setAcceptedReferences,
  getToReviewReferences,
  getLastAcceptedReferences
};