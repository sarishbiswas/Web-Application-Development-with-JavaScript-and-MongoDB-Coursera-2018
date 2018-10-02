import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import '/both/both.js';
import './main.html';

// Meteor.setInterval(function(){
// 	Session.set("current_date",new Date());
// }, 1000); 
// Template.date_display.helpers({
// 	"current_date":function(){
// 		return Session.get("current_date");
// 	}
// });

Template.editor.helpers({
	docid:function(){
		var doc = Documents.findOne();
		if (doc){
			return doc._id;
		}
		else{
			return undefined;
		}
		// return Documents.findOne()._id;
	},
	config:function(){
		return function(editor){
			editor.on("change", function(cm_editor, info){
				console.log(cm_editor.getValue());
				$("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
			});
		}
	}
});