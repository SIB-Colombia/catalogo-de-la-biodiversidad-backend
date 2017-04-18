import mongoose from 'mongoose';
import async from 'async';
import LifeCycleVersion from '../models/lifeCycle.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postLifeCycle(req, res) {
  var life_cycle_version  = req.body; 
    life_cycle_version._id = mongoose.Types.ObjectId();
    life_cycle_version.created=Date();
    //life_cycle_version.state="to_review";
    life_cycle_version.state="accepted";
    life_cycle_version.element="lifeCycle";
    var user = life_cycle_version.id_user;
    var elementValue = life_cycle_version.lifeCycle;
    life_cycle_version = new LifeCycleVersion(life_cycle_version);
    var id_v = life_cycle_version._id;
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
                if(data.lifeCycleVersion && data.lifeCycleVersion.length !=0){
                  var lenlifeCycle = data.lifeCycleVersion.length;
                  var idLast = data.lifeCycleVersion[lenlifeCycle-1];
                  LifeCycleVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of lifeCycleVersion:" + err.message));
                    }else{
                      var prev = doc.lifeCycleVersion;
                      var next = life_cycle_version.lifeCycleVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        life_cycle_version.id_record=id_rc;
                        life_cycle_version.version=lenlifeCycle+1;
                        callback(null, life_cycle_version);
                      }else{
                        callback(new Error("The data in lifeCycleVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  life_cycle_version.id_record=id_rc;
                  life_cycle_version.version=1;
                  callback(null, life_cycle_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(life_cycle_version, callback){ 
                ver = life_cycle_version.version;
                life_cycle_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, life_cycle_version);
                  }
                });
            },
            function(life_cycle_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "lifeCycleVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new LifeCycleVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new LifeCycleVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save LifeCycleVersion', element: 'lifeCycle', version : ver, _id: id_v, id_record : id_rc });
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

function getLifeCycle(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    LifeCycleVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated LifeCycleVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a LifeCycleVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a LifeCycleVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedLifeCycle(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        LifeCycleVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a LifeCycleVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        LifeCycleVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        LifeCycleVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set LifeCycleVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated LifeCycleVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated LifeCycleVersion to accepted', element: 'lifeCycle', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewLifeCycle(req, res) {
  var id_rc = req.swagger.params.id.value;
  LifeCycleVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of LifeCycleVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of LifeCycleVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a LifeCycleVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a LifeCycleVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedLifeCycle(req, res) {
  var id_rc = req.swagger.params.id.value;
  LifeCycleVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last LifeCycleVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last LifeCycleVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a LifeCycleVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postLifeCycle,
  getLifeCycle,
  setAcceptedLifeCycle,
  getToReviewLifeCycle,
  getLastAcceptedLifeCycle
};