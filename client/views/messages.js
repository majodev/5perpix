Template.messageItemAdd.events({
	'click button.messageItemAddButton': function (event, template) {
		precheckMethodAddMessage(template.find(".messageItemAddInput").value,
				MrtMessageReferenceCollection.findOne({targetID: Session.get("selected_picture")})._id);
			template.find(".messageItemAddInput").value = "";
	},
	'keypress input.messageItemAddInput': function (event, template) {
		if(event.keyCode == 13){
			precheckMethodAddMessage(template.find(".messageItemAddInput").value,
				MrtMessageReferenceCollection.findOne({targetID: Session.get("selected_picture")})._id);
			template.find(".messageItemAddInput").value = "";
		}
	}
});	

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

precheckMethodAddMessage = function (message, targetID) {
	if(message )
	Meteor.call('addMessage', 
		message, 
		targetID, 
		function (error, result) {
			if(error) {
				console.log("precheckMethodAddMessage (callback): update failed. error=" + error);
			}
			if(result) {
				console.log("precheckMethodAddMessage (callback): update success. result=" + result);
			}
		}
	);
}

// addMessage = function (event, template) {
// 	MrtMessageCollection.insert({
// 		text: template.find(".messageItemAddInput").value, 
// 		messageReferenceID: MrtMessageReferenceCollection.findOne({
// 			targetID: Session.get("selected_picture")
// 		})._id,
// 		author: Meteor.user().emails[0].address,
// 		timestamp: new Date().toUTCString(),
// 	}, function() {
// 		template.find(".messageItemAddInput").value = "";
// 	});
// };