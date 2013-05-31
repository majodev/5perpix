/**
 * subscribe behaviour on the client (needed when package autopublish was removed from meteor!)
 */
Meteor.subscribe("mrtpicturecollection");

Meteor.autorun(function () {
	Meteor.subscribe("mrtpixelcollection", 
		Session.get("selected_picture"), 
		function() {
			console.log("mrtpixelcollection: subscription autorun.");
		}
	);
});

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



//Meteor.subscribe("pubpictureandpixels", Session.get("selected_picture"));