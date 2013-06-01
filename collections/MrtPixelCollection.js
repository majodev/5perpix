/**
 	* Meteor Collection Pixels
 	* holds pixels of picture
 	* fields: x, y, color, picID
 	*
 	* no allow or deny is defined here - manipulations to the data are only supported through Meteor.methods!
 	* 
 	* @type {Meteor.Collection}
 	*/
MrtPixelCollection = new Meteor.Collection('mrtpixelcollection');