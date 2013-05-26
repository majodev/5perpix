/**
 * Meteor Collection, available on both Client and Server that's holds the raw pixels of a picture
 * @type {Meteor.Collection}
 */
Minpixels = new Meteor.Collection('minpixels');

Minpictures = new Meteor.Collection('minpictures');

/**
 * Helper function to return a randomly generated fillstyle as a string.
 * @return {String} fill(style)-string thats randomly generated.
 */
function getRandomStyleColor() {
  return "rgb("+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+")";
}

function getRandomColorChannel() {
  return Math.floor(Math.random()*256);
}

function getRandomEJSONColor() {
  var color = EJSON.newBinary(3);
        color[0] = getRandomColorChannel();
        color[1] = getRandomColorChannel();
        color[2] = getRandomColorChannel();
  return color;
}

function getStringEJSONColor(colorEJSON) {
  return "rgb(" 
    + colorEJSON[0] + "," 
    + colorEJSON[1] + "," 
    + colorEJSON[2] + ")";
}

function getStringColorChannels(r, g, b) {
  return "rgb(" 
    + r + "," 
    + g + "," 
    + b + ")";
}

/**
 * CLIENTS ONLY
 */
if (Meteor.isClient) {

  // HACK - TODO CHANGE: Set the Session Var to the first picid for now...
  var hackPic = Minpictures.findOne();

  /**
   * Template rawpix rendered function. Called when rawpix was successfully rendered the first time
   * Defines algorithms to be executed by Deps.autorun on Template Change / Datachange.
   */
  

  Template.overview.pictures = function () {
    return Minpictures.find({});
  };

  Template.picture.events({
    'click': function () {
      Session.set("selected_picture", this._id);
    }
  });

  Template.rawholder.selected_picture = function () {
    var pic = Minpictures.findOne(Session.get("selected_picture"));
    return pic && pic.name;
  };

  Template.rawpix.rendered = function () {
    console.log("Template.rawpix.rendered");
    var self = this;
    self.node = self.find("svg");

    if(! self.handle) {
      /**
       * Defines the Deps.autorun for the rawpix template
       */
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
            .attr("rx", 6)
            .attr("ry", 6)
            // .style("fill", function(d) { return d.fill; })
            .style("fill", function(d) { return getStringColorChannels(d.r, d.g, d.b); })
            .style("stroke", '#555')
            .on('click', function(e) { // on click
                console.log("click: _id=" + e._id);
                Minpixels.update(e._id, {$set: {r: getRandomColorChannel() }});
             })
            .on('mouseover', function(e) { // on mouseover
                console.log("mouseover: _id=" + e._id);
                Minpixels.update(e._id, {$set: {r: getRandomColorChannel() }});
             })
             .on('mouseout', function() { // on mouseout
                d3.select(this)
                    .style("fill", function(d) { return getStringColorChannels(d.r, d.g, d.b); });
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
          .style("fill", function(d) { return getStringColorChannels(d.r, d.g, d.b); })

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
   * Called on startup to fill some example data in our Collections if nothing is here
   */
  Meteor.startup(function() {
      console.log("Meteor.startup");
      if(Minpictures.find().count() === 0) {
        console.log("Meteor.startup: no pictures found, adding...");
        addPictureWithPixels("Big-ManyPixels", 500, 500, 20, 20);
        addPictureWithPixels("Big-MediumPixels", 500, 500, 12, 12);
        addPictureWithPixels("Big-FewPixels", 500, 500, 5, 5);
        addPictureWithPixels("Medium-ManyPixels", 350, 350, 20, 20);
        addPictureWithPixels("Medium-MediumPixels", 350, 350, 12, 12);
        addPictureWithPixels("Medium-FewPixels", 350, 350, 5, 5);
        addPictureWithPixels("Small-ManyPixels", 200, 200, 20, 20);
        addPictureWithPixels("Small-MediumPixels", 200, 200, 12, 12);
        addPictureWithPixels("Small-FewPixels", 200, 200, 5, 5);
      }
  });

  addPictureWithPixels = function(name, gridWidth, gridHeight, rows, cols) {
    var gridItemWidth = gridWidth / rows;
    var gridItemHeight = (true) ? gridItemWidth : gridHeight / cols;

    console.log("addPictureWithPixels: Adding Minpicture...");
    var picID = Minpictures.insert({width: gridWidth, height: gridHeight, 
      itemwidth: gridItemWidth, itemheight: gridItemHeight, 
      rows: rows, cols: cols, 
      name: name});

    addPixels(rows, cols, picID);
  };

  /**
   * addPixels defines a function to fill an example grid with data --> Minpixels
   * @param  {[type]} rows       count of rows to generate --> x
   * @param  {[type]} cols       count of cols to generate --> y
   * @param  {[type]} pID        reference to picture --> p
   */
  addPixels = function(rows, cols, pID) {
    console.log("addPixels: pID=" + pID + " rows=" + rows + " cols=" + cols);
    for (var index_y = 0; index_y < rows; index_y++) {
      for (var index_x = 0; index_x < cols; index_x++) {
        

        Minpixels.insert({x: index_x, y: index_y, 
          r: getRandomColorChannel(),
          g: getRandomColorChannel(),
          b: getRandomColorChannel(),
          p: pID});
      }
    }
  };
}