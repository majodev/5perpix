/**
 * Template pictureVisualizationHolder filler for selected_picture. Gets Session and updates selected_picture in template
 * @return {string} The name of the selected picture
 */
Template.pictureVisualizationHolder.selected_picture = function () {
	var pic = MrtPictureCollection.findOne(Session.get("selected_picture"));
	return pic && pic.name;
};



/**
 * Template pictureVisualizationItemSVG destroyed function: Kills Deps.autorun handle when the Template is no longer needed.
 */
Template.pictureVisualizationItemSVG.destroyed = function () {
	this.handle && this.handle.stop();
};