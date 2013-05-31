/**
 * client startup
 */
Meteor.startup(function () {
	console.log("Meteor.startup (client)");

	// set a random color in the session...
	var randomColor = getRandomEJSONColor();
	Session.set('selected_colorFill', getStringEJSONColor(randomColor));
	Session.set('selected_colorEJSONSerial', EJSON.stringify(randomColor));
	console.log("emplate.pictureRandomColorSelector.events buttonClicked: randomColor=" + randomColor);

});