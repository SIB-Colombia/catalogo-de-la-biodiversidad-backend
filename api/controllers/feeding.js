import mongoose from 'mongoose';
import async from 'async';
import FeedingVersion from '../models/feeding.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postFeeding(req, res) {
  var feeding_version  = req.body; 
    feeding_version._id = mongoose.Types.ObjectId();
    feeding_version.created=Date();
    feeding_version.state="to_review";
    //feeding_version.state="accepted";
    feeding_version.element="feeding";
    var user = feeding_version.id_user;
    var elementValue = feeding_version.feeding;
    feeding_version = new FeedingVersion(feeding_version);
    var id_v = feeding_version._id;
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
                if(data.feedingVersion && data.feedingVersion.length !=0){
                  var lenfeeding = data.feedingVersion.length;
                  var idLast = data.feedingVersion[lenfeeding-1];
                  FeedingVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of feedingVersion:" + err.message));
                    }else{
                      var prev = doc.feedingVersion;
                      var next = feeding_version.feedingVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        feeding_version.id_record=id_rc;
                        feeding_version.version=lenfeeding+1;
                        callback(null, feeding_version);
                      }else{
                        callback(new Error("The data in feedingVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  feeding_version.id_record=id_rc;
                  feeding_version.version=1;
                  callback(null, feeding_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(feeding_version, callback){ 
                ver = feeding_version.version;
                feeding_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, feeding_version);
                  }
                });
            },
            function(feeding_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "feedingVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new FeedingVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new FeedingVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save FeedingVersion', element: 'feeding', version : ver, _id: id_v, id_record : id_rc });
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

function getFeeding(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    FeedingVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated FeedingVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a FeedingVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a FeedingVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedFeeding(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        FeedingVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a FeedingVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        FeedingVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        FeedingVersion.findOneAndUpdate({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else{
            callback(null, elementVer);
          }
        });
      },
      function(elementVer,callback){ 
        elementVer.state="accepted";
        add_objects.Record.update({_id:id_rc},{ feedingAccepted: elementVer }, function(err, result){
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
        logger.error('Error to set FeedingVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated FeedingVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated FeedingVersion to accepted', element: 'feeding', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewFeeding(req, res) {
  var id_rc = req.swagger.params.id.value;
  FeedingVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of FeedingVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of FeedingVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a FeedingVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a FeedingVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedFeeding(req, res) {
  var id_rc = req.swagger.params.id.value;
  FeedingVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last FeedingVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last FeedingVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a FeedingVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postFeeding,
  getFeeding,
  setAcceptedFeeding,
  getToReviewFeeding,
  getLastAcceptedFeeding
};