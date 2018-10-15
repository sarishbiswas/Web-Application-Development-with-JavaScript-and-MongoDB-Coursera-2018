import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");
Comments = new Mongo.Collection("comments");

Comments.attachSchema(new SimpleSchema({
	title: {
		type:String,
		label: "Title",
		max: 200
	},
	comment: {
		type:String,
		label: "Comment",
		max: 1000
	},
	docid:{
		type: String,
	},
	owner:{
		type: String,
	}
}));

Meteor.methods({
	addComment:function(comment){
		console.log("addComment method is running");
		if (this.userId){
			comment.createdOn = new Date();
			comment.userId = this.userId;
			comment.owner = this.userId;
			return Comments.insert(comment);
		}
		return;
	},
	addDoc:function(){
		var doc;
		console.log("addDoc called")
		if (!this.userId) {//not logged in
			return;
		} 
		else {
			doc = {owner: this.userId,createdOn: new Date(),title: "My new doc!"};
			var id = Documents.insert(doc);
			console.log("adddoc method has an id: "+id);
			return id;
		}
	},
	updateDocPrivacy:function(doc){
		console.log("all okk");
		console.log(doc);
		var realDoc = Documents.findOne({_id:doc._id,owner:this.userId});
		if (realDoc){
			realDoc.isPrivate = doc.isPrivate;
			Documents.update({_id:doc._id}, realDoc);
		}
	},
	addEditingUser:function(){
		 var doc,user,eusers;
		 doc = Documents.findOne({_id:docid});
		 if (!doc){return;}//no doc give up
		 if (!this.userId){return;}//no logged in user give up
		 //now i have doc and user
		 user = Meteor.user().profile;
		 eusers = EditingUsers.findOne({docid:doc._id});
		 if(!eusers){
		 	eusers = {
		 		docid:doc._id,
		 		 users:{},
		 	};
		 }
		 user.lastEdit = new Date();
		 eusers.users[this.userId] = user;

		EditingUsers.upsert({_id:eusers._id}, eusers);
	}
});