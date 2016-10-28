'use strict';
var UserTodolist = useModel("UserTodolist");
var TodolistTransformer = useTransformer('TodolistTransformer');
/*
 * User Todolist Controller
 */
var UserTodolistController = function(){

	/**
	 * [exportNewTodolists description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.exportNewTodolists = function(req,res){
		// getting user object
		var userId = getUserObject()._id;
		// select all users new todolists
		UserTodolist.where({where : {user : objectId(userId) , $or: [{sent : {$exists : false}},{sent: false}]} , filter : { title : 1 , components : 1}}, function(lists){
			if(lists.length)
				UserTodolist.update({$or: [{sent : {$exists : false}},{sent: false}]}, {sent : new Date()}, function(){
					res.json(lists);
				});
			else
				res.status(204).end();
		});
	};

	/**
	 * [setTodolistSeen description]
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
	 */
	this.setTodolistSeen = function(req,res){

		// getting the todolist id
		var userTodolistId = req.params.id;
		UserTodolist.update({_id : objectId(userTodolistId), sent : {$exists : true} }, {seen : new Date()},function(results){
			if(results.result.n)
				res.json({msg : "ok"});
			else
				res.status(404).end();			
		});
	};
	/**
	 * [saveTodolist description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	this.saveTodolist = function(req,res){
		// getting the todolist id
		var userTodolistId = req.params.id;
		// getting the user id
		var userId = getUserObject()._id;
		// getting the todolist values
		var newComponentsValues = req.body.components;
		// loop through each value validate , transformer then insert in database
		newComponentsValues.forEach(function(component){
			TodolistTransformer.transform(component, function(err , value){
				if(err) return res.status(406).json({msg : err});
				else
					// fill todolist's component's with values
					UserTodolist.update({_id : objectId(userTodolistId),
										 user : objectId(userId), 
										 seen : {$exists : true}, 
										 sent : {$exists : true},
										 "components" : 
										 	{$elemMatch : 
										 		{ 
										 			"index" : value.index,
										 			"type"  : value.type
										 		}
										 	}},
										 	{
										 		"components.$.value" : value.value, 
										 		"components.$.time" : value.time, 
										 		"components.$.location" : value.location
										 	}, function(results){
												if(!results.result.n)
													throw "unknown compment type " + value.type + " " +value.index;
											});
			});
		});
		// set todolist for user is done
		UserTodolist.update({_id : objectId(userTodolistId),
							  user : objectId(userId), 
							  seen : {$exists : true}, 
							  sent : {$exists : true}},
							  {done : true});
		
	    res.status(201).json({msg : "ok"}).end();
	};

};

module.exports = new UserTodolistController;
