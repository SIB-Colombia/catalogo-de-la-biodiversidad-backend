import mongoose from 'mongoose';
import async from 'async';
import TerritoryVersion from '../models/territory.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postTerritory(req, res) {
  var territory_version  = req.body; 
    territory_version._id = mongoose.Types.ObjectId();
    territory_version.created=Date();
    //territory_version.state="to_review";
    territory_version.state="accepted";
    territory_version.element="territory";
    var user = territory_version.id_user;
    var elementValue = territory_version.territory;
    territory_version = new TerritoryVersion(territory_version);
    var id_v = territory_version._id;
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
                if(data.territoryVersion && data.territoryVersion.length !=0){
                  var lenterritory = data.territoryVersion.length;
                  var idLast = data.territoryVersion[lenterritory-1];
                  TerritoryVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of territoryVersion:" + err.message));
                    }else{
                      var prev = doc.territoryVersion;
                      var next = territory_version.territoryVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        territory_version.id_record=id_rc;
                        territory_version.version=lenterritory+1;
                        callback(null, territory_version);
                      }else{
                        callback(new Error("The data in territoryVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  territory_version.id_record=id_rc;
                  territory_version.version=1;
                  callback(null, territory_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(territory_version, callback){ 
                ver = territory_version.version;
                territory_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, territory_version);
                  }
                });
            },
            function(territory_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "territoryVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new TerritoryVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new TerritoryVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save TerritoryVersion', element: 'territory', version : ver, _id: id_v, id_record : id_rc });
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

function getTerritory(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    TerritoryVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated TerritoryVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a TerritoryVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a TerritoryVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedTerritory(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        TerritoryVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a TerritoryVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        TerritoryVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        TerritoryVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set TerritoryVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated TerritoryVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated TerritoryVersion to accepted', element: 'territory', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewTerritory(req, res) {
  var id_rc = req.swagger.params.id.value;
  TerritoryVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of TerritoryVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of TerritoryVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a TerritoryVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a TerritoryVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedTerritory(req, res) {
  var id_rc = req.swagger.params.id.value;
  TerritoryVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last TerritoryVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last TerritoryVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a TerritoryVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postTerritory,
  getTerritory,
  setAcceptedTerritory,
  getToReviewTerritory,
  getLastAcceptedTerritory
};