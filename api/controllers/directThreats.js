import mongoose from 'mongoose';
import async from 'async';
import DirectThreatsVersion from '../models/directThreats.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postDirectThreats(req, res) {
  var direct_threats_version  = req.body; 
    direct_threats_version._id = mongoose.Types.ObjectId();
    direct_threats_version.created=Date();
    //direct_threats_version.state="to_review";
    direct_threats_version.state="accepted";
    direct_threats_version.element="directThreats";
    var user = direct_threats_version.id_user;
    var elementValue = direct_threats_version.directThreats;
    direct_threats_version = new DirectThreatsVersion(direct_threats_version);
    var id_v = direct_threats_version._id;
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
                if(data.directThreatsVersion && data.directThreatsVersion.length !=0){
                  var lendirectThreats = data.directThreatsVersion.length;
                  var idLast = data.directThreatsVersion[lendirectThreats-1];
                  DirectThreatsVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of directThreatsVersion:" + err.message));
                    }else{
                      var prev = doc.directThreatsVersion;
                      var next = direct_threats_version.directThreatsVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        direct_threats_version.id_record=id_rc;
                        direct_threats_version.version=lendirectThreats+1;
                        callback(null, direct_threats_version);
                      }else{
                        callback(new Error("The data in directThreatsVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  direct_threats_version.id_record=id_rc;
                  direct_threats_version.version=1;
                  callback(null, direct_threats_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(direct_threats_version, callback){ 
                ver = direct_threats_version.version;
                direct_threats_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, direct_threats_version);
                  }
                });
            },
            function(direct_threats_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "directThreatsVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new DirectThreatsVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new DirectThreatsVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save DirectThreatsVersion', element: 'directThreats', version : ver, _id: id_v, id_record : id_rc });
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

function getDirectThreats(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    DirectThreatsVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated DirectThreatsVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a DirectThreatsVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a DirectThreatsVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedDirectThreats(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        DirectThreatsVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a DirectThreatsVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        DirectThreatsVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        DirectThreatsVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set DirectThreatsVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated DirectThreatsVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated DirectThreatsVersion to accepted', element: 'directThreats', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewDirectThreats(req, res) {
  var id_rc = req.swagger.params.id.value;
  DirectThreatsVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of DirectThreatsVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of DirectThreatsVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a DirectThreatsVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a DirectThreatsVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedDirectThreats(req, res) {
  var id_rc = req.swagger.params.id.value;
  DirectThreatsVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last DirectThreatsVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last DirectThreatsVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a DirectThreatsVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postDirectThreats,
  getDirectThreats,
  setAcceptedDirectThreats,
  getToReviewDirectThreats,
  getLastAcceptedDirectThreats
};