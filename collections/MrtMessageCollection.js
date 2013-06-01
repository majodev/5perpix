/**
 * Meteor Collection Messages
 * Holds all messages
 * fields: text, messageReferenceID, author, timestamp
 * 
 * no allow or deny is defined here - manipulations to the data are only supported through Meteor.methods!
 * 
 * @type {Meteor.Collection}
 */
MrtMessageCollection = new Meteor.Collection('mrtmessagecollection');