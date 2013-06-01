/**
 * client startup
 */
Meteor.startup(function () {
	console.log("Meteor.startup (client)");

	// preset a random color in the session (see view pictureVisualization)
	Session.set('selected_colorEJSONSerial', EJSON.stringify(getRandomEJSONColor()));
});