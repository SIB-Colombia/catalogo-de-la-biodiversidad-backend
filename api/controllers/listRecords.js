import mongoose from 'mongoose';
import async from 'async';
import ListRecords from '../models/listRecords.js';
import Group from '../models/group.js';
import add_objects from '../models/additionalModels.js';

function postListRecords(req, res) {
	var listRecords  = req.body;
	var object_id = mongoose.Types.ObjectId();
	listRecords._id = mongoose.Types.ObjectId();
	listRecords.created=Date();
	//console.log(collection);
	//console.log("*** "+collection.records.length);
	
	var isValidArr = true; 
	var reg_id = new RegExp("^[0-9a-fA-F]{24}$");
	for(var i =0; i < listRecords.records.length; i++){
		console.log(reg_id.test(listRecords.records[i]));
		if (!reg_id.test(listRecords.records[i])){
			isValidArr = false;
			break;
		}else{
			listRecords.records[i] = mongoose.Types.ObjectId(listRecords.records[i]); 
		}
	}

	listRecords = new ListRecords(listRecords);

	console.log(listRecords);

	console.log(listRecords.records.length);

	if(isValidArr){
		if(listRecords.records.length > 0){
			console.log(listRecords.records.length);
			async.waterfall([
				function(callback){
					async.eachSeries(listRecords.records, function(id_record, callback){
						console.log(id_record);
						add_objects.RecordVersion.count({ _id : id_record }, function (err, count){
            				if(err){
              					callback(new Error("The Record (Ficha) with id: "+id_record+" doesn't exist.:" + err.message));
           			 		}else if(count === 0){
           			 			callback(new Error("The Record (Ficha) with id: "+id_record+" doesn't exist"));
           			 		}else{
           			 			callback();
           			 		}
          				});
					},function(err){
						if(err){
							//console.error("Error finding a Record: "+err.message);
							callback(new Error("Error finding a Record: "+err.message));
						}else{
							console.log("All Records are in the Data Base");
							callback();
						}
					});
				},
				function(callback){
					console.log(listRecords.group);
					Group.count({ group : listRecords.group }, function (err, count){
                  		if(err){
              				callback(new Error("The Group (Ficha) with id: " + listRecords.group +" doesn't exist.:" + err.message));
           			 	}else if(count === 0){
           			 		callback(new Error("The Record (Ficha) with id: " + listRecords.group + " doesn't exist"));
           			 	}else{
           			 		callback();
           			 	}
                	});
				},
				function(callback){
					listRecords.save(function(err){
                  		if(err){
                      		callback(new Error("failed saving the list of records:" + err.message));
                  		}else{
                      		callback(null);
                  		}
                	});
				}
				],
				function(err, result) {
          			if (err) {
            			console.log(err.message);
            			//res.status(406);
            			res.status(400);
            			res.json({ ErrorResponse: {message: ""+err }});
          			}else{
            			res.json({ message: 'Save list of records', listRecords_id: listRecords._id  });
         			}
				}
			);
		}else{
		//res.status(406);
    	res.status(400);
    	res.json({message: "The array of the id's of Records is empty"});
		}
	}else{
		//res.status(406);
    	res.status(400);
    	res.json({message: "The array of the id's of Records have an incorrect id"});
	}
}

function getListRecords(req, res) {
  	var listRecords_id = req.swagger.params.id.value;

  	ListRecords.findOne({ _id : listRecords_id }).exec(function (err, listrecords) {
            if(err){
              res.status(400);
              res.send(err);
            }else{
              if(listrecords){
                res.json(listrecords);
              }else{
              	res.status(400);
              	res.json({message: "Doesn't exist a ListRecords with id_record: " + id_rc });
              }
            }
    });

}


module.exports = {
  postListRecords,
  getListRecords
};