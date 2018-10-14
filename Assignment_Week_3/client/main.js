import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import '/both/both.js';
import './main.html';
Meteor.subscribe("messages");
    // this will configure the sign up field so it
    // they only need a username
 Accounts.ui.config({
      passwordSignupFields: 'USERNAME_ONLY',
    });

    Template.messageList.events({
        'click .js-del-message':function(){
            Meteor.call('removeMessage', this._id, function(err, res){
                if (!res){
                    alert('Can only delete your own ones...');
                }
            });
        }
    });

    Template.messageForm.events({
        // this event listener is triggered when they click on
        // the post! button on the message form template

        'click .js-save-message':function(event){
            var messageText = $('#message-text-input').val();
            // notice how tihs has changed since the lsat time
            // now we read the username from the Meteor.user()
            var messageNickname = "Anon";
            if (Meteor.user()){
                messageNickname = Meteor.user().username;
            }
            var message = {messageText:messageText,
                            nickname:messageNickname,
                            createdOn:new Date()};
          Meteor.call('insertMessage', message, function(err, res){
                        if (!res){
                            // nothing came back - warn the user with alert
                            alert("please login to post");
                        }
                    });
                }
    });

    Template.header.helpers({
        nickname:function(){
            if (Meteor.user()){
                return Meteor.user().username;
            }
        },
    });

    Template.messageList.helpers({
        // this helper provides the list of messages for the
        // messgaeList template
        messages:function(){

            // MAKE your edit here:
            // first, if the user is logged in,
            // subscribe to the
            // publication called 'messages'
            if (Meteor.user()){
                console.log("sarish");
                Meteor.subscribe("messages");

                // return Messages.find({});
                return Messages.find({},{sort: {createdOn: -1}});
            }else{
                return;
            }
            // next: call find on the Messages collection:
        // pass in the filter {sort: {createdOn: -1}} 
        // as the second argument 
            
        }
    });


    Template.header.helpers({
        // HERE is another one for you - can you
        // complete the template helper for the 'header' template
        // called 'nickname' that
        // returns the nickname from the Session variable?, if they have set it
        nickname:function(){
            if (Meteor.user()){
                return Meteor.user().username;
            }
        },
    });


    Template.messageList.helpers({
        // this helper provides the list of messages for the
        // messgaeList template
        messages:function(){
            return Messages.find({}, {sort: {createdOn: -1}})
        }
    });

