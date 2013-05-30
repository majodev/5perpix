/**
 * Helper function to return a randomly generated color channel as int
 * @return {int} Random int between 0 and 256
 */
var getRandomColorChannel = function () {
	return Math.floor(Math.random()*256);
}

/**
 * Helper function to return a color as EJSON binary Uint8Array containing rgb channels
 * @return {Uint8Array} binary array containing uint8s
 */
var getRandomEJSONColor = function () {
	var color = EJSON.newBinary(3);
		color[0] = getRandomColorChannel();
		color[1] = getRandomColorChannel();
		color[2] = getRandomColorChannel();
	return color;
}

/**
 * Helper function to parse a color as EJSON binaray Uint8Array containing rgb-channels. rgb is automatically appended for use in fillstyle, fill, ...
 * @param  {Uint8Array} colorEJSON, a color in EJSON binary Uint8Array format
 * @return {string} a string of rgb-colors for use in fill, fillstyle, ...
 */
var getStringEJSONColor = function (colorEJSON) {
	return "rgb(" 
		+ colorEJSON[0] + "," 
		+ colorEJSON[1] + "," 
		+ colorEJSON[2] + ")";
}

this.getRandomColorChannel = getRandomColorChannel; // Meteor 0.6.0 var scope export.
this.getRandomEJSONColor = getRandomEJSONColor; // Meteor 0.6.0 var scope export.
this.getStringEJSONColor = getStringEJSONColor; // Meteor 0.6.0 var scope export.