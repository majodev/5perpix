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
 * Helper function to parse a color as EJSON binaray Uint8Array containing rgb-channels. rgb is automatically appended for use in fillstyle, fill, ...
 * @param  {Uint8Array} colorEJSON, a color in EJSON binary Uint8Array format
 * @return {string} a string of rgb-colors for use in fill, fillstyle, ...
 */
function getStringEJSONColor(colorEJSON) {
	return "rgb(" 
		+ colorEJSON[0] + "," 
		+ colorEJSON[1] + "," 
		+ colorEJSON[2] + ")";
}

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


	Template.messageItemAdd.events({
		'click button.messageItemAddButton': function (event, template) {
			addMessage(event, template);
		},
		'keypress input.messageItemAddInput': function (event, template) {
			if(event.keyCode == 13){
				addMessage(event, template);
			}
		}
	});

	addMessage = function (event, template) {
		MrtMessageCollection.insert({
			text: template.find(".messageItemAddInput").value, 
			messageReferenceID: MrtMessageReferenceCollection.findOne({
				targetID: Session.get("selected_picture")
			})._id,
			author: Meteor.user().emails[0].address,
			timestamp: new Date().toUTCString(),
		}, function() {
			template.find(".messageItemAddInput").value = "";
		});
	};

	Template.messageDisplay.messages = function () {
		return MrtMessageCollection.find({
			messageReferenceID: MrtMessageReferenceCollection.findOne({
				targetID: Session.get("selected_picture")})._id}, {
				sort: {timestamp:-1}, 
				limit: 15}
			);
	};

	Template.messageHolder.messageReference = function () {
		return MrtMessageReferenceCollection.findOne(
			{targetID: Session.get("selected_picture")}
		);
	};

	Template.messageDisplay.messagesFound = function () {
		return MrtMessageCollection.findOne({
			messageReferenceID: MrtMessageReferenceCollection.findOne({
				targetID: Session.get("selected_picture")})._id});
	};

	/**
	 * Template pictures filler for all pictures (for each within template)
	 * @return {Meteor.Collection.Cursor} all pictures within the meteor collection
	 */
	Template.pictureOverviewDisplay.pictures = function () {
		return MrtPictureCollection.find({});
	};

	Template.pictureOverviewHolder.picturesFound = function () {
		return MrtPictureCollection.findOne();
	};

	/**
	 * Template picture filler for div class picture. selected is appended to the picture class while this picture is selected...
	 * @return {string} emptystring or 'selected'
	 */
	Template.picture.selected = function () { // adds 'selected' to class...
		return Session.equals("selected_picture", this._id) ? " selected" : '';
	};

	/**
	 * Template Event Handler for clicking on a picture within the picture template
	 */
	Template.picture.events({
		'click': function () {
			Session.set("selected_picture", this._id);
		}
	});

	/**
	 * Template pictureVisualizationHolder filler for selected_picture. Gets Session and updates selected_picture in template
	 * @return {string} The name of the selected picture
	 */
	Template.pictureVisualizationHolder.selected_picture = function () {
		var pic = MrtPictureCollection.findOne(Session.get("selected_picture"));
		return pic && pic.name;
	};


	/**
	 * Template pictureVisualizationItemSVG rendered function. Called when pictureVisualizationItemSVG was successfully rendered the first time
	 * Defines algorithms to be executed by Deps.autorun on Template Change / Datachange.
	 */
	Template.pictureVisualizationItemSVG.rendered = function () {
		console.log("Template.pictureVisualizationItemSVG.rendered");
		var self = this;
		self.node = self.find("svg");

		if(! self.handle) {
			
			// define a Dep.autorun for the Template, which automatically runs when changes happen
			self.handle = Deps.autorun(function (){
				console.log("Template.pictureVisualizationItemSVG.rendered: Deps.autorun");

				/**
				 * Init / Update on change
				 * @param  {svg:rect} Needs d3.js rects as parameter.
				 */
				var updateRaw = function (rect) {

					console.log("Template.pictureVisualizationItemSVG.rendered: Deps.autorun: updateRaw")

					rect.attr("x", function(d) { return (d.x) * MrtPictureCollection.findOne(d.picID).itemwidth; })
						.attr("y", function(d) { return (d.y) * MrtPictureCollection.findOne(d.picID).itemheight; })
						.attr("width", function(d) { return MrtPictureCollection.findOne(d.picID).itemwidth; })
						.attr("height", function(d) { return MrtPictureCollection.findOne(d.picID).itemheight; })
						// .attr("rx", 6)
						// .attr("ry", 6)
						.style("fill", function(d) { return getStringEJSONColor(d.color); })
						// .style("stroke", '#555')
						.on('click', function(e) { // on click
								console.log("click: _id=" + e._id);
								MrtPixelCollection.update(e._id, {$set: {color: getRandomEJSONColor() }});
						 })
						.on('mouseover', function(e) { // on mouseover
								console.log("mouseover: _id=" + e._id);
								MrtPixelCollection.update(e._id, {$set: {color: getRandomEJSONColor() }});
						 })
						 .on('mouseout', function() { // on mouseout
								d3.select(this)
										.style("fill", function(d) { return getStringEJSONColor(d.color); });
						 });
				};

				// bind my pixel data to the g class .pixels 
				var minpix = d3.select(self.node).select(".pictureVisualizationItemSVGPixels").selectAll("rect")
					.data(MrtPixelCollection.find({picID: Session.get("selected_picture")}).fetch(), 
						function (minpix) {return minpix._id; });


				// data update only triggers fill to refresh
				updateRaw(minpix.enter().append("svg:rect"));
				
				d3.select(self.node).select(".pictureVisualizationItemSVGPixels").selectAll("rect")
					.data(MrtPixelCollection.find({picID: Session.get("selected_picture")}).fetch(), 
						function (minpix) {return minpix._id; })
					.style("fill", function(d) { return getStringEJSONColor(d.color); })

				// kill pixel on remove from data source
				minpix.exit().remove();
				
			});
		}
	};

	/**
	 * Template pictureVisualizationItemSVG destroyed function: Kills Deps.autorun handle when the Template is no longer needed.
	 */
	Template.pictureVisualizationItemSVG.destroyed = function () {
		this.handle && this.handle.stop();
	};
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