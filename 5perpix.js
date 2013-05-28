/**
 * Meteor Collection Pixels, clients subscribe to pixels on picture (p)
 * @type {Meteor.Collection}
 */
MrtPixelCollection = new Meteor.Collection('mrtpixelcollection');


MrtPixelHistoryCollection = new Meteor.Collection('mrtpixelhistorycollection');


/**
 * Meteor Collection Pictures, fully available on clients
 * @type {Meteor.Collection}
 */
MrtPictureCollection = new Meteor.Collection('mrtpicturecollection');

/**
 * Holds all messages, these are linked to pictures
 * @type {Meteor.Collection}
 */
MrtMessageCollection = new Meteor.Collection('mrtmessagecollection');

/**
 * Helper function to return a randomly generated color channel as int
 * @return {int} Random int between 0 and 256
 */
function getRandomColorChannel() {
  return Math.floor(Math.random()*256);
}

/**
 * Helper function to return a color as EJSON binary Uint8Array containing rgb channels
 * @return {Uint8Array} binary array containing uint8s
 */
function getRandomEJSONColor() {
  var color = EJSON.newBinary(3);
        color[0] = getRandomColorChannel();
        color[1] = getRandomColorChannel();
        color[2] = getRandomColorChannel();
  return color;
}

/**
 * Helper function to parse a color as EJSON binaray Uint8Array containing rgb-channels. rgb is automatically appended for use in fillstyle, fill, ...
 * @param  {Uint8Array} colorEJSON, a color in EJSON binary Uint8Array format
 * @return {string} a string of rgb-colors for use in fill, fillstyle, ...
 */
function getStringEJSONColor(colorEJSON) {
  return "rgb(" 
    + colorEJSON[0] + "," 
    + colorEJSON[1] + "," 
    + colorEJSON[2] + ")";
}

/**
 * CLIENTS ONLY
 */
