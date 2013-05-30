/**
	* Publish behaviour and CRUD on server
	* package autopublish was removed from meteor: we need to define our own publish and subscribe behaviour!
	* package insecure was removed from meteor: we need to define the allowed actions on the data (pictures and pixels)
	*
	* sum-up:
	* @pictures: always publish all pictures to all users. 
	* @pixels: always publish all pixels of all pictures! (client will only subscribe to the pixels it currently needs!).
	*/

	Meteor.publish("mrtpicturecollection", function () {
		return MrtPictureCollection.find();
	});

	Meteor.publish("mrtpixelcollection", function () {
		return MrtPixelCollection.find(); 
	});

	Meteor.publish("mrtmessagecollection", function () {
		return MrtMessageCollection.find(); 
	});

	Meteor.publish("mrtmessagereferencecollection", function () {
		return MrtMessageReferenceCollection.find(); 
	});