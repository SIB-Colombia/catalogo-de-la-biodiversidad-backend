import mongoose from 'mongoose';
import async from 'async';
import winston from 'winston';
import add_objects from '../models/additionalModels.js';
import { logger }  from '../../server/log';

function returnName(name){
  var message = "hello"+name;
  return message;
}

function getLastAcceptedElement(ElementModel, ElementVersion, id_rc) {
  var answ = {};
  console.log("here");
  ElementModel.find({ id_record : id_rc, state: "accepted" }).exec(function (err, elementVer) {
    console.log("Here!!!!");
    if(err){
      console.log("Error");
      var text_log = 'Error getting the last '+ ElementVersion +' at state accepted';
      logger.error(text_log, JSON.stringify({ message:err }) );
      result.status = 400;
      result.err = err;
      /*
      res.status(400);
      res.send(err);
      */
      return result;
    }else{
      console.log("No error!!!!");
      if(elementVer.length !== 0){
        var text_log = 'Get last '+ ElementVersion +' with state accepted';
        logger.info(text_log, JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        answ.status = 200;
        answ.rest = elementVer[len-1];
        console.log("len no zero!!!!");
        return answ;
      }else{

      }
      /*
      if(elementVer.length !== 0){
        logger.info('Get last '+ ElementVersion +' with state accepted', JSON.stringify({ id_record: id_rc }) );
        var len = elementVer.length;
        result.status = 200;
        result.rest = elementVer[len-1];
        //res.json(elementVer[len-1]);
        return result;
      }else{
        result.status = 400;
        result.err = {message: "Doesn't exist a " + ElementVersion + " with id_record: "+id_rc};
        
        //res.status(400);
        //res.json({message: "Doesn't exist a TaxonRecordNameVersion with id_record: "+id_rc});
        //return result;
      }
      */
    }
  });
}

module.exports = {
  returnName,
  getLastAcceptedElement
}