if (Meteor.isClient) {

  /**
  * subscribe behaviour on the client (needed when package autopublish was removed from meteor!)
  *
  * sum-up:
  * @pictures: subscribe to the published pictures from the server.
  * @pixels: subscribe ONLY to the pixels of a selected picture.
  */
 
  Meteor.subscribe("mrtpicturecollection");
  Meteor.subscribe("mrtpixelcollection", {p: Session.get("selected_picture")});

  // Called on client-startup: If no picture selected, select one.
  Meteor.startup(function () {
    Deps.autorun(function () {
      if (! Session.get("selected_picture")) {
        var picture = MrtPictureCollection.findOne();
        if (picture)
          Session.set("selected_picture", picture._id);
      }
    });
  });

  /**
   * Template pictures filler for all pictures (for each within template)
   * @return {Meteor.Collection.Cursor} all pictures within the meteor collection
   */
  Template.pictureOverviewDisplay.pictures = function () {
    return MrtPictureCollection.find({});
  };

  /**
   * Template picture filler for div class picture. selected is appended to the picture class while this picture is selected...
   * @return {string} emptystring or 'selected'
   */
  Template.picture.selected = function () {
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

  /**
   * Template pictureVisualization filler for selected_picture. Gets Session and updates selected_picture in template
   * @return {string} The name of the selected picture
   */
  Template.pictureVisualization.selected_picture = function () {
    var pic = MrtPictureCollection.findOne(Session.get("selected_picture"));
    return pic && pic.name;
  };

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

          console.log("Template.pictureVisualizationItemSVG.rendered: Deps.autorun: updateRaw")

          rect.attr("x", function(d) { return (d.x) * MrtPictureCollection.findOne(d.picID).itemwidth; })
            .attr("y", function(d) { return (d.y) * MrtPictureCollection.findOne(d.picID).itemheight; })
            .attr("width", function(d) { return MrtPictureCollection.findOne(d.picID).itemwidth; })
            .attr("height", function(d) { return MrtPictureCollection.findOne(d.picID).itemheight; })
            // .attr("rx", 6)
            // .attr("ry", 6)
            .style("fill", function(d) { return getStringEJSONColor(d.color); })
            // .style("stroke", '#555')
            .on('click', function(e) { // on click
                console.log("click: _id=" + e._id);
                MrtPixelCollection.update(e._id, {$set: {color: getRandomEJSONColor() }});
             })
            .on('mouseover', function(e) { // on mouseover
                console.log("mouseover: _id=" + e._id);
                MrtPixelCollection.update(e._id, {$set: {color: getRandomEJSONColor() }});
             })
             .on('mouseout', function() { // on mouseout
                d3.select(this)
                    .style("fill", function(d) { return getStringEJSONColor(d.color); });
             });
        };

        // bind my pixel data to the g class .pixels 
        var minpix = d3.select(self.node).select(".pictureVisualizationItemSVGPixels").selectAll("rect")
          .data(MrtPixelCollection.find({picID: Session.get("selected_picture")}).fetch(), 
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
}


/**
 * SERVER ONLY
 */
if (Meteor.isServer) {

  /**
  * Publish behaviour and CRUD on server
  * package autopublish was removed from meteor: we need to define our own publish and subscribe behaviour!
  * package insecure was removed from meteor: we need to define the allowed actions on the data (pictures and pixels)
  *
  * sum-up:
  * @pictures: always publish all pictures to all users. 
  * @pixels: always publish all pixels of all pictures! (client will only subscribe to the pixels it currently needs!).
  *
  * CRUD-restrictions (create, read, update, delete):
  * @pictures: we don't define insert / change or removed functions for subscribed pictures as we don't want to allow manipulation on the clientside!
  * @pixels: we define changed functions for pixels, as we want all users to manipulate them...
  */

  Meteor.publish("mrtpicturecollection", function () {
    return MrtPictureCollection.find();
  });

  Meteor.publish("mrtpixelcollection", function () {
    return MrtPixelCollection.find(); 
  });

  MrtPixelCollection.allow({
    update: function (userId, doc, fields, modifier) {

      // old value will be remembered in mrtPixelHistoryCollection...
      // TODO: IMPLEMENT PIXEL HISTORY...

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


  /**
   * Called on server-startup to fill some example pictures and pixels to our Collections if nothing exists
   */
  Meteor.startup(function() {
    if(MrtPictureCollection.find().count() < 1) {
      console.log("Meteor.startup: removing old documents from collections...");
      resetAllMrtCollections();
    }
  });

  resetAllMrtCollections = function() {
    MrtPixelHistoryCollection.remove({}, function() {
      MrtPixelCollection.remove({}, function() {
        MrtMessageCollection.remove({}, function() {
          MrtPictureCollection.remove({}, function() {
            console.log("Meteor.startup: pictures resetted, adding new...");
            addTestPictureWithPixels("SmallPicture-FewPixels", 200, 200, 5, 5);
            addTestPictureWithPixels("MediumPicture-FewPixels", 350, 350, 5, 5);
            addTestPictureWithPixels("BigPicture-FewPixels", 500, 500, 5, 5);

            addTestPictureWithPixels("SmallPicture-MediumPixels", 200, 200, 12, 12);
            addTestPictureWithPixels("MediumPicture-MediumPixels", 350, 350, 12, 12);
            addTestPictureWithPixels("BigPicture-MediumPixels", 500, 500, 12, 12);

            addTestPictureWithPixels("SmallPicture-ManyPixels", 200, 200, 20, 20);
            addTestPictureWithPixels("MediumPicture-ManyPixels", 350, 350, 20, 20);
            addTestPictureWithPixels("BigPicture-ManyPixels", 500, 500, 20, 20);
          })
        })
      })
    });
  };
  


  addPixelHistoryFromPixel = function(pixID) {

    // TODO MAKE UPDATING AND INSERTING PIXELS A SERVER SIDE FUNCTION AND DENY
    // EVERYTHING FROM OUTSIDE!!! - also hide not needed things from outside
    // e.g picID within pixels - make a specialized sort that returns the needed part!!!!
    // 


  };

  insertPixelHistory = function(pixID, color) {
    var currentHistoryIndex = MrtPixelHistoryCollection.find({pixID: pixID}).count();
    MrtPixelHistoryCollection.insert({
      pixID: pixID,
      color: color
    });
  }

  /**
   * addTestPictureWithPixels defines a function to add a picture with the overgiven parameters to the collection. 
   * It also executes addPixels with the reference to the new generated picture
   * @param  {string} name        name of the picture
   * @param  {number} gridWidth   width of the picture
   * @param  {number} gridHeight  height of the picture
   * @param  {int} rows           number of pixel rows
   * @param  {int} cols           number of pixel colums
   */
  addTestPictureWithPixels = function(name, gridWidth, gridHeight, rows, cols) {
    var gridItemWidth = gridWidth / rows;
    var gridItemHeight = (true) ? gridItemWidth : gridHeight / cols;

    var picID = MrtPictureCollection.insert({
      width: gridWidth, 
      height: gridHeight, 
      itemwidth: gridItemWidth, 
      itemheight: gridItemHeight, 
      rows: rows, 
      cols: cols, 
      name: name
    });

    console.log("addTestPictureWithPixels: added picture: name=" + name + " id=" + picID + " width=" + gridWidth + " height=" + gridHeight);

    addPixels(rows, cols, picID);
  };

  /**
   * addPixels defines a function to fill an example grid with data --> MrtPixelCollection
   * @param  {int} rows               count of rows to generate --> x
   * @param  {int} cols               count of cols to generate --> y
   * @param  {string | objectID} pID  reference to picture --> picID
   */
  addPixels = function(rows, cols, picID) {
    //var count = 0;

    for (var index_y = 0; index_y < rows; index_y++) {
      for (var index_x = 0; index_x < cols; index_x++) {
        
        MrtPixelCollection.insert({
          x: index_x, 
          y: index_y, 
          color: getRandomEJSONColor(),
          picID: picID,
          userID: "SERVER"
        });
        //count++;
      }
    }
    console.log("addPixels: added pixels for pID=" + picID + " rows=" + rows + " cols=" + cols);
  };
}