import { Meteor } from 'meteor/meteor';
import '/both/both.js';
// import '/server/publications.js';
Meteor.startup(() => {
  // code to run on server at startup
  console.log("server restarted");
});
Meteor.publish("messages", function(){

    // MAKE your edit here...
    // check if the user is logged in.
    // (note that we check 'this.userId' not 'Meteor.user()'
    // when we are in a publication()
    // Then, if they are logged in, return
    // a mongo cursor that results from Messages.find({})
    if (!this.userId){
    	console.log("user is in server");
        return;
    } 
    else {
        console.log("I am here");
        return Messages.find({});
    }
});
