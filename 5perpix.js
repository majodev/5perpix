

/**
 * CLIENTS ONLY
 */
if (Meteor.isClient) {

	/**
	* subscribe behaviour on the client (needed when package autopublish was removed from meteor!)
	*
	* sum-up:
	* @pictures: subscribe to the published pictures from the server.
	* @pixels: subscribe ONLY to the pixels of a selected picture.
	*/
 
	Meteor.subscribe("mrtpicturecollection");
	Meteor.subscribe("mrtpixelcollection", {p: Session.get("selected_picture")});
	Meteor.subscribe("mrtmessagereferencecollection");
	Meteor.subscribe("mrtmessagecollection");

	// Called on client-startup: If no picture selected, select one.
	Meteor.startup(function () {
	});
	
}





/**
 * Helper function to return a randomly generated color channel as int
 * @return {int} Random int between 0 and 256
 */
function getRandomColorChannel() {
	return Math.floor(Math.random()*256);
}

/**
 * Helper function to return a color as EJSON binary Uint8Array containing rgb channels
 * @return {Uint8Array} binary array containing uint8s
 */
function getRandomEJSONColor() {
	var color = EJSON.newBinary(3);
				color[0] = getRandomColorChannel();
				color[1] = getRandomColorChannel();
				color[2] = getRandomColorChannel();
	return color;
}








/**
 * SERVER ONLY
 */
if (Meteor.isServer) {

	


	/**
	 * Called on server-startup to fill some example pictures and pixels to our Collections if nothing exists
	 */
	Meteor.startup(function() {
		// STARTUP test content server hack: always reset.
		//if(MrtPictureCollection.find().count() < 1) {
			console.log("Meteor.startup: removing old documents from collections...");
			resetAllMrtCollections();
		//}
	});

	resetAllMrtCollections = function() {
		//MrtPixelHistoryCollection.remove({}, function() {
			MrtPixelCollection.remove({}, function() {
				MrtMessageCollection.remove({}, function() {
					MrtPictureCollection.remove({}, function() {
						console.log("Meteor.startup: adding test data...");
						addTestData();
					})
				})
			});
		//});
	};

	 /**
		* Server only
		* helper functions to add test data to the server.
		*
		* WARNING! THESE functions ARE blocking! Don't allow calls from clients!
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





	/**
	 * Server only 
	 * helper functions to add content to collections
	 *
	 * WARNING! THESE functions ARE blocking! Don't allow calls from clients!
	 */




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
}