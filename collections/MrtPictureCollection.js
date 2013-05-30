/**
 * Meteor Collection Pictures, fully available on clients
 * @type {Meteor.Collection}
 */
MrtPictureCollection = new Meteor.Collection('mrtpicturecollection');

/** CRUD-restrictions (create, read, update, delete):
	* @pictures: we don't define insert / change or removed functions for subscribed pictures as we don't want to allow manipulation on the clientside!
	*/