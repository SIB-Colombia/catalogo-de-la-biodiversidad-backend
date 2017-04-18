import mongoose from 'mongoose';
import async from 'async';
import LifeFormVersion from '../models/lifeForm.js';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function postLifeForm(req, res) {
  var life_form_version  = req.body; 
    life_form_version._id = mongoose.Types.ObjectId();
    life_form_version.created=Date();
    life_form_version.state="to_review";
    //life_form_version.state="accepted";
    life_form_version.element="lifeForm";
    var user = life_form_version.id_user;
    var elementValue = life_form_version.lifeForm;
    life_form_version = new LifeFormVersion(life_form_version);
    var id_v = life_form_version._id;
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
                if(data.lifeFormVersion && data.lifeFormVersion.length !=0){
                  var lenlifeForm = data.lifeFormVersion.length;
                  var idLast = data.lifeFormVersion[lenlifeForm-1];
                  LifeFormVersion.findById(idLast , function (err, doc){
                    if(err){
                      callback(new Error("failed getting the last version of lifeFormVersion:" + err.message));
                    }else{
                      var prev = doc.lifeFormVersion;
                      var next = life_form_version.lifeFormVersion;
                      //if(!compare.isEqual(prev,next)){ //TODO
                      if(true){
                        life_form_version.id_record=id_rc;
                        life_form_version.version=lenlifeForm+1;
                        callback(null, life_form_version);
                      }else{
                        callback(new Error("The data in lifeFormVersion is equal to last version of this element in the database"));
                      }
                    }
                  });
                }else{
                  life_form_version.id_record=id_rc;
                  life_form_version.version=1;
                  callback(null, life_form_version);
                }
              }else{
                callback(new Error("The Record (Ficha) with id: "+id_rc+" doesn't exist."));
              }
            },
            function(life_form_version, callback){ 
                ver = life_form_version.version;
                life_form_version.save(function(err){
                  if(err){
                      callback(new Error("failed saving the element version:" + err.message));
                  }else{
                      callback(null, life_form_version);
                  }
                });
            },
            function(life_form_version, callback){ 
                add_objects.RecordVersion.findByIdAndUpdate( id_rc, { $push: { "lifeFormVersion": id_v } },{ safe: true, upsert: true }).exec(function (err, record) {
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
                  logger.error('Error Creation of a new LifeFormVersion', JSON.stringify({ message:err }) );
                  res.status(400);
                  res.json({ ErrorResponse: {message: ""+err }});
                }else{
                  logger.info('Creation a new LifeFormVersion sucess', JSON.stringify({id_record: id_rc, version: ver, _id: id_v, id_user: user}));
                  res.json({ message: 'Save LifeFormVersion', element: 'lifeForm', version : ver, _id: id_v, id_record : id_rc });
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

function getLifeForm(req, res) {
    var id_rc = req.swagger.params.id.value;
    var version = req.swagger.params.version.value;

    LifeFormVersion.findOne({ id_record : id_rc, version: version }).exec(function (err, elementVer) {
            if(err){
              logger.error('Error getting the indicated LifeFormVersion', JSON.stringify({ message:err, id_record : id_rc, version: version }) );
              res.status(400);
              res.send(err);
            }else{
              if(elementVer){
                res.json(elementVer);
              }else{
                logger.warn("Doesn't exist a LifeFormVersion with id_record", JSON.stringify({ id_record : id_rc, version: version }) );
                res.status(400);
                res.json({message: "Doesn't exist a LifeFormVersion with id_record: "+id_rc+" and version: "+version});
              }
            }
    });

}


function setAcceptedLifeForm(req, res) {
  var id_rc = req.swagger.params.id.value;
  var version = req.swagger.params.version.value;
  var id_rc = req.swagger.params.id.value;

  if(typeof  id_rc!=="undefined" && id_rc!=""){
    async.waterfall([
      function(callback){ 
        LifeFormVersion.findOne({ id_record : id_rc, state: "to_review", version : version }).exec(function (err, elementVer) {
          if(err){
            callback(new Error(err.message));
          }else if(elementVer == null){
            callback(new Error("Doesn't exist a LifeFormVersion with the properties sent."));
          }else{
            callback();
          }
        });
      },
      function(callback){ 
        LifeFormVersion.update({ id_record : id_rc, state: "accepted" },{ state: "deprecated" }, { multi: true },function (err, raw){
          if(err){
            callback(new Error(err.message));
          }else{
            console.log("response: "+raw);
            callback();
          }
        });
        
      },
      function(callback){ 
        LifeFormVersion.update({ id_record : id_rc, state: "to_review", version : version }, { state: "accepted" }, function (err, elementVer) {
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
        logger.error('Error to set LifeFormVersion accepted', JSON.stringify({ message:err }) );
        res.status(400);
        res.json({ ErrorResponse: {message: ""+err }});
      }else{
        logger.info('Updated LifeFormVersion to accepted', JSON.stringify({ version:version, id_record: id_rc }) );
        res.json({ message: 'Updated LifeFormVersion to accepted', element: 'lifeForm', version : version, id_record : id_rc });
      }      
    });
  }else{
      logger.warn("The url doesn't have the id for the Record (Ficha)");
      res.status(400);
      res.json({message: "The url doesn't have the id for the Record (Ficha)"});
  }
}

function getToReviewLifeForm(req, res) {
  var id_rc = req.swagger.params.id.value;
  LifeFormVersion.find({ id_record : id_rc, state: "to_review" }).exec(function (err, elementList) {
    if(err){
      logger.error('Error getting the list of LifeFormVersion at state to_review', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementList){
        //var len = elementVer.length;
        logger.info('Get list of LifeFormVersion with state to_review', JSON.stringify({ id_record: id_rc }) );
        res.json(elementList);
      }else{
        logger.warn("Doesn't exist a LifeFormVersion with the indicated id_record");
        res.status(406);
        res.json({message: "Doesn't exist a LifeFormVersion with id_record: "+id_rc});
      }
    }
  });
}

function getLastAcceptedLifeForm(req, res) {
  var id_rc = req.swagger.params.id.value;
  LifeFormVersion.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    if(err){
      logger.error('Error getting the last LifeFormVersion at state accepted', JSON.stringify({ message:err }) );
      res.status(400);
      res.send(err);
    }else{
      if(elementVer){
        logger.info('Get last LifeFormVersion with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        res.json(elementVer[len-1]);
      }else{
        res.status(400);
        res.json({message: "Doesn't exist a LifeFormVersion with id_record: "+id_rc});
      }
    }
  });
}

module.exports = {
  postLifeForm,
  getLifeForm,
  setAcceptedLifeForm,
  getToReviewLifeForm,
  getLastAcceptedLifeForm
};