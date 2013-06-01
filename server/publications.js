/**
	* Publish behaviour on server
	* package autopublish was removed from meteor: we need to define our own publish and subscribe behaviour!
	* package insecure was removed from meteor: see methods.js for allowed client-server interactions
	*
	* Most publishes require an valid argument to publish only the data currently needed by a client.
	*/

Meteor.publish("mrtpicturecollection", function () {
	return MrtPictureCollection.find();
});

Meteor.publish("mrtpixelcollection", function (picID) {
	check(picID, String);
	return MrtPixelCollection.find({picID: picID}); 
});

Meteor.publish("mrtmessagecollection", function (targetID) {
	check(targetID, String);
	var msgRefID;
	if(MrtMessageReferenceCollection.find({targetID: targetID}).count() > 0) {
		msgRefID = MrtMessageReferenceCollection.findOne({targetID: targetID})._id;
	}
	return MrtMessageCollection.find({messageReferenceID: msgRefID}); 
});

Meteor.publish("mrtmessagereferencecollection", function (targetID, targetType) {
	check(targetID, String);
	check(targetType, String);
	return MrtMessageReferenceCollection.find({targetID: targetID, targetType: targetType}); 
});