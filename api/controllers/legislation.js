import mongoose from 'mongoose';
import async from 'async';
import LegislationVersion from '../models/legislation.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postLegislation(req, res) {
  var legislation_version  = req.body; 
    legislation_version._id = mongoose.Types.ObjectId();
    legislation_version.created=Date();
    //legislation_version.state="to_review";
    legislation_version.state="accepted";
    legislation_version.element="legislation";
    var user = legislation_version.id_user;
    var elementValue = legislation_version.legislation;
    legislation_version = new LegislationVersion(legislation_version);
    var id_v = legislation_version._id;
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
                if(data.legislationVersion && data.legislationVersion.length !=0){
                  var lenlegislation = data.legislationVersion.length;
                  var idLast = data.legislationVersion[lenlegislation-1];
                  LegislationVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of legislationVersion:" + err.message));
                    }else{
                      var prev = doc.legislationVersion;
                      var next = legislation_version.legislationVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        legislation_version.id_record=id_rc;
                        legislation_version.version=lenlegislation+1;
                        callback(null, legislation_version);
                      }else{
                        callback(new Error("The data in legislationVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  legislation_version.id_record=id_rc;
                  legislation_version.version=1;
                  callback(null, legislation_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(legislation_version, callback){ 
                ver = legislation_version.version;
                legislation_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, legislation_version);
                  }
                });
            },
            function(legislation_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "legislationVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new LegislationVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new LegislationVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save LegislationVersion', element: 'legislation', version : ver, _id: id_v, id_record : id_rc });
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

function getLegislation(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    LegislationVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated LegislationVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a LegislationVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a LegislationVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedLegislation(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        LegislationVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a LegislationVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        LegislationVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        LegislationVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set LegislationVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated LegislationVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated LegislationVersion to accepted', element: 'legislation', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewLegislation(req, res) {
  var id_rc = req.swagger.params.id.value;
  LegislationVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of LegislationVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of LegislationVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a LegislationVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a LegislationVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedLegislation(req, res) {
  var id_rc = req.swagger.params.id.value;
  LegislationVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last LegislationVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last LegislationVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a LegislationVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postLegislation,
  getLegislation,
  setAcceptedLegislation,
  getToReviewLegislation,
  getLastAcceptedLegislation
};