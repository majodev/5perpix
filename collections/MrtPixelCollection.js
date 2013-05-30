/**
 * Meteor Collection Pixels, clients subscribe to pixels on picture (p)
 * @type {Meteor.Collection}
 */
MrtPixelCollection = new Meteor.Collection('mrtpixelcollection');

MrtPixelCollection.allow({
	update: function (userId, doc, fields, modifier) {
		// update is allowed with proper parameter
		return _.contains(fields, 'color') && 
			EJSON.isBinary(doc.color) &&
			doc.color.length === 3;
	},

fetch: ['color']
});

MrtPixelCollection.deny({
	update: function (userId, doc, fields, modifier) {
		// changes to x, y and pID denied!
		return _.contains(fields, 'x') || 
			_.contains(fields, 'y') || 
			_.contains(fields, 'picID');
	},

fetch: ['x', 'y', 'picID']
});

MrtPixelCollection.deny({
	update: function (userId, doc, fields, modifier) {
		// changes to x, y and pID denied!
		if(Meteor.userId() === null)
			return true;
		else
			return false;
	},

	fetch: []
});