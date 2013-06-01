/**
 * Meteor Collection Pictures
 * Holds all pictures
 * fields: width, height, itemwidth, itemheight, rows, cols, name
 *
 * no allow or deny is defined here - manipulations to the data are only supported through Meteor.methods!
 * 
 * @type {Meteor.Collection}
 */
MrtPictureCollection = new Meteor.Collection('mrtpicturecollection');

