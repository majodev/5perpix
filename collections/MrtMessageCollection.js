/**
 * Meteor Collection Messages, clients subscribe to messages on picture (p)
 * @type {Meteor.Collection}
 */
MrtMessageCollection = new Meteor.Collection('mrtmessagecollection');


// MrtMessageCollection.allow({
// 	insert: function(userId, doc) {
// 		return true;
// 	}
// });