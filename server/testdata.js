 /**
	* EXPORTED resetAllMrtCollections: Remove all data from collections and add the defined test data
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
	* Generate testdata for the server.
	* Also useful to examine the target structure
	*
	* WARNING: all inserts are BLOCKING (not async!) on the server!
	*/

addTestData = function() {
	addTestReferencesAndMessages(
		addTestPictureWithPixels("SmallPicture-FewPixels", 200, 200, 5, 5), "a");
	addTestReferencesAndMessages(
		addTestPictureWithPixels("MediumPicture-FewPixels", 350, 350, 5, 5), "b");
	addTestReferencesAndMessages(
		addTestPictureWithPixels("BigPicture-FewPixels", 500, 500, 5, 5), "c");
	addTestReferencesAndMessages(
		addTestPictureWithPixels("MediumPicture-MediumPixels", 350, 350, 12, 12), null);
	addTestReferencesAndMessages(
		addTestPictureWithPixels("BigPicture-ManyPixels", 500, 500, 20, 20), null);
}

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

addTestPictureWithPixels = function(name, gridWidth, gridHeight, rows, cols) {
	var gridItemWidth = gridWidth / rows;
	var gridItemHeight = (true) ? gridItemWidth : gridHeight / cols;

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

addMessageReference = function(targetID, targetType) {
	var messageReference = MrtMessageReferenceCollection.insert({
		targetID: targetID, 
		targetType: targetType
	});
	return messageReference;
};

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
 * @param  {int} rows               count of rows to generate --> x
 * @param  {int} cols               count of cols to generate --> y
 * @param  {string | objectID} pID  reference to picture --> picID
 */
addPixels = function(rows, cols, picID) {

	for (var index_y = 0; index_y < rows; index_y++) {
		for (var index_x = 0; index_x < cols; index_x++) {
			
			MrtPixelCollection.insert({
				x: index_x, 
				y: index_y, 
				color: getRandomEJSONColor(),
				picID: picID,
				userID: "SERVER"
			});
		}
	}
	console.log("addPixels: added pixels for pID=" + picID + " rows=" + rows + " cols=" + cols);
};
