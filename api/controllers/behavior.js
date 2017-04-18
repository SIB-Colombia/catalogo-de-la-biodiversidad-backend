import mongoose from 'mongoose';
import async from 'async';
import BehaviorVersion from '../models/behavior.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postBehavior(req, res) {
  var behavior_version  = req.body; 
    behavior_version._id = mongoose.Types.ObjectId();
    behavior_version.created=Date();
    //behavior_version.state="to_review";
    behavior_version.state="accepted";
    behavior_version.element="behavior";
    var user = behavior_version.id_user;
    var elementValue = behavior_version.behavior;
    behavior_version = new BehaviorVersion(behavior_version);
    var id_v = behavior_version._id;
    var id_rc = req.swagger.params.id.value;

    var ob_ids= new Array();
    ob_ids.push(id_v);

    var ver = "";

    if(typeof  id_rc!=="undefined" && id_rc!=""){
      if(typeof  elementValue!=="undefined" && elementValue !==""){
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
                if(data.behaviorVersion && data.behaviorVersion.length !=0){
                  var lenbehavior = data.behaviorVersion.length;
                  var idLast = data.behaviorVersion[lenbehavior-1];
                  BehaviorVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of behaviorVersion:" + err.message));
                    }else{
                      var prev = doc.behaviorVersion;
                      var next = behavior_version.behaviorVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        behavior_version.id_record=id_rc;
                        behavior_version.version=lenbehavior+1;
                        callback(null, behavior_version);
                      }else{
                        callback(new Error("The data in behaviorVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  behavior_version.id_record=id_rc;
                  behavior_version.version=1;
                  callback(null, behavior_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(behavior_version, callback){ 
                ver = behavior_version.version;
                behavior_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, behavior_version);
                  }
                });
            },
            function(behavior_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "behaviorVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new BehaviorVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new BehaviorVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save BehaviorVersion', element: 'behavior', version : ver, _id: id_v, id_record : id_rc });
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

function getBehavior(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    BehaviorVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated BehaviorVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a BehaviorVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a BehaviorVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedBehavior(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        BehaviorVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a BehaviorVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        BehaviorVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        BehaviorVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set BehaviorVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated BehaviorVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated BehaviorVersion to accepted', element: 'behavior', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewBehavior(req, res) {
  var id_rc = req.swagger.params.id.value;
  BehaviorVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of BehaviorVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of BehaviorVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a BehaviorVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a BehaviorVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedBehavior(req, res) {
  var id_rc = req.swagger.params.id.value;
  BehaviorVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last BehaviorVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last BehaviorVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a BehaviorVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postBehavior,
  getBehavior,
  setAcceptedBehavior,
  getToReviewBehavior,
  getLastAcceptedBehavior
};