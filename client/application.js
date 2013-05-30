/**
 * subscribe behaviour on the client (needed when package autopublish was removed from meteor!)
 */
Meteor.subscribe("mrtpicturecollection");
Meteor.subscribe("mrtpixelcollection", {p: Session.get("selected_picture")});
Meteor.subscribe("mrtmessagereferencecollection");
Meteor.subscribe("mrtmessagecollection");

/**
 * client startup
 */
Meteor.startup(function () {
	console.log("Meteor.startup (client)");
});