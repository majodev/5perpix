// Pixels = new Meteor.Collection('pixels');
// Pictures = new Meteor.Collection('pictures');
// Rows = new Meteor.Collection('rows');

Minpixels = new Meteor.Collection('minpixels');

// Class Pixel
// var Pixel = (function () {
//   function Pixel(color_r, color_g, color_b) {
//       this.r = color_r;
//       this.g = color_g;
//       this.b = color_b;
//   }
//   return Pixel;
// })();

// Class ColorPalette
// var ColorPalette = (function () {
//   function ColorPalette(palette) {
//   }
//   return ColorPalette;
// })();

// function randomData() {
//   var data = new Array();
//   var newValue = 0;
//   var count = 0;

//   for (var index_a = 0; index_a < 40; index_a++) {
//     data[index_a] = new Array();
//       for (var index_b = 0; index_b < 40; index_b++) {
        
//         data[index_a].push({
//           pixel: new Pixel(
//             Math.floor(Math.random()*256), 
//             Math.floor(Math.random()*256),
//             Math.floor(Math.random()*256))});

//         count += 1;
//       }
//   }
//   return data;
// }
// 

function getRandomStyleColor() {
  return "rgb("+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+")";
}

function randomData(gridWidth, gridHeight, square)
{
  var countRows = 25;
  var countCols = 25;

    var data = new Array();
    var gridItemWidth = gridWidth / countRows;
    var gridItemHeight = (square) ? gridItemWidth : gridHeight / countCols;
    var startX = gridItemWidth / 2;
    var startY = gridItemHeight / 2;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY;
    var count = 0;

    for (var index_a = 0; index_a < countRows; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < countCols; index_b++)
        {
          var style = getRandomStyleColor();

            //newValue = Math.round(Math.random() * (100 - 1) + 1);
            data[index_a].push({ 
                                fill: style,
                                time: index_b, 
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                index_x: index_a,
                                index_y: index_b,
                                count: count
                            });
            xpos += stepX;
            count += 1;
        }
        xpos = startX;
        ypos += stepY;
    }
    return data;
}

// function randomCols() {
//   var cols = new Array();

//   for (var index_a = 0; index_a < 40; index_a++) {
//     cols.push({
//       pixel: new Pixel(
//         Math.floor(Math.random()*256), 
//         Math.floor(Math.random()*256),
//         Math.floor(Math.random()*256))});
//   }

//   return cols;
// }

// addData = function addData() {
//   Pictures.insert({data: randomData(500, 500, true)});
//   return "added one picture!";
// }

// addRowData = function addRowData() {
//   Rows.insert({cols: randomCols()});
// }

if (Meteor.isClient) {




  // RAW TEST
  Template.rawpix.rendered = function () {
    console.log("Template.rawpix.rendered");
    var self = this;
    self.node = self.find("svg");

    if(! self.handle) {
      self.handle = Deps.autorun(function (){
        console.log("Template.rawpix.rendered: Deps.autorun");

        var updateRaw = function (rect) {
          console.log("Template.rawpix.rendered: Deps.autorun: updateRaw")

          //console.log(rect);
          //console.log("Template.rawpix.rendered: updateRaw - self.node: " + self.node);
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
            .on('click', function(e) {
                console.log(e._id);

                //Session.set('pix_id', e._id);
                var newFill = getRandomStyleColor();
                Minpixels.update(e._id, {$set: {fill: newFill }});
             })
            .on('mouseover', function(e) {
                // d3.select(this)
                //     .style('fill', '#FFF');
                //Minpixels.remove(e._id);
                
                //Session.set('pix_id', e._id);
                var newFill = getRandomStyleColor();
                Minpixels.update(e._id, {$set: {fill: newFill }});
                //Minpixels.update(Session.get('pix_id'), {$set: {fill: "rgb(256,256,256)" }});
             })
             .on('mouseout', function() {
                d3.select(this)
                    .style("fill", function(d) { return d.fill; });
             });
        };

        // bind my pixel data to the g class .pixels 
        var minpix = d3.select(self.node).select(".pixs").selectAll("rect")
          .data(Minpixels.find().fetch(), function (minpix) {return minpix._id; });

        //minpix.attr("class", "update");
        updateRaw(minpix.enter().append("svg:rect"));
        //minpix.data(function(d) {return d; });
        //
        d3.select(self.node).select(".pixs").selectAll("rect")
          .data(Minpixels.find().fetch(), function (minpix) {return minpix._id; }).style("fill", function(d) { return d.fill; })
        


        minpix.exit().remove();

        //d3.select(self.node).select(".pixs").selectAll("rect").data([Minpixels.find().fetch()])
        //updateRaw(minpix.transition().duration(250).ease("cubic-out"));
        //minpix.exit().transition().duration(250).attr("r", 0).remove();
        //
        
      });
    }
  };

  Template.rawpix.destroyed = function () {
    this.handle && this.handle.stop();
  };


  // NEW GRID TEST
  // Template.grid.rendered = function () {
  //   console.log("Template.grid.rendered");

  //   var self = this;
  //   self.node = self.find("svg");

  //   if(! self.handle) {
  //     self.handle = Deps.autorun(function (){
  //       console.log("Template.grid.rendered: Deps.autorun");

  //       var pic = Pictures.findOne();
        
  //       if(pic) {

  //         // bind my rows data to the g's 
  //         var grid = d3.select(self.node).attr("class", "chart");

  //         var row = grid.selectAll(".row")
  //         .data(pic.data)
  //         .enter().append("svg:g")
  //         .attr("class", "row");

  //         var col = row.selectAll(".cell")
  //           .data(function (d) { return d; })
  //           .enter().append("svg:rect")
  //           .attr("class", "cell")
  //           .attr("x", function(d) { return d.x; })
  //           .attr("y", function(d) { return d.y; })
  //           .attr("width", function(d) { return d.width; })
  //           .attr("height", function(d) { return d.height; })
  //           .attr("index_x", function(d) { return d.index_x; })
  //           .attr("index_y", function(d) { return d.index_y; })
  //           .on('mouseover', function() {
  //               d3.select(this)
  //                   .style('fill', '#FFF');
  //            })
  //            .on('mouseout', function() {
  //               d3.select(this)
  //                   .style("fill", function(d) { return d.fill; });
  //            })
  //            .on('click', function() {
  //               //console.log("Click!");
  //               console.log("Click rect index: x=" + d3.select(this).attr("index_x") + " y=" + d3.select(this).attr("index_y"));
  //               //console.log(d3.event);
                
  //               // Find the pixel and change its color
  //               // 
                
  //               var gotX = d3.select(this).attr("index_x");
  //               var gotY = d3.select(this).attr("index_y");

  //               //var fixedPicture = Pictures.findOne(); // TODO CHANGE THIS!
  //               //fixedPicture.data[gotX][gotY].fill = getRandomStyleColor;

  //               //Pictures.update(Pictures.findOne(), {beersAndStouts.$.gotX.$.: getRandomStyleColor()});

  //            })
  //            .style("fill", function(d) { return d.fill; })
  //            .style("stroke", '#555');
  //       }

        

  //     });

  //   }
  // };









  // // OLD PICS TEST ADD...
  // Template.picture.rendered = function () {
  //   console.log("Template.picture.rendered");

  //   var self = this;
  //   self.node = self.find("svg");

  //   if (! self.handle) {
      
  //     self.handle = Deps.autorun(function () {
  //       console.log("Template.picture.rendered: Deps.autorun");

  //       var updatePixels = function (group) {
  //         console.log("Template.picture.rendered: updatePixels - self.node: " + self.node);

  //         group.attr("cx", function (pixel) { return pixel.x; })
  //           .attr("cy", function (pixel) { return pixel.y; })
  //           .attr("r", 15)
  //           .attr("datax", function (pixel) { return pixel.y; })
  //           .style("stroke", "gray")
  //           .style("fill", "black");
  //       };

  //       // bind my pixel data to the g class .pixels 
  //       var pixels = d3.select(self.node).select(".pixels").selectAll("circle")
  //         .data(Pixels.find().fetch(), function (pixel) {return pixel._id; });

  //       updatePixels(pixels.enter().append("circle"));

  //     });

  //   }
  // };  



}
if (Meteor.isServer) {
  Meteor.startup(function() {
    // if(Pixels.find().count() === 0) {
      console.log("Meteor.startup");
      // pdata = [10,12,6,8,15];
      // Pixels.insert({x: 200, y: 144, pdata: pdata});
      // addData();
      // for (var rowcount = 0; rowcount < 40; rowcount++) {
      //   addRowData();
      // }
      // 
      if(Minpixels.find().count() == 0) {
        console.log("Meteor.startup: Adding Minpixels...");
        addPixels(500, 500, true, 10, 10);
      }
    // }
  });
  



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