import mongoose from 'mongoose';
import async from 'async';
import MoreInformationVersion from '../models/moreInformation.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';


function postMoreInformation(req, res) {
  var more_information_version  = req.body; 
    more_information_version._id = mongoose.Types.ObjectId();
    more_information_version.created=Date();
    more_information_version.state="to_review";
    //more_information_version.state="accepted";
    var user = more_information_version.id_user;
    more_information_version.element="moreInformation";
    var elementValue = more_information_version.moreInformation;
    more_information_version = new MoreInformationVersion(more_information_version);
    var id_v = more_information_version._id;
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
                if(data.moreInformationVersion && data.moreInformationVersion.length !=0){
                  var lenMoreInformation = data.moreInformationVersion.length;
                  var idLast = data.moreInformationVersion[lenMoreInformation-1];
                  MoreInformationVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of MoreInformationVersion:" + err.message));
                    }else{
                      var prev = doc.moreInformationVersion;
                      var next = more_information_version.moreInformationVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        more_information_version.id_record=id_rc;
                        more_information_version.version=lenMoreInformation+1;
                        callback(null, more_information_version);
                      }else{
                        callback(new Error("The data in MoreInformationVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  more_information_version.id_record=id_rc;
                  more_information_version.version=1;
                  callback(null, more_information_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(more_information_version, callback){ 
                ver = more_information_version.version;
                more_information_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, more_information_version);
                  }
                });
            },
            function(more_information_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "moreInformationVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new MoreInformationVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new MoreInformationVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save MoreInformationVersion', element: 'moreInformation', version : ver, _id: id_v, id_record : id_rc });
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

function getMoreInformation(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    MoreInformationVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated MoreInformationVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a MoreInformationVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a MoreInformationVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedMoreInformation(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;
  var elementUpdated = '';

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        MoreInformationVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a MoreInformationVersion with the properties sent."));
          }else{
            elementVer.state="accepted";
            elementUpdated = elementVer;
            callback();
          }
        });
      },
      function(callback){ 
        MoreInformationVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            //remove user from the accepted version of the Record
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        MoreInformationVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else{
            //added user and institution to the accepted version of the record
            callback();
          }
        });
      },
      function(callback){
        console.log("updated last version of the element");
        console.log("!elementUpdated: "+elementUpdated);
        add_objects.Record.update({ '_id': id_rc }, { $set: { 'moreInformationAccepted': elementUpdated }}, function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            //callback();
          }
        });
      }
    ],
    function(err, result) {
      if (err) {
        console.log("Error: "+err);
        logger.error('Error to set MoreInformationVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated MoreInformationVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated MoreInformationVersion to accepted', element: 'moreInformation', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewMoreInformation(req, res) {
  var id_rc = req.swagger.params.id.value;
  MoreInformationVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of MoreInformationVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        logger.info('Get list of MoreInformationVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a MoreInformationVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a MoreInformationVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedMoreInformation(req, res) {
  var id_rc = req.swagger.params.id.value;
  MoreInformationVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last MoreInformationVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer.length !== 0){
        logger.info('Get last MoreInformationVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a MoreInformationVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postMoreInformation,
  getMoreInformation,
  setAcceptedMoreInformation,
  getToReviewMoreInformation,
  getLastAcceptedMoreInformation
};