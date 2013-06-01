/**
 * Meteor Collection MessageReferenceCollection
 * holds references between objects (e.g. picture) and messages
 * fields: targetID, targetType (e.g. 'pic')
 * @type {Meteor.Collection}
 */
MrtMessageReferenceCollection = new Meteor.Collection('mrtmessagereferencecollection');