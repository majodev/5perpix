/**
 * Meteor Collection Pixels, clients subscribe to pixels on picture (p)
 * @type {Meteor.Collection}
 */
Minpixels = new Meteor.Collection('minpixels');

/**
 * Meteor Collection Pictures, fully available on clients
 * @type {Meteor.Collection}
 */
Minpictures = new Meteor.Collection('minpictures');

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
 
  Meteor.subscribe("minpictures");
  Meteor.subscribe("minpixels", {p: Session.get("selected_picture")});

  // Called on client-startup: If no picture selected, select one.
  Meteor.startup(function () {
    Deps.autorun(function () {
      if (! Session.get("selected_picture")) {
        var picture = Minpictures.findOne();
        if (picture)
          Session.set("selected_picture", picture._id);
      }
    });
  });

  /**
   * Template pictures filler for all pictures (for each within template)
   * @return {Meteor.Collection.Cursor} all pictures within the meteor collection
   */
  Template.overview.pictures = function () {
    return Minpictures.find({});
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
   * Template rawholder filler for selected_picture. Gets Session and updates selected_picture in template
   * @return {string} The name of the selected picture
   */
  Template.rawholder.selected_picture = function () {
    var pic = Minpictures.findOne(Session.get("selected_picture"));
    return pic && pic.name;
  };

  /**
   * Template rawpix rendered function. Called when rawpix was successfully rendered the first time
   * Defines algorithms to be executed by Deps.autorun on Template Change / Datachange.
   */
  Template.rawpix.rendered = function () {
    console.log("Template.rawpix.rendered");
    var self = this;
    self.node = self.find("svg");

    if(! self.handle) {
      
      // define a Dep.autorun for the Template, which automatically runs when changes happen
      self.handle = Deps.autorun(function (){
        console.log("Template.rawpix.rendered: Deps.autorun");

        /**
         * Init / Update on change
         * @param  {svg:rect} Needs d3.js rects as parameter.
         */
        var updateRaw = function (rect) {

          console.log("Template.rawpix.rendered: Deps.autorun: updateRaw")

          rect.attr("x", function(d) { return (d.x) * Minpictures.findOne(d.p).itemwidth; })
            .attr("y", function(d) { return (d.y) * Minpictures.findOne(d.p).itemheight; })
            .attr("width", function(d) { return Minpictures.findOne(d.p).itemwidth; })
            .attr("height", function(d) { return Minpictures.findOne(d.p).itemheight; })
            // .attr("rx", 6)
            // .attr("ry", 6)
            .style("fill", function(d) { return getStringEJSONColor(d.c); })
            // .style("stroke", '#555')
            .on('click', function(e) { // on click
                console.log("click: _id=" + e._id);
                Minpixels.update(e._id, {$set: {c: getRandomEJSONColor() }});
             })
            .on('mouseover', function(e) { // on mouseover
                console.log("mouseover: _id=" + e._id);
                Minpixels.update(e._id, {$set: {c: getRandomEJSONColor() }});
             })
             .on('mouseout', function() { // on mouseout
                d3.select(this)
                    .style("fill", function(d) { return getStringEJSONColor(d.c); });
             });
        };

        // bind my pixel data to the g class .pixels 
        var minpix = d3.select(self.node).select(".pixs").selectAll("rect")
          .data(Minpixels.find({p: Session.get("selected_picture")}).fetch(), 
            function (minpix) {return minpix._id; });


        // data update only triggers fill to refresh
        updateRaw(minpix.enter().append("svg:rect"));
        d3.select(self.node).select(".pixs").selectAll("rect")
          .data(Minpixels.find({p: Session.get("selected_picture")}).fetch(), 
            function (minpix) {return minpix._id; })
          .style("fill", function(d) { return getStringEJSONColor(d.c); })

        // kill pixel on remove from data source
        minpix.exit().remove();

      });
    }
  };

  /**
   * Template rawpix destroyed function: Kills Deps.autorun handle when the Template is no longer needed.
   */
  Template.rawpix.destroyed = function () {
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

  Meteor.publish("minpictures", function () {
    return Minpictures.find();
  });

  Meteor.publish("minpixels", function () {
    return Minpixels.find(); 
  });

  Minpixels.allow({
    update: function (userId, doc, fields, modifier) {
      // changes to color allowed!
      return _.contains(fields, 'c');
    }
  });

  Minpixels.deny({
    update: function (userId, doc, fields, modifier) {
      // changes to x, y and pID denied!
      return _.contains(fields, 'x') || 
        _.contains(fields, 'y') || 
        _.contains(fields, 'p');
    }
  });


  /**
   * Called on server-startup to fill some example pictures and pixels to our Collections if nothing exists
   */
  Meteor.startup(function() {
      console.log("Meteor.startup");
      if(Minpictures.find().count() === 0) {
        console.log("Meteor.startup: no pictures found, adding...");

        addPictureWithPixels("SmallPicture-FewPixels", 200, 200, 5, 5);
        addPictureWithPixels("MediumPicture-FewPixels", 350, 350, 5, 5);
        addPictureWithPixels("BigPicture-FewPixels", 500, 500, 5, 5);

        addPictureWithPixels("SmallPicture-MediumPixels", 200, 200, 12, 12);
        addPictureWithPixels("MediumPicture-MediumPixels", 350, 350, 12, 12);
        addPictureWithPixels("BigPicture-MediumPixels", 500, 500, 12, 12);

        addPictureWithPixels("SmallPicture-ManyPixels", 200, 200, 20, 20);
        addPictureWithPixels("MediumPicture-ManyPixels", 350, 350, 20, 20);
        addPictureWithPixels("BigPicture-ManyPixels", 500, 500, 20, 20);
      }
  });

  /**
   * addPictureWithPixels defines a function to add a picture with the overgiven parameters to the collection. 
   * It also executes addPixels with the reference to the new generated picture
   * @param  {string} name        name of the picture
   * @param  {number} gridWidth   width of the picture
   * @param  {number} gridHeight  height of the picture
   * @param  {int} rows           number of pixel rows
   * @param  {int} cols           number of pixel colums
   */
  addPictureWithPixels = function(name, gridWidth, gridHeight, rows, cols) {
    var gridItemWidth = gridWidth / rows;
    var gridItemHeight = (true) ? gridItemWidth : gridHeight / cols;

    var picID = Minpictures.insert({width: gridWidth, height: gridHeight, 
      itemwidth: gridItemWidth, itemheight: gridItemHeight, 
      rows: rows, cols: cols, 
      name: name});

    console.log("addPictureWithPixels: added picture: name=" + name + " id=" + picID + " width=" + gridWidth + " height=" + gridHeight);

    addPixels(rows, cols, picID);
  };

  /**
   * addPixels defines a function to fill an example grid with data --> Minpixels
   * @param  {int} rows               count of rows to generate --> x
   * @param  {int} cols               count of cols to generate --> y
   * @param  {string | objectID} pID  reference to picture --> p
   */
  addPixels = function(rows, cols, pID) {
    for (var index_y = 0; index_y < rows; index_y++) {
      for (var index_x = 0; index_x < cols; index_x++) {
        
        Minpixels.insert({x: index_x, y: index_y, 
          c: getRandomEJSONColor(),
          p: pID});
      }
    }
    console.log("addPixels: added pixels for pID=" + pID + " rows=" + rows + " cols=" + cols);
  };
}