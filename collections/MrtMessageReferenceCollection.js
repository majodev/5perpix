/**
 * Meteor Collection MessageReferenceCollection
 * holds references between objects (e.g. picture) and messages
 * fields: targetID, targetType (e.g. 'pic')
 *
 * no allow or deny is defined here - manipulations to the data are only supported through Meteor.methods!
 * 
 * @type {Meteor.Collection}
 */
MrtMessageReferenceCollection = new Meteor.Collection('mrtmessagereferencecollection');