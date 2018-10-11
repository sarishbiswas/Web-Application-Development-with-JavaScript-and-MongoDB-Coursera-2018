import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '/both/both.js';
// Documents = new Mongo.Collection("documents");
Meteor.startup(function() {
  // code to run on server at startup
  if (!Documents.findOne()){
  	Documents.insert({title:"My new Document"});
  }
  if (!EditingUsers.findOne()){
  	EditingUsers.insert({user:"Sayani"});
  }
});