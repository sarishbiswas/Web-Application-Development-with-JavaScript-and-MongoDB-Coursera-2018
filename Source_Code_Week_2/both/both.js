import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

Meteor.methods({
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