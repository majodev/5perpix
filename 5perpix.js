/**
 * Meteor Collection, available on both Client and Server that's holds the raw pixels of a picture
 * @type {Meteor.Collection}
 */
Minpixels = new Meteor.Collection('minpixels');

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

/**
 * CLIENTS ONLY
 */
if (Meteor.isClient) {

  /**
   * Template rawpix rendered function. Called when rawpix was successfully rendered the first time
   * Defines algorithms to be executed by Deps.autorun on Template Change / Datachange.
   */
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

          rect.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .attr("index_x", function(d) { return d.index_x; })
            .attr("index_y", function(d) { return d.index_y; })
            .attr("name", function(d) { return d.name; })
            .attr("meteor_id", function(d) { return d._id; })
            .style("fill", function(d) { return d.fill; })
            .style("stroke", '#555')
            .on('click', function(e) { // on click
                console.log("click: _id=" + e._id);
                Minpixels.update(e._id, {$set: {fill: getRandomStyleColor() }});
             })
            .on('mouseover', function(e) { // on mouseover
                console.log("mouseover: _id=" + e._id);
                Minpixels.update(e._id, {$set: {fill: getRandomStyleColor() }});
             })
             .on('mouseout', function() { // on mouseout
                d3.select(this)
                    .style("fill", function(d) { return d.fill; });
             });
        };

        // bind my pixel data to the g class .pixels 
        var minpix = d3.select(self.node).select(".pixs").selectAll("rect")
          .data(Minpixels.find().fetch(), function (minpix) {return minpix._id; });


        // data update only triggers fill to refresh
        updateRaw(minpix.enter().append("svg:rect"));
        d3.select(self.node).select(".pixs").selectAll("rect")
          .data(Minpixels.find().fetch(), function (minpix) {return minpix._id; }).style("fill", function(d) { return d.fill; })

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
      if(Minpixels.find().count() == 0) {
        console.log("Meteor.startup: Adding Minpixels...");
        addPixels(500, 500, true, 10, 10);
      }
    // }
  });

  /**
   * addPixels defines a function to fill an example grid with data --> Minpixels
   * @param  {[type]} gridWidth  width of the visual grid
   * @param  {[type]} gridHeight height of the visual grid
   * @param  {[type]} square     true if pixels should be square
   * @param  {[type]} rows       count of rows to generate --> resolution x
   * @param  {[type]} cols       count of cols to generate --> resolution y
   */
  addPixels = function(gridWidth, gridHeight, square, rows, cols) {

    var countRows = rows;
    var countCols = cols;

    console.log("addPixels: gridWidth=" + gridWidth + " gridHeight=" + gridHeight + " square=" + square + " rows=" + rows + " cols=" + cols);

    var gridItemWidth = gridWidth / countRows;
    var gridItemHeight = (square) ? gridItemWidth : gridHeight / countCols;
    var startX = gridItemWidth / 2;
    var startY = gridItemHeight / 2;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY;
    var count = 0;

    for (var index_y = 0; index_y < countRows; index_y++) {
      for (var index_x = 0; index_x < countCols; index_x++) {
        var name = "x" + index_x + "y" + index_y
        Minpixels.insert({name: name, grid_x: index_x, grid_y: index_y, x: xpos, y: ypos, fill: getRandomStyleColor(), width: gridItemWidth, height: gridItemHeight});

        xpos += stepX;
        count += 1;
      }

      xpos = startX;
      ypos += stepY;
    }
  };
}