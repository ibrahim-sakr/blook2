'use strict';

var User 					= useModel("User"),
	Message 				= useModel("Message"),
	Validator				= useUtil("Validate"),
	MessageTransformer		= useTransformer("MessageTransformer"),
	MessageDateTransformer 	= useTransformer("MessageDateTransformer");

/**
 * [UserMessagesController description]
 */
var UserMessagesController = function(){
	/**
	 * [sendMessage description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.sendMessage = function(req,res){
		
		// message object from request 
		var message = {
			sender   : getUserObject()._id 	|| '',
			reciever : req.body.reciever 	|| '',
			title    : req.body.title 		|| '',
			body     : req.body.body		|| '',
			sent_at  : req.body.time 		|| ''
		};
			
		// rules to validate over
		var rules = {
			reciever : ['required','array'],
			title    : ['required','min:2'],
			body     : ['required','min:3'],
			sent_at  : ['required', 'numeric']
		};
		// validating message object
		Validator.make(message, rules, function(err){
			// check any errors 
			if(err) res.status(406).json({msg : err});
			else 
				// transform and save the message object
				Message.create(MessageTransformer.transform(message), function(message){
					res.status(201).json({msg : "ok"});
				});
		});
	};

	/**
	 * [getInbox description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.getInbox = function(req,res){
		
		// user's id
		var userId = getUserObject()._id;

		// get all messages related to this user and sent  value is false
		Message.where({
			where : {
				"reciever":{ 
					$elemMatch : { 
						sent : false , 
						id : objectId(userId)
					}
				}
			} ,
			filter : {
				title : 1, body : 1 ,  sent_at : 1, sender : 1}},function(msgs){
			// if there messages
			if(msgs.length)
			{
				// update messages to set sent as true for this user
				Message.update({
					"reciever" : { 
						$elemMatch : { 
							sent : false , 
							id : objectId(userId) 
						} 
					} 
				},{"reciever.$.sent" : true}, function(num){
					// prepare messages to be sent to the mobile app
					return res.json(MessageDateTransformer.transformCollection(msgs));
				});
			}
			else // or no messages
			{
				res.status(204).end();
			}
		});
	};
	
	/**
	 * [setMessageSeen description]
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
	 */
	this.setMessageSeen = function(req,res){
		
		// getting the message id
		var messageId = req.params.id;

		// geting user id
		var userId = getUserObject()._id;

		// update the message status for this user
		Message.update({"reciever" : { $elemMatch : {  sent : true , seen : false , id : objectId(userId)}}},{"reciever.$.seen" : true}, function(num){
			if(num.modifiedCount) res.status(202).json({msg : "ok"}).end();
			else res.status(404).json({msg : "invalid message id or not found"}).end();
		});
	};

	/**
	 * [getHistory description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.getHistory = function(req,res){
		// getting user id
		var userId = getUserObject()._id;
		// number of messages to be loaded
		var numberOfMessages = Number(req.params.number);
		// offset time as milliseconds
		var offsetMilliseconds = Number(req.params.offsetMilliseconds);
		// after or before as 0 or 1
		var beforeOrAfter = (req.params.beforeOrAfter) ? req.params.beforeOrAfter : 0;
		
		var target = (req.params.inboxOrOutbox === 'inbox') ? 'inbox' : 'outbox';   	

		var query = {
			where : {
				sent_at : {}
			},
			filter: {
				title 	: 1,
				body  	: 1,
				sender 	: 1,
				sent_at : 1 
			} 
		};
		// building the query object
		if(target === 'inbox') query.where = {"reciever" : {$elemMatch : { id : objectId(userId)}}};
		else query.where = {"sender" :  objectId(userId)};

		if(beforeOrAfter == 0) query.where.sent_at = {$gt :  new Date(offsetMilliseconds) };
		else if(beforeOrAfter == 1) query.where.sent_at = {$lt : new Date(offsetMilliseconds) };
		Message.where(query,function(msgs){
			if(msgs.length) res.json(MessageDateTransformer.transformCollection(msgs));
			else res.status(204).send();
		},numberOfMessages);
	};

};

module.exports = new UserMessagesController;
