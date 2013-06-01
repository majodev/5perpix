/**
 * client startup
 */
Meteor.startup(function () {
	console.log("Meteor.startup (client)");

	// preset a random color in the session (see view pictureVisualization)
	var randomColor = getRandomEJSONColor();
	Session.set('selected_colorFill', getStringEJSONColor(randomColor));
	Session.set('selected_colorEJSONSerial', EJSON.stringify(randomColor));
	console.log("Meteor.startup: randomColor=" + randomColor);

});