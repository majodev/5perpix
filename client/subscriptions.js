/**
 * subscribe behaviour on the client (needed when package autopublish was removed from meteor!)
 * we wrap most subscribes in an autorun because they have arguments (Session.get) that could change our subscription and thus have to be run multiple times on the client.
 */
Meteor.subscribe("mrtpicturecollection");

Meteor.autorun(function () {
	Meteor.subscribe("mrtmessagereferencecollection", 
		Session.get("selected_picture"), 
		"pic", 
		function() {
			console.log("mrtmessagereferencecollection: subscription autorun.");
		}
	);
});

Meteor.autorun(function () {
	Meteor.subscribe("mrtmessagecollection", 
		Session.get("selected_picture"),
		function() {
			console.log("mrtmessagecollection: subscription autorun.");
		}
	);
});

Meteor.autorun(function () {
	Meteor.subscribe("mrtpixelcollection", 
		Session.get("selected_picture"), 
		function() {
			console.log("mrtpixelcollection: subscription autorun.");
		}
	);
});

