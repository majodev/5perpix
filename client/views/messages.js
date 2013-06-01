/**
 * Add a message though keypress ENTER or button event
 */
Template.messageItemAdd.events({
	'click button.messageItemAddButton': function (event, template) {
		precheckMethodAddMessage(template.find(".messageItemAddInput").value,
				MrtMessageReferenceCollection.findOne({targetID: Session.get("selected_picture")})._id, 
				template);
	},
	'keypress input.messageItemAddInput': function (event, template) {
		if(event.keyCode === 13){
			precheckMethodAddMessage(template.find(".messageItemAddInput").value,
				MrtMessageReferenceCollection.findOne({targetID: Session.get("selected_picture")})._id, 
				template);
		}
	}
});	

/**
 * Returns all messages found, limits to 15 results and sorts by timestamp
 */
Template.messageDisplay.messages = function () {
	return MrtMessageCollection.find({
		messageReferenceID: MrtMessageReferenceCollection.findOne({
			targetID: Session.get("selected_picture")})._id}, {
			sort: {timestamp:-1}, 
			limit: 15}
		);
};

/**
 * Returns the messageReference (currently only the picture id) of a target.
 */
Template.messageHolder.messageReference = function () {
	return MrtMessageReferenceCollection.findOne(
		{targetID: Session.get("selected_picture")}
	);
};

/**
 * Returns one message if it currently exists with the set reference in messages
 */
Template.messageDisplay.messagesFound = function () {
	return MrtMessageCollection.findOne({
		messageReferenceID: MrtMessageReferenceCollection.findOne({
			targetID: Session.get("selected_picture")})._id});
};

/**
 * precheck method
 */
precheckMethodAddMessage = function (message, targetID, template) {
	if(Meteor.user() && targetID.length !== 0 && message.length !== 0) {
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
		// clear the input field...
		template.find(".messageItemAddInput").value = "";
	}
}