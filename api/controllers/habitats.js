import mongoose from 'mongoose';
import async from 'async';
import HabitatsVersion from '../models/habitats.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postHabitats(req, res) {
  var habitats_version  = req.body; 
    habitats_version._id = mongoose.Types.ObjectId();
    habitats_version.created=Date();
    //habitats_version.state="to_review";
    habitats_version.state="accepted";
    habitats_version.element="habitats";
    var user = habitats_version.id_user;
    var elementValue = habitats_version.habitats;
    habitats_version = new HabitatsVersion(habitats_version);
    var id_v = habitats_version._id;
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
                if(data.habitatsVersion && data.habitatsVersion.length !=0){
                  var lenhabitats = data.habitatsVersion.length;
                  var idLast = data.habitatsVersion[lenhabitats-1];
                  HabitatsVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of habitatsVersion:" + err.message));
                    }else{
                      var prev = doc.habitatsVersion;
                      var next = habitats_version.habitatsVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        habitats_version.id_record=id_rc;
                        habitats_version.version=lenhabitats+1;
                        callback(null, habitats_version);
                      }else{
                        callback(new Error("The data in habitatsVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  habitats_version.id_record=id_rc;
                  habitats_version.version=1;
                  callback(null, habitats_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(habitats_version, callback){ 
                ver = habitats_version.version;
                habitats_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, habitats_version);
                  }
                });
            },
            function(habitats_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "habitatsVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new HabitatsVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new HabitatsVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save HabitatsVersion', element: 'habitats', version : ver, _id: id_v, id_record : id_rc });
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

function getHabitats(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    HabitatsVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated HabitatsVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a HabitatsVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a HabitatsVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedHabitats(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        HabitatsVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a HabitatsVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        HabitatsVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        HabitatsVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set HabitatsVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated HabitatsVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated HabitatsVersion to accepted', element: 'habitats', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewHabitats(req, res) {
  var id_rc = req.swagger.params.id.value;
  HabitatsVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of HabitatsVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of HabitatsVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a HabitatsVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a HabitatsVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedHabitats(req, res) {
  var id_rc = req.swagger.params.id.value;
  HabitatsVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last HabitatsVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last HabitatsVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a HabitatsVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postHabitats,
  getHabitats,
  setAcceptedHabitats,
  getToReviewHabitats,
  getLastAcceptedHabitats
};