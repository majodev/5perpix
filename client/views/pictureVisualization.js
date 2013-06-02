/**
 * Template pictureVisualizationHolder filler for selected_picture. Gets Session and updates selected_picture in template
 * @return {string} The name of the selected picture
 */
Template.pictureVisualizationHolder.selected_picture = function () {
	var pic = MrtPictureCollection.findOne(Session.get("selected_picture"));
	return pic && pic.name;
};

/**
 * Template pictureSelectedDrawColor rendered function: Renders the color that's currently in our session.
 */
Template.pictureSelectedDrawColor.rendered = function () {
	console.log("Template.pictureVisualizationItemSVG.rendered");
	var self = this;
	self.node = self.find("circle");

	if(! self.handle) {
		
		// define a Dep.autorun for the Template, which automatically runs when changes happen
		self.handle = Deps.autorun(function () {
			console.log("Template.pictureSelectedDrawColor.rendered: Deps.autorun");

			var updateDrawColor = function (circle) {
				console.log("Template.pictureSelectedDrawColor.rendered: Deps.autorun: updateDrawColor")
				circle.style("fill", getStringEJSONColor(EJSON.parse(Session.get('selected_colorEJSONSerial'))));
			};

			var circle = d3.select(self.node);
			
			// data update only triggers fill to refresh
			updateDrawColor(circle);
			
			d3.select(self.node)
			.style("fill", getStringEJSONColor(EJSON.parse(Session.get('selected_colorEJSONSerial'))));
		});
	}
};

/**
 * Template pictureRandomColorSelector events: resets the random color in our session...
 */
Template.pictureRandomColorSelector.events({
	'click button.pictureRandomColorSelectorButton': function (event, template) {
		Session.set('selected_colorEJSONSerial', EJSON.stringify(getRandomEJSONColor()));
		console.log("emplate.pictureRandomColorSelector.events buttonClicked: randomColor=" + getStringEJSONColor(EJSON.parse(Session.get('selected_colorEJSONSerial'))));
	}
});