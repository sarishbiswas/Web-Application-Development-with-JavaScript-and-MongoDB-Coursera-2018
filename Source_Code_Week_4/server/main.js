import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/both/both.js';

// Documents = new Mongo.Collection("documents");
Meteor.startup(function() {
  // code to run on server at startup
  if (!Documents.findOne()){
  	Documents.insert({title:"My new Document",isPrivate:false});
  }
});

Meteor.publish("documents", function(){
	return Documents.find({
		$or:[
		{isPrivate:false},
		{owner:this.userId}
		]
	});
});

Meteor.publish("editingUsers", function(){
	return EditingUsers.find();
});

Meteor.publish("comments", function(){
	return Comments.find();
});