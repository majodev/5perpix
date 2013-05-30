/**
 * Called on server-startup to fill some example pictures and pixels to our Collections if nothing exists
 */
Meteor.startup(function() {
	// STARTUP test content server hack: always reset.
	console.log("Meteor.startup (server): removing old documents from collections...");
	resetAllMrtCollections();
});