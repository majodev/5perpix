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