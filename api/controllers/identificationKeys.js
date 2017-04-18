import mongoose from 'mongoose';
import async from 'async';
import IdentificationKeysVersion from '../models/identificationKeys.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postIdentificationKeys(req, res) {
  var identification_keys_version  = req.body; 
    identification_keys_version._id = mongoose.Types.ObjectId();
    identification_keys_version.created=Date();
    identification_keys_version.state="to_review";
    //identification_keys_version.state="accepted";
    identification_keys_version.element="identificationKeys";
    var user = identification_keys_version.id_user;
    var elementValue = identification_keys_version.identificationKeys;
    identification_keys_version = new IdentificationKeysVersion(identification_keys_version);
    var id_v = identification_keys_version._id;
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
                if(data.identificationKeysVersion && data.identificationKeysVersion.length !=0){
                  var lenidentificationKeys = data.identificationKeysVersion.length;
                  var idLast = data.identificationKeysVersion[lenidentificationKeys-1];
                  IdentificationKeysVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of identificationKeysVersion:" + err.message));
                    }else{
                      var prev = doc.identificationKeysVersion;
                      var next = identification_keys_version.identificationKeysVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        identification_keys_version.id_record=id_rc;
                        identification_keys_version.version=lenidentificationKeys+1;
                        callback(null, identification_keys_version);
                      }else{
                        callback(new Error("The data in identificationKeysVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  identification_keys_version.id_record=id_rc;
                  identification_keys_version.version=1;
                  callback(null, identification_keys_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(identification_keys_version, callback){ 
                ver = identification_keys_version.version;
                identification_keys_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, identification_keys_version);
                  }
                });
            },
            function(identification_keys_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "identificationKeysVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new IdentificationKeysVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new IdentificationKeysVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save IdentificationKeysVersion', element: 'identificationKeys', version : ver, _id: id_v, id_record : id_rc });
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

function getIdentificationKeys(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    IdentificationKeysVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated IdentificationKeysVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a IdentificationKeysVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a IdentificationKeysVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedIdentificationKeys(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        IdentificationKeysVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a IdentificationKeysVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        IdentificationKeysVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        IdentificationKeysVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set IdentificationKeysVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated IdentificationKeysVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated IdentificationKeysVersion to accepted', element: 'identificationKeys', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewIdentificationKeys(req, res) {
  var id_rc = req.swagger.params.id.value;
  IdentificationKeysVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of IdentificationKeysVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of IdentificationKeysVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a IdentificationKeysVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a IdentificationKeysVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedIdentificationKeys(req, res) {
  var id_rc = req.swagger.params.id.value;
  IdentificationKeysVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last IdentificationKeysVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last IdentificationKeysVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a IdentificationKeysVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postIdentificationKeys,
  getIdentificationKeys,
  setAcceptedIdentificationKeys,
  getToReviewIdentificationKeys,
  getLastAcceptedIdentificationKeys
};