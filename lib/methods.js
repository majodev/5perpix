Meteor.methods({

	changePixelColor: function (picID, pixID, color) {
		check(picID, String);
		check(pixID, String);
		check(color, ColorArrayInt8);

		if(!this.userId) {
			throw new Meteor.Error(404, "changePixelColor: Undefined userId.");
		} 
		
		var checkPixel = MrtPixelCollection.find({picID: picID, _id: pixID});

		if(checkPixel.count() === 0) {
			throw new Meteor.Error(404, "changePixelColor: Can't find pixel of picture. pixID=" + pixID + " picID=" + picID);
		}

		if(checkPixel.count() > 1) {
			throw new Meteor.Error(404, "changePixelColor: Can't match pixel to picture, too much results. pixID=" + pixID + " picID=" + picID);
		}

		if(checkPixel.count() === 1) {
			MrtPixelCollection.update(pixID, {$set: {color: color }}, 
				function (error) {
					if(error) {
						console.log("changePixelColor (callback): update failed! error=" + error);
					} else {
						console.log("changePixelColor (callback): update success!");
					}
				});	
		} 

		return pixID;
	},

	addMessage: function (message, messageReference) {
		check(message, NonEmptyString);
		check(messageReference, String);

		if(!this.userId) {
			throw new Meteor.Error(404, "addMessage: Undefined userId.");
		}
		
		var msgReference = MrtMessageReferenceCollection.findOne(messageReference);

		if(!msgReference) {
			throw new Meteor.Error(404, "addMessage: Cannot match messageReference=" + messageReference);
		}

		if(Meteor.isServer) {
			console.log("addMessage (server): message=" + message + " messageReference=" + messageReference);

			MrtMessageCollection.insert({
				text: message, 
				messageReferenceID: messageReference,
				author: Meteor.user().emails[0].address, //TODO: change this to hold the usersID AND furthermore publish only the stringname to the client!
				timestamp: new Date().toUTCString()
			}, function (error, id) {
				if(error) {
					console.log("addMessage (server callback): insert failed! error=" + error);
				} else {
					console.log("addMessage (server callback): insert success! id=" + id);
				}
			});
		}
	}

});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var ColorArrayInt8 = Match.Where(function (x) {
	return EJSON.isBinary(x) && x.length === 3;
});
