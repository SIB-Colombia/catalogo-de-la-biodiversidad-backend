import mongoose from 'mongoose';
import async from 'async';
import MolecularDataVersion from '../models/molecularData.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';


function postMolecularData(req, res) {
  var molecular_data_version  = req.body; 
    molecular_data_version._id = mongoose.Types.ObjectId();
    molecular_data_version.created=Date();
    molecular_data_version.state="to_review";
    //molecular_data_version.state="accepted";
    var user = molecular_data_version.id_user;
    molecular_data_version.element="molecularData";
    var elementValue = molecular_data_version.molecularData;
    molecular_data_version = new MolecularDataVersion(molecular_data_version);
    var id_v = molecular_data_version._id;
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
                if(data.molecularDataVersion && data.molecularDataVersion.length !=0){
                  var lenMolecularData = data.molecularDataVersion.length;
                  var idLast = data.molecularDataVersion[lenMolecularData-1];
                  MolecularDataVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of MolecularDataVersion:" + err.message));
                    }else{
                      var prev = doc.molecularDataVersion;
                      var next = molecular_data_version.molecularDataVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        molecular_data_version.id_record=id_rc;
                        molecular_data_version.version=lenMolecularData+1;
                        callback(null, molecular_data_version);
                      }else{
                        callback(new Error("The data in MolecularDataVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  molecular_data_version.id_record=id_rc;
                  molecular_data_version.version=1;
                  callback(null, molecular_data_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(molecular_data_version, callback){ 
                ver = molecular_data_version.version;
                molecular_data_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, molecular_data_version);
                  }
                });
            },
            function(molecular_data_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "molecularDataVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new MolecularDataVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new MolecularDataVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save MolecularDataVersion', element: 'molecularData', version : ver, _id: id_v, id_record : id_rc });
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

function getMolecularData(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    MolecularDataVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated MolecularDataVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a MolecularDataVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a MolecularDataVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedMolecularData(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        MolecularDataVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a MolecularDataVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        MolecularDataVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        MolecularDataVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        console.log("Error: "+err);
        logger.error('Error to set MolecularDataVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated MolecularDataVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated MolecularDataVersion to accepted', element: 'molecularData', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewMolecularData(req, res) {
  var id_rc = req.swagger.params.id.value;
  MolecularDataVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of MolecularDataVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        logger.info('Get list of MolecularDataVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a MolecularDataVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a MolecularDataVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedMolecularData(req, res) {
  var id_rc = req.swagger.params.id.value;
  MolecularDataVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last MolecularDataVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer.length !== 0){
        logger.info('Get last MolecularDataVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a MolecularDataVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postMolecularData,
  getMolecularData,
  setAcceptedMolecularData,
  getToReviewMolecularData,
  getLastAcceptedMolecularData
};