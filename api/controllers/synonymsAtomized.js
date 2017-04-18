import mongoose from 'mongoose';
import async from 'async';
import SynonymsAtomizedVersion from '../models/synonymsAtomized.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postSynonymsAtomized(req, res) {
  var synonyms_atomized_version  = req.body; 
    synonyms_atomized_version._id = mongoose.Types.ObjectId();
    synonyms_atomized_version.created=Date();
    synonyms_atomized_version.state="to_review";
    //synonyms_atomized_version.state="accepted";
    synonyms_atomized_version.element="synonymsAtomized";
    var user = synonyms_atomized_version.id_user;
    var elementValue = synonyms_atomized_version.synonymsAtomized;
    synonyms_atomized_version = new SynonymsAtomizedVersion(synonyms_atomized_version);
    var id_v = synonyms_atomized_version._id;
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
                if(data.synonymsAtomizedVersion && data.synonymsAtomizedVersion.length !=0){
                  var lensynonymsAtomized = data.synonymsAtomizedVersion.length;
                  var idLast = data.synonymsAtomizedVersion[lensynonymsAtomized-1];
                  SynonymsAtomizedVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of synonymsAtomizedVersion:" + err.message));
                    }else{
                      var prev = doc.synonymsAtomizedVersion;
                      var next = synonyms_atomized_version.synonymsAtomizedVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        synonyms_atomized_version.id_record=id_rc;
                        synonyms_atomized_version.version=lensynonymsAtomized+1;
                        callback(null, synonyms_atomized_version);
                      }else{
                        callback(new Error("The data in synonymsAtomizedVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  synonyms_atomized_version.id_record=id_rc;
                  synonyms_atomized_version.version=1;
                  callback(null, synonyms_atomized_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(synonyms_atomized_version, callback){ 
                ver = synonyms_atomized_version.version;
                synonyms_atomized_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, synonyms_atomized_version);
                  }
                });
            },
            function(synonyms_atomized_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "synonymsAtomizedVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new SynonymsAtomizedVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new SynonymsAtomizedVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save SynonymsAtomizedVersion', element: 'synonymsAtomized', version : ver, _id: id_v, id_record : id_rc });
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

function getSynonymsAtomized(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    SynonymsAtomizedVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated SynonymsAtomizedVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a SynonymsAtomizedVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a SynonymsAtomizedVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedSynonymsAtomized(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        SynonymsAtomizedVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a SynonymsAtomizedVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        SynonymsAtomizedVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        SynonymsAtomizedVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set SynonymsAtomizedVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated SynonymsAtomizedVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated SynonymsAtomizedVersion to accepted', element: 'synonymsAtomized', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewSynonymsAtomized(req, res) {
  var id_rc = req.swagger.params.id.value;
  SynonymsAtomizedVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of SynonymsAtomizedVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of SynonymsAtomizedVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a SynonymsAtomizedVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a SynonymsAtomizedVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedSynonymsAtomized(req, res) {
  var id_rc = req.swagger.params.id.value;
  SynonymsAtomizedVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last SynonymsAtomizedVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last SynonymsAtomizedVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a SynonymsAtomizedVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postSynonymsAtomized,
  getSynonymsAtomized,
  setAcceptedSynonymsAtomized,
  getToReviewSynonymsAtomized,
  getLastAcceptedSynonymsAtomized
};