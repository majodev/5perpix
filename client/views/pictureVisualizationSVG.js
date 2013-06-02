/**
 * Helper for the d3 svg grid (Template pictureVisualizationItemSVG rendered) to determine if mousepressed on mousemouse
 */
var pressed = false;

/**
 * Template pictureVisualizationItemSVG rendered function. Called when pictureVisualizationItemSVG was successfully rendered the first time
 * Defines algorithms to be executed by Deps.autorun on Template Change / Datachange.
 */
Template.pictureVisualizationItemSVG.rendered = function () {
	console.log("Template.pictureVisualizationItemSVG.rendered");
	var self = this;
	self.node = self.find("svg");

	if(! self.handle) {
		
		// define a Dep.autorun for the Template, which automatically runs when changes happen
		self.handle = Deps.autorun(function (){
			console.log("Template.pictureVisualizationItemSVG.rendered: Deps.autorun");

			/**
			 * Init / Update on change
			 * @param  {svg:rect} Needs d3.js rects as parameter.
			 */
			var updateRaw = function (rect) {

				console.log("Template.pictureVisualizationItemSVG.rendered: Deps.autorun: updateRaw");

				rect.attr("x", function(d) { return (d.x) * MrtPictureCollection.findOne(d.picID).itemwidth; })
					.attr("y", function(d) { return (d.y) * MrtPictureCollection.findOne(d.picID).itemheight; })
					.attr("width", function(d) { return MrtPictureCollection.findOne(d.picID).itemwidth; })
					.attr("height", function(d) { return MrtPictureCollection.findOne(d.picID).itemheight; })
					// .attr("rx", 6)
					// .attr("ry", 6)
					.style("fill", function(d) { return getStringEJSONColor(d.color); })
					// .style("stroke", '#555')
					.on('mousedown', function(e) { // on mousedown
						console.log(e);
						precheckChangePixelColor(e.picID, e._id, EJSON.parse(Session.get('selected_colorEJSONSerial')));
						pressed = true;
					 })
					.on('mouseup', function(e) { // on mousedown
						pressed = false;
					 })
					.on('click', function(e) { // on click
						precheckChangePixelColor(e.picID, e._id, EJSON.parse(Session.get('selected_colorEJSONSerial')));
					 })
					.on('mouseover', function(e) { // on mouseover
						if(pressed) {
							precheckChangePixelColor(e.picID, e._id, EJSON.parse(Session.get('selected_colorEJSONSerial')));
						} else {
							d3.select(this)
								.style("fill", function(d) { return getStringEJSONColor(EJSON.parse(Session.get('selected_colorEJSONSerial'))); });
					 	}
					 })
					.on('mouseout', function() { // on mouseout
						d3.select(this)
							.style("fill", function(d) { return getStringEJSONColor(d.color); });
					 });
			};

			// reset the width and height of the svg as defined in the picture entity.
			d3.select(self.node).attr("width", MrtPictureCollection.findOne(Session.get('selected_picture')).width);
			d3.select(self.node).attr("height", MrtPictureCollection.findOne(Session.get('selected_picture')).height);

			// bind my pixel data to the g class .pixels 
			var minpix = d3.select(self.node).select(".pictureVisualizationItemSVGPixels").selectAll("rect")
				.data(MrtPixelCollection.find({
					picID: Session.get("selected_picture")}).fetch(), 
					function (minpix) {return minpix._id; });


			// data update only triggers fill to refresh
			updateRaw(minpix.enter().append("svg:rect"));
			
			d3.select(self.node).select(".pictureVisualizationItemSVGPixels").selectAll("rect")
				.data(MrtPixelCollection.find({picID: Session.get("selected_picture")}).fetch(), 
					function (minpix) {return minpix._id; })
				.style("fill", function(d) { return getStringEJSONColor(d.color); })

			// kill pixel on remove from data source
			minpix.exit().remove();
			
		});
	}
};

/**
 * Template pictureVisualizationItemSVG destroyed function: Kills Deps.autorun handle when the Template is no longer needed.
 */
Template.pictureVisualizationItemSVG.destroyed = function () {
	this.handle && this.handle.stop();
};

/**
 * precheckChangePixelColor: client side precheck before invoking Methor.method to change the pixel color
 * @param  {string} 		picID _id of the picture
 * @param  {string} 		pixID _id of the pixel
 * @param  {Uint8Array} color new color of the pixel
 */
precheckChangePixelColor = function (picID, pixID, color) {
	if(Meteor.user()) {
		if(EJSON.equals(MrtPixelCollection.findOne(pixID).color, color) === false) { // check if it's a new color that going to be submitted.
		Meteor.call('changePixelColor', picID, pixID, color, 
			function (error, result) { 
				if(error) {
					console.log("precheckChangePixelColor (callback): update failed. error=" + error);
				}
				if(result) {
					console.log("precheckChangePixelColor (callback): update success. result=" + result);
				}
			});
		}
	}
}
