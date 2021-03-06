import mongoose from 'mongoose';
import async from 'async';
import AbstractVersion from '../models/abstract.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postAbstract(req, res) {
  var abstract_version  = req.body; 
    abstract_version._id = mongoose.Types.ObjectId();
    abstract_version.created=Date();
    abstract_version.state="to_review";
    //abstract_version.state="approved_in_use";
    abstract_version.element="abstract";
    var user = abstract_version.id_user;
    var elementValue = abstract_version.abstract;
    abstract_version = new AbstractVersion(abstract_version);
    var id_v = abstract_version._id;
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
                if(data.abstractVersion && data.abstractVersion.length !=0){
                  var lenabstract = data.abstractVersion.length;
                  var idLast = data.abstractVersion[lenabstract-1];
                  AbstractVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of abstractVersion:" + err.message));
                    }else{
                      var prev = doc.abstractVersion;
                      var next = abstract_version.abstractVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        abstract_version.id_record=id_rc;
                        abstract_version.version=lenabstract+1;
                        callback(null, abstract_version);
                      }else{
                        callback(new Error("The data in abstractVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  abstract_version.id_record=id_rc;
                  abstract_version.version=1;
                  callback(null, abstract_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(abstract_version, callback){ 
                ver = abstract_version.version;
                abstract_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, abstract_version);
                  }
                });
            },
            function(abstract_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "abstractVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new AbstractVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new AbstractVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save AbstractVersion', element: 'abstract', version : ver, _id: id_v, id_record : id_rc });
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

function getAbstract(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    AbstractVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated AbstractVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a AbstractVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a AbstractVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setApprovedInUseAbstract(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        AbstractVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a AbstractVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        AbstractVersion.update({ id_record : id_rc, state: "approved_in_use" },{ state: "approved" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        AbstractVersion.findOneAndUpdate({ id_record : id_rc, state: "to_review", version : version }, { state: "approved_in_use" }, function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else{
            callback(null, elementVer);
          }
        });
      },
      function(elementVer,callback){ 
        elementVer.state="approved_in_use";
        var update_date = Date();
        add_objects.Record.update({_id:id_rc},{ abstractApprovedInUse: elementVer, update_date: update_date }, function(err, result){
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
        logger.error('Error to set AbstractVersion approved_in_use', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated AbstractVersion to approved_in_use', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated AbstractVersion to approved_in_use', element: 'abstract', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewAbstract(req, res) {
  var id_rc = req.swagger.params.id.value;
  AbstractVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of AbstractVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of AbstractVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a AbstractVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a AbstractVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastApprovedInUseAbstract(req, res) {
  var id_rc = req.swagger.params.id.value;
  AbstractVersion.find({ id_record : id_rc, state: "approved_in_use" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last AbstractVersion at state approved_in_use', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last AbstractVersion with state approved_in_use', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a AbstractVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postAbstract,
  getAbstract,
  setApprovedInUseAbstract,
  getToReviewAbstract,
  getLastApprovedInUseAbstract
};