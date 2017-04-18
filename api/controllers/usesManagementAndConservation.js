import mongoose from 'mongoose';
import async from 'async';
import UsesManagementAndConservationVersion from '../models/usesManagementAndConservation.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';


function postUsesManagementAndConservation(req, res) {
  var uses_management_conservation_version  = req.body; 
    uses_management_conservation_version._id = mongoose.Types.ObjectId();
    uses_management_conservation_version.created=Date();
    //uses_management_conservation_version.state="to_review";
    uses_management_conservation_version.state="accepted";
    uses_management_conservation_version.version=0;
    uses_management_conservation_version.id_record= mongoose.Types.ObjectId();
    uses_management_conservation_version.element="usesManagementAndConservation";
    var user = uses_management_conservation_version.id_user;
    var elementValue = uses_management_conservation_version.usesManagementAndConservation;
    uses_management_conservation_version = new UsesManagementAndConservationVersion(uses_management_conservation_version);
    var id_v = uses_management_conservation_version._id;
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
                if(data.usesManagementAndConservationVersion && data.usesManagementAndConservationVersion.length !=0){
                  var lenUsesManagementAndConservation = data.usesManagementAndConservationVersion.length;
                  var idLast = data.usesManagementAndConservationVersion[lenUsesManagementAndConservation-1];
                  UsesManagementAndConservationVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of UsesManagementAndConservationVersion:" + err.message));
                    }else{
                      var prev = doc.usesManagementAndConservationVersion;
                      var next = uses_management_conservation_version.usesManagementAndConservationVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        uses_management_conservation_version.id_record=mongoose.Types.ObjectId(id_rc);
                        uses_management_conservation_version.version=lenUsesManagementAndConservation+1;
                        callback(null, uses_management_conservation_version);
                      }else{
                        callback(new Error("The data in UsesManagementAndConservationVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  uses_management_conservation_version.id_record=id_rc;
                  uses_management_conservation_version.version=1;
                  callback(null, uses_management_conservation_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(uses_management_conservation_version, callback){ 
                ver = uses_management_conservation_version.version;
                uses_management_conservation_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, uses_management_conservation_version);
                  }
                });
            },
            function(uses_management_conservation_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "usesManagementAndConservationVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new UsesManagementAndConservationVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new UsesManagementAndConservationVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save UsesManagementAndConservationVersion', element: 'usesManagementAndConservation', version : ver, _id: id_v, id_record : id_rc });
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

function getUsesManagementAndConservation(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    UsesManagementAndConservationVersion.findOne({ "id_record" : mongoose.Types.ObjectId(id_rc), version: version }).exec(function (err, elementVer) {
            
            if(err){
              logger.error('Error getting the indicated UsesManagementAndConservationVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                if(!(elementVer._doc.usesManagementAndConservation === undefined || elementVer._doc.usesManagementAndConservation === null)){
                  for(var i=0;i<elementVer._doc.usesManagementAndConservation.usesAtomized.length;i++){
                    for(var j=0;j<elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData.length;j++){
                      for(var k=0;k<elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference.length;k++){
                        if(!(elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].authors.constructor === Array)){
                          elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].authors = elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].authors.split(";");
                        }
                        if(!(elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].editors.constructor === Array)){
                          elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].editors = elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].editors.split(";");
                        }
                        if(!(elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].keywords.constructor === Array)){
                          elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].keywords = elementVer._doc.usesManagementAndConservation.usesAtomized[i].ancillaryData[j].reference[k].keywords.split(";");
                        }
                      }
                    }
                  }
                  if(!(elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData === undefined || elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData === null)){
                    for(var i=0;i<elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData.length;i++){
                      for(var j=0;j<elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference.length;j++){
                        if(!(elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].authors.constructor === Array)){
                          elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].authors = elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].authors.split(";");
                        }
                        if(!(elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].editors.constructor === Array)){
                          elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].editors = elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].editors.split(";");
                        }
                        if(!(elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].keywords.constructor === Array)){
                          elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].keywords = elementVer._doc.usesManagementAndConservation.managementAndConservation.ancillaryData[i].reference[j].keywords.split(";");
                        }
                      }
                    }
                  }
                }
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a UsesManagementAndConservationVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a UsesManagementAndConservationVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedUsesManagementAndConservation(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        UsesManagementAndConservationVersion.findOne({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a UsesManagementAndConservationVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        UsesManagementAndConservationVersion.update({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        UsesManagementAndConservationVersion.update({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set UsesManagementAndConservationVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated UsesManagementAndConservationVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated UsesManagementAndConservationVersion to accepted', element: 'UsesManagementAndConservation', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewUsesManagementAndConservation(req, res) {
  var id_rc = req.swagger.params.id.value;
  UsesManagementAndConservationVersion.find({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of UsesManagementAndConservationVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        logger.info('Get list of UsesManagementAndConservationVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a UsesManagementAndConservationVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a UsesManagementAndConservationVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedUsesManagementAndConservation(req, res) {
  var id_rc = req.swagger.params.id.value;
  UsesManagementAndConservationVersion.find({ "id_record" : mongoose.Types.ObjectId(id_rc), state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last UsesManagementAndConservation at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer.length !== 0){
        logger.info('Get last UsesManagementAndConservation with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a UsesManagementAndConservationVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postUsesManagementAndConservation,
  getUsesManagementAndConservation,
  setAcceptedUsesManagementAndConservation,
  getToReviewUsesManagementAndConservation,
  getLastAcceptedUsesManagementAndConservation
};