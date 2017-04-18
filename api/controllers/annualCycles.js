import mongoose from 'mongoose';
import async from 'async';
import AnnualCyclesVersion from '../models/annualCycles.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';


function postAnnualCycles(req, res) {
  var annual_cycles_version  = req.body; 
    annual_cycles_version._id = mongoose.Types.ObjectId();
    annual_cycles_version.created=Date();
    annual_cycles_version.state="to_review";
    //annual_cycles_version.state="accepted";
    annual_cycles_version.element="annualCycles";
    var user = annual_cycles_version.id_user;
    var elementValue = annual_cycles_version.annualCycles;
    annual_cycles_version = new AnnualCyclesVersion(annual_cycles_version);
    var id_v = annual_cycles_version._id;
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
                if(data.annualCyclesVersion && data.annualCyclesVersion.length !=0){
                  var lenannualCycles = data.annualCyclesVersion.length;
                  var idLast = data.annualCyclesVersion[lenannualCycles-1];
                  AnnualCyclesVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of AnnualCyclesVersion:" + err.message));
                    }else{
                      var prev = doc.annualCyclesVersion;
                      var next = annual_cycles_version.annualCyclesVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        annual_cycles_version.id_record=id_rc;
                        annual_cycles_version.version=lenannualCycles+1;
                        callback(null, annual_cycles_version);
                      }else{
                        callback(new Error("The data in AnnualCyclesVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  annual_cycles_version.id_record=id_rc;
                  annual_cycles_version.version=1;
                  callback(null, annual_cycles_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(annual_cycles_version, callback){ 
                ver = annual_cycles_version.version;
                annual_cycles_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, annual_cycles_version);
                  }
                });
            },
            function(annual_cycles_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "annualCyclesVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new AnnualCyclesVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new AnnualCyclesVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save AnnualCyclesVersion', element: 'annualCycles', version : ver, _id: id_v, id_record : id_rc });
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

function getAnnualCycles(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    AnnualCyclesVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated AnnualCyclesVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a AnnualCyclesVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a AnnualCyclesVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedAnnualCycles(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        AnnualCyclesVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a AnnualCyclesVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        AnnualCyclesVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        AnnualCyclesVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set AnnualCyclesVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated AnnualCyclesVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated AnnualCyclesVersion to accepted', element: 'annualCycles', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewAnnualCycles(req, res) {
  var id_rc = req.swagger.params.id.value;
  AnnualCyclesVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of AnnualCyclesVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of AnnualCyclesVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a AnnualCyclesVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a AnnualCyclesVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedAnnualCycles(req, res) {
  var id_rc = req.swagger.params.id.value;
  AnnualCyclesVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last AnnualCyclesVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer.length !== 0){
        logger.info('Get last AnnualCyclesVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a AnnualCyclesVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postAnnualCycles,
  getAnnualCycles,
  setAcceptedAnnualCycles,
  getToReviewAnnualCycles,
  getLastAcceptedAnnualCycles
};