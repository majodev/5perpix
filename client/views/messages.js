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