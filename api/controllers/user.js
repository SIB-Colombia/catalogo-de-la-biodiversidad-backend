import mongoose from 'mongoose';
import async from 'async';
import User from '../models/user.js';
import add_objects from '../models/additionalModels.js';
import winston from 'winston'

winston.add(winston.transports.File, { filename: 'chigui.log' });

function postUser(req, res) {
	console.log(req.body);
	var user  = req.body;
	console.log(user);
	var user_id = mongoose.Types.ObjectId();
	user._id = mongoose.Types.ObjectId();
	user = new User(user);

	user.save(function(err){
        if(err){
            res.status(400);
    		res.json({message: err});
        }else{
        	winston.info('info', 'Saved user with id_user: ' + user.id_user);
            res.json({ message: 'Saved user', id_user: user.id_user  });
        }
    });
}

module.exports = {
  postUser
};