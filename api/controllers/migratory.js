import mongoose from 'mongoose';
import async from 'async';
import MigratoryVersion from '../models/migratory.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';


function postMigratory(req, res) {
  var migratory_version  = req.body; 
    migratory_version._id = mongoose.Types.ObjectId();
    migratory_version.created=Date();
    //migratory_version.state="to_review";
    migratory_version.state="accepted";
    migratory_version.element="migratory";
    var user = migratory_version.id_user;
    var elementValue = migratory_version.migratory;
    migratory_version = new MigratoryVersion(migratory_version);
    var id_v = migratory_version._id;
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
                if(data.migratoryVersion && data.migratoryVersion.length !=0){
                  var lenMigratory = data.migratoryVersion.length;
                  var idLast = data.migratoryVersion[lenMigratory-1];
                  MigratoryVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of MigratoryVersion:" + err.message));
                    }else{
                      var prev = doc.migratoryVersion;
                      var next = migratory_version.migratoryVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        migratory_version.id_record=id_rc;
                        migratory_version.version=lenMigratory+1;
                        callback(null, migratory_version);
                      }else{
                        callback(new Error("The data in MigratoryVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  migratory_version.id_record=id_rc;
                  migratory_version.version=1;
                  callback(null, migratory_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(migratory_version, callback){ 
                ver = migratory_version.version;
                migratory_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, migratory_version);
                  }
                });
            },
            function(migratory_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "migratoryVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new MigratoryVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new MigratoryVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save MigratoryVersion', element: 'migratory', version : ver, _id: id_v, id_record : id_rc });
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

function getMigratory(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    MigratoryVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated MigratoryVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a MigratoryVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a MigratoryVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedMigratory(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        MigratoryVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a MigratoryVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        MigratoryVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        MigratoryVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set MigratoryVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated MigratoryVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated MigratoryVersion to accepted', element: 'migratory', version : version, id_record : id_rc });
      }      
    });
  }else{
    //res.status(406);
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewMigratory(req, res) {
  var id_rc = req.swagger.params.id.value;
  MigratoryVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of MigratoryVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of MigratoryVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a MigratoryVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a MigratoryVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedMigratory(req, res) {
  var id_rc = req.swagger.params.id.value;
  MigratoryVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last MigratoryVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer.length !== 0){
        logger.info('Get last MigratoryVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a MigratoryVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postMigratory,
  getMigratory,
  setAcceptedMigratory,
  getToReviewMigratory,
  getLastAcceptedMigratory
};