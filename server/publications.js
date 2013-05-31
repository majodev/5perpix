/**
	* Publish behaviour and CRUD on server
	* package autopublish was removed from meteor: we need to define our own publish and subscribe behaviour!
	* package insecure was removed from meteor: we need to define the allowed actions on the data (pictures and pixels)
	*/

Meteor.publish("mrtpicturecollection", function () {
	return MrtPictureCollection.find();
});

Meteor.publish("mrtpixelcollection", function (picID) {
	check(picID, String);
	console.log("publishing ......");
	return MrtPixelCollection.find({picID: picID}); 
});

Meteor.publish("mrtmessagecollection", function (targetID) {

	var msgRefID;

	if(MrtMessageReferenceCollection.find({targetID: targetID}).count() > 0) {
		msgRefID = MrtMessageReferenceCollection.findOne({targetID: targetID})._id;
	}
	
	return MrtMessageCollection.find({messageReferenceID: msgRefID}); 
});

Meteor.publish("mrtmessagereferencecollection", function (targetID, targetType) {
	return MrtMessageReferenceCollection.find({targetID: targetID, targetType: targetType}); 
});


// publish dependent documents and simulate joins
// Meteor.publish("pubpictureandpixels", function (picID) {
//   check(picID, String);
//   return [
//     MrtPictureCollection.find({_id: picID}),
//     MrtPixelCollection.find({picID: picID})
//   ];
// });