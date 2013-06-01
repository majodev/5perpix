/**
 * testdata.js defines a few functions to add test content to our application
 * these should NEVER be visible to any client!
 *
 * WARNING: don't EVER export these functions to clients, THEY ARE BLOCKING!
 * might be useful to examine the collection field structure
 */

/**
	* EXPORTED resetAllMrtCollections: Remove all data from collections and add the defined test data
	*
	* THIS function is run by Meteor.startup on the server!
	*/
resetAllMrtCollections = function() {
		MrtPixelCollection.remove({}, function() {
			MrtMessageCollection.remove({}, function() {
				MrtPictureCollection.remove({}, function() {
					console.log("Meteor.startup: adding test data...");
					addTestData();
				})
			})
		});
};

this.resetAllMrtCollections = resetAllMrtCollections; // Meteor 0.6.0 var scope export.


/**
 * addTestData: Generate testdata for the server.
 * WARNING: all inserts are BLOCKING (not async!) on the server!
 */
addTestData = function() {
	addTestReferencesAndMessages(
		addTestPictureWithPixels("less", 80, 80, 8, 8), "a");
	addTestReferencesAndMessages(
		addTestPictureWithPixels("few", 150, 150, 14, 14), "b");
	addTestReferencesAndMessages(
		addTestPictureWithPixels("normal", 400, 400, 22, 22), "c");
	addTestReferencesAndMessages(
		addTestPictureWithPixels("bigger", 550, 550, 30, 30), null);
	addTestReferencesAndMessages(
		addTestPictureWithPixels("large", 700, 700, 40, 40), null);
}

/**
 * addTestReferencesAndMessages: attach a few example message (based on answertype) to a picID (the target messageReference)
 * @param  {string} picID      target picture to attach a message
 * @param  {string} answertype a, b or c as string for some message presets
 */
addTestReferencesAndMessages = function(picID, answertype) {
	var msgRefID = addMessageReference(picID, "pic");

	switch (answertype) {
		case "a":
			addMessage("It's not getting more interesting. ", msgRefID, "dr@house.com", new Date().toUTCString());
			addMessage("Really ^^", msgRefID, "batman@raw.com", new Date().toUTCString());
			break;
		case "b":
			addMessage("Second... D'oh.", msgRefID, "homer@simpson.com", new Date().toUTCString());
			break;
		case "c":
			addMessage("Test message! Your owner...", msgRefID, "gladus@system.local", new Date().toUTCString());
			break;
	}
}

/**
 * addTestPictureWithPixels: directly inserts a new picture + its pixels with the overgiven arguments
 * @param  {string} name      name of the new picture
 * @param  {int} gridWidth  	width of the new picture
 * @param  {int} gridHeight 	height of the new picture
 * @param  {int} rows       	row (count pixels) of the new picture
 * @param  {int} cols       	cols (count pixels) of the new picture
 * @return {string}           _id of the new inserted picture
 */
addTestPictureWithPixels = function(name, gridWidth, gridHeight, rows, cols) {
	var gridItemWidth = gridWidth / rows;
	var gridItemHeight = gridHeight / cols;

	var picID = MrtPictureCollection.insert({
		width: gridWidth, 
		height: gridHeight, 
		itemwidth: gridItemWidth, 
		itemheight: gridItemHeight, 
		rows: rows, 
		cols: cols, 
		name: name
	});

	console.log("addTestPictureWithPixels: added picture: name=" + name + " id=" + picID + " width=" + gridWidth + " height=" + gridHeight);

	addPixels(rows, cols, picID);
	
	return picID;
};

/**
 * addMessageReference: directly inserts a new messageReference with the overgiven arguments
 * @param  {string} targetID   _id of the target (e.g. picture_id)
 * @param  {string} targetType type of the target (e.g. "pic")
 * @return {string}            _id of the new inserted messageReference
 */
addMessageReference = function(targetID, targetType) {
	var messageReference = MrtMessageReferenceCollection.insert({
		targetID: targetID, 
		targetType: targetType
	});
	return messageReference;
};

/**
 * addMessage: directly inserts a new message with the overgiven arguments
 * @param  {string} text               text of the message
 * @param  {string} messageReferenceID _id of the messageReference
 * @param  {string} author             author of the message
 * @param  {string} timestamp          timestamp of the message (UTCString)
 * @return {string}                    _id of the inserted message
 */
addMessage = function(text, messageReferenceID, author, timestamp) {
	var messageID = MrtMessageCollection.insert({
		text: text, 
		messageReferenceID: messageReferenceID,
		author: author,
		timestamp: timestamp,
	});
	return messageID;
};

/**
 * addPixels defines a function to fill an example grid with data --> MrtPixelCollection
 * @param  {int} 		rows 	count of rows to generate --> x
 * @param  {int} 		cols 	count of cols to generate --> y
 * @param  {string} pID  	reference to picture --> picID
 */
addPixels = function(rows, cols, picID) {

	for (var index_y = 0; index_y < rows; index_y++) {
		for (var index_x = 0; index_x < cols; index_x++) {
			
			MrtPixelCollection.insert({
				x: index_x, 
				y: index_y, 
				color: getRandomEJSONColor(),
				picID: picID,
			});
		}
	}
	console.log("addPixels: added pixels for pID=" + picID + " rows=" + rows + " cols=" + cols);
};
