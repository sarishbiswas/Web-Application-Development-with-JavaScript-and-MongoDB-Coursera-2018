import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import '/both/both.js';

import './main.html';

Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");

Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	console.log("you hit /");
  this.render('navbar', {to:'header'});
  this.render('docList', {to:'main'});
   
});
        
Router.route('/documents/:_id', function () {
	console.log("you hit /documents"+this.params._id);
	Session.set("docid",this.params._id);
  this.render('navbar', {to:'header'});
  this.render('docItem', {to:'main'});
   
});
//////////////////////////////////////////////////////
/////////          Helper Functions         //////////
//////////////////////////////////////////////////////
Template.insertCommentForm.helpers({
	docid:function(){
		return Session.get("docid");
	}
});

Template.commentList.helpers({
	comments:function(){
		return Comments.find({docid:Session.get("docid")});
	}
})


Template.editor.helpers({
	docid:function(){
		setupCurrentDocument();
		return Session.get("docid");
		// var doc = Documents.findOne();
		// if (doc){
		// 	return doc._id;
		// }
		// else{
		// 	return undefined;
		// }
		// return Documents.findOne()._id;
	},
	config:function(){
		return function(editor){
			editor.setOption("lineNumbers", true);
			editor.setOption("theme", "dracula");
			editor.on("change", function(cm_editor, info){
				console.log(cm_editor.getValue());
				$("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
				// EditingUsers.insert({user:"Sayani"});
				Meteor.call("addEditingUser");
			});
		}
	}
});

Template.editingUsers.helpers({
	users:function(){
		var doc,users,eusers;
		doc = Documents.findOne();
		if (!doc){return;}//no doc give up
		eusers = EditingUsers.findOne({docid:doc._id});
		if(!eusers){return;}//give up
		users = new Array();
		var i = 0;
		for (var user_id in eusers.users){
			users[i] = fixObjectKeys(eusers.users[user_id]);
			i++;
		}
		return users;
	}
});


Template.navbar.helpers({
	documents:function(){
		return Documents.find({});
	}
});

Template.docList.helpers({
	documents:function(){
		return Documents.find({});
	}
});


Template.docMeta.helpers({
	document:function(){
		return Documents.findOne({_id:Session.get("docid")});
	},
	canEdit:function(){
		var doc;
		doc = Documents.findOne({_id:Session.get("docid")});
		if (doc){
			if (doc.owner == Meteor.userId()) {
				return true;
			}
		}
		return false;
	}
});


Template.editableText.helpers({
	userCanEdit : function(doc,Collection){
		doc = Documents.findOne({_id:Session.get("docid"), owner:Meteor.userId()});
		if (doc) {
			return true;
		}
		else {
			return false;
		}
	}
});
//////////////////////////////////////////////////////
///////          Event Listeners           ///////////
//////////////////////////////////////////////////////

Template.navbar.events({
	"click .js-add-doc":function(event){
		event.preventDefault();
		// console.log("Add a new doc!");
		if (!Meteor.user()){//user is not logged in
			alert("You need to login First");
		}
		else{
			var id = Meteor.call("addDoc", function(err, res){
				if(!err){
					console.log("event callback id back : ");
					console.log(id);
					Session.set("docid", res);
				}
			});
			
		}
	},
	"click .js-load-doc":function(event){
		console.log(this);
		Session.set("docid", this._id);
	}
});


Template.docMeta.events({
	"click .js-tog-private":function(event){
		console.log(event.target.checked);
		var doc = {_id:Session.get("docid"), isPrivate:event.target.checked};
		Meteor.call("updateDocPrivacy", doc);
	}
})

///////////////////////////////////////////////////////
////////////     Useful Functions             /////////
///////////////////////////////////////////////////////

function fixObjectKeys(obj){
	var newObj = {};
	for (key in obj){
		var key2 = key.replace("-","");
		newObj[key2] = obj[key];
	}
	return newObj;
}

function setupCurrentDocument(){
	var doc;
	if(!Session.get("docid")){//no docid yet
		doc = Documents.findOne();
		if(doc){
			Session.set("docid",doc._id);
		}
	}
}

//////////////////////////////////////////////////////
/////////     Account Configuaration        //////////
//////////////////////////////////////////////////////

Accounts.ui.config({
	requestPermissions: {},
	extraSignupFields: [{
		fieldName: 'first-name',
		fieldLabel: 'First Name',
		inputType: 'text',
		visible: true,
		validate: function(value, errorFunction) {
			if(!value) {
				errorFunction("Please write your first name");
				return false;
			}
			else{
				return true;
			}
		}
	}, {
		fieldName: 'last-name',
		fieldLabel: 'Last Name',
		inputType: 'text',
		visible: true,
		validate: function(value, errorFunction) {
			if(!value) {
				errorFunction("Please write your last name");
				return false;
			}
			else{
				return true;
			}
		}
	}],
});

