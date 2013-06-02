Template.pictureVisualizationItemCanvas.rendered = function () {
	console.log("Template.pictureVisualizationItemCanvas.rendered");
	var self = this;
	self.node = self.find("canvas");

	if(! self.handle) {
		
		// define a Dep.autorun for the Template, which automatically runs when changes happen
		self.handle = Deps.autorun(function (){
			console.log("Template.pictureVisualizationItemCanvas.rendered: Deps.autorun");

			// Following this idea: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
			var picture = MrtPictureCollection.findOne(Session.get('selected_picture'));
			
			if(picture) {
				var canvas = d3.select(self.node)
				.style({position: 'relative', width: picture.width + 'px', height: picture.height + 'px'})
				.attr({width: picture.width, height: picture.height})
				.node();

				var ctx = canvas.getContext('2d');
				var imageData = ctx.getImageData(0, 0, picture.width, picture.height);

				var buf = new ArrayBuffer(imageData.data.length);
				var buf8 = new Uint8ClampedArray(buf);
				var data = new Uint32Array(buf);

				var pixels = MrtPixelCollection.find({picID: Session.get('selected_picture')});
				pixels.forEach(function (pixel) {
					for (var a = 0; a < (picture.itemheight); a++) {
						for (var b = 0; b < (picture.itemwidth); b++) {
						data[(pixel.y*Math.floor(picture.itemheight)+a) * picture.width + (pixel.x*Math.floor(picture.itemwidth)+b)] =
							(255 << 24) |    // alpha
							(pixel.color[2] << 16) |    // blue
							(pixel.color[1] <<  8) |    // green
							pixel.color[0];            // red
						}
					}
				});
				imageData.data.set(buf8);
				ctx.putImageData(imageData, 0, 0);
			}
		});
	}
};