import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");
Meteor.methods({
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
		 doc = Documents.findOne();
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