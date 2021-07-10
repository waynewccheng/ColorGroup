
// color coordinates are from Lu'v'
var DiscColor = Class.create({
    initialize: function(id, color, u, v) {
      this.id = id;
      this.color = color;
      this.u = u;
      this.v = v;
      this.element = null;
    }
});

// used for the Graph
var Square = Class.create({
    initialize: function(id, color, x, y) {
      this.id = id;
      this.color = color;
      this.x = x;
      this.y = y;
    },
    
    paint: function(graph) {
      graph.setColor(this.color);
      graph.fillRect(this.x, this.y, 8, 8);
      if ((this.id == "P") || (this.id <= 8)) {
        graph.drawString(this.id, this.x + 8, this.y - 12);
      } else if (this.id == 9) {
        graph.drawString(this.id, this.x + 8, this.y + 8);      
      } else {
        graph.drawString(this.id, this.x - 10, this.y + 8);
      }
    },
    
    connect: function(graph, otherSquare) {
      graph.setColor("#999");
      graph.drawLine(otherSquare.x + 3, otherSquare.y + 3, this.x + 3, this.y + 3);    
    }
});

var CoordPoint = Class.create({
    initialize: function(u, v) {
      this.minXcoord = 0;
      this.maxXcoord = 150;
      this.minXvalue = -35;
      this.maxXvalue = 35;
      this.minYcoord = 0;
      this.maxYcoord = 150;
      this.minYvalue = -35;
      this.maxYvalue = 35;
      this.xFactor = (this.maxXcoord - this.minXcoord) / (this.maxXvalue - this.minXvalue);
      this.yFactor = (this.maxYcoord - this.minYcoord) / (this.maxYvalue - this.minYvalue);
      this.u = u;
      this.v = v;
      this.xCoord = (this.v - this.minXvalue) * this.xFactor + this.minXcoord;
      this.yCoord = (this.u - this.minYvalue) * this.yFactor + this.minYcoord
    }
});

// Has to be global, as it is used from the Ajax callback
var testId;

// colors in correct order
var color_pilot = new DiscColor(0, '#3781C1', -21.54, -38.39);
var discs = [
	new DiscColor(1, '#3583B4', -23.26, -25.56),
	new DiscColor(2, '#3B84A7', -22.41, -15.53),
	new DiscColor(3, '#39859C', -23.11, -7.45),
	new DiscColor(4, '#3B8690', -22.45, 1.1),
	new DiscColor(5, '#3F8782', -21.76, 7.35),
	new DiscColor(6, '#588473', -14.08, 18.74),
	new DiscColor(7, '#6C8164', -2.72, 28.13),
	new DiscColor(8, '#837B5D', 14.84, 31.13),
	new DiscColor(9, '#907660', 23.87, 26.35),
	new DiscColor(10, '#9E6E6F', 31.82, 14.76),
	new DiscColor(11, '#9F6D7C', 31.42, 6.99),
	new DiscColor(12, '#9C6D89', 29.79, 0.1),
	new DiscColor(13, '#927099', 26.64, -9.38),
	new DiscColor(14, '#8F6FA4', 22.92, -18.65),
	new DiscColor(15, '#8073B2', 11.2, -24.61)];


//======== wrong D50!!! long time running on site
/*
var color_pilot = new DiscColor(0, '#4B80A9', -21.54, -38.39);
var discs = [
    new DiscColor(1, '#49829D', -23.26, -25.56),
    new DiscColor(2, '#4D8391', -22.41, -15.53),
    new DiscColor(3, '#4C8487', -23.11, -7.45),
    new DiscColor(4, '#4D857D', -22.45, 1.1),
    new DiscColor(5, '#508570', -21.76, 7.35),
    new DiscColor(6, '#648362', -14.08, 18.74),
    new DiscColor(7, '#777F54', -2.72, 28.13),
    new DiscColor(8, '#8C794E', 14.84, 31.13),
    new DiscColor(9, '#987451', 23.87, 26.35),
    new DiscColor(10, '#A66D5F', 31.82, 14.76),
    new DiscColor(11, '#A76B6B', 31.42, 6.99),
    new DiscColor(12, '#A46B76', 29.79, 0.1),
    new DiscColor(13, '#9A6E84', 26.64, -9.38),
    new DiscColor(14, '#976E8F', 22.92, -18.65),
    new DiscColor(15, '#8A729B', 11.2, -24.61)];
*/
//======= unusable sRGB D50 colors !!!!
/*
var color_pilot = '#7E73B7';
var discs = [
    new DiscColor(1, '#3583B4'), 
    new DiscColor(2, '#3B84A6'), 
    new DiscColor(3, '#39859C'), 
    new DiscColor(4, '#3B8690'), 
    new DiscColor(5, '#3F8782'), 
    new DiscColor(6, '#598473'), 
    new DiscColor(7, '#6C8164'), 
    new DiscColor(8, '#837A5C'), 
    new DiscColor(9, '#907560'), 
    new DiscColor(10, '#9E6E6F'), 
    new DiscColor(11, '#9F6D7C'), 
    new DiscColor(12, '#9B6D89'), 
    new DiscColor(13, '#917099'), 
    new DiscColor(14, '#8E6FA4'), 
    new DiscColor(15, '#8073B2')];
*/

var spots = new Array(discs.length);


var Arrangement = Class.create({
    initialize: function() {
      var discCount = discs.length;
      
      // TESTING ONLY: Comment if no shuffling requested!
      discs.sort( randOrd );
      
      var xspace_spots = 30;
      var xspace_discs = 31;
	  
	  var pilot_left = 48;
	  var pilot_top = 80;

      $('spot_pilot').style.left = pilot_left - 2;
      $('spot_pilot').style.top = pilot_top - 2;
      $('disc_pilot').style.left = pilot_left;
      $('disc_pilot').style.top = pilot_top;
      $('disc_pilot').style.background = color_pilot.color;

      for (i = 1; i <= discCount; i++) {
        // set up spots
        $('spot' + i).style.left = (i)*xspace_spots + pilot_left - 2;
        $('spot' + i).style.top = pilot_top - 2;
        Droppables.add('spot' + i, { 
          accept: 'draggable',
          hoverclass: 'hover',
          onDrop: moveDiscIntoSpot
        });
        // set up discs
        var discEl = 'disc' + i;
        $(discEl).style.left = (i-1)*xspace_discs + pilot_left + 9;
        $(discEl).style.top = pilot_top + 55;
        $(discEl).style.background = discs[i - 1].color;
        discs[i - 1].element = $(discEl);
        new Draggable(discEl, { 
          revert: 'failure',
          starteffect: '',
          onStart: this.removeFromSpotList
        });
        
        // Testing: disable = false
        $('resultbutton').disabled = true;
        
        $('resultbutton').onclick = this.showResults.bindAsEventListener(this);
        $('detailedresultbutton').onclick = this.showDetailedResults.bindAsEventListener(this);
        // $('save_button').onclick = this.saveInfo.bindAsEventListener(this);
        
        this.resultButton_clicked = false;
        this.detailedResultButton_clicked = false;
        this.saveButton_clicked = false;
      }
    },

    removeFromSpotList: function(disc) {
      for (i = 0; i < spots.length; i++) {
        if (spots[i] && (spots[i].element.id == disc.element.id)) {
          delete spots[i];
        }
      }
      $('resultbutton').disabled = true;
    },
    
    showResults: function(e) {
        if (this.resultButton_clicked) return;
        this.resultButton_clicked = true;
        
        // TESTING ONLY: Comment out if not in testing mode!
        // for (i = 1; i <= spots.length; i++) {
        //   moveDiscIntoSpot(discs[i-1].element, $('spot' + i));
        // }

        Effect.Fade('droppable_container');
        Effect.Appear('graph_container', { queue: 'end' } );

        // The graph is plotten in a 90deg right turned Lu'v' diagram. This comes
        // closest to the original test result plot used.

        var graph = new jsGraphics($('canvas'));
        graph.setFont("arial", "10px", Font.NORMAL);

        // plot protan, deutan, tritan confusion lines
        graph.setStroke(1);
        graph.setColor("#aaa");
        var protanFirstPoint = new CoordPoint(35, 1.74);
        var protanSecondPoint = new CoordPoint(-35, -1.74);
        graph.drawLine(protanFirstPoint.xCoord, protanFirstPoint.yCoord, protanSecondPoint.xCoord, protanSecondPoint.yCoord);
        graph.drawString("protan", protanSecondPoint.xCoord - 30, protanSecondPoint.yCoord -3);
        var deutanFirstPoint = new CoordPoint(35, -7.77);
        var deutanSecondPoint = new CoordPoint(-35, 7.77);
        graph.drawLine(deutanFirstPoint.xCoord, deutanFirstPoint.yCoord, deutanSecondPoint.xCoord, deutanSecondPoint.yCoord);
        graph.drawString("deutan", deutanSecondPoint.xCoord, deutanSecondPoint.yCoord -3);
        var tritanFirstPoint = new CoordPoint(4.92, -35);
        var tritanSecondPoint = new CoordPoint(-4.92, 35);
        graph.drawLine(tritanFirstPoint.xCoord, tritanFirstPoint.yCoord, tritanSecondPoint.xCoord, tritanSecondPoint.yCoord);
        graph.drawString("tritan", tritanFirstPoint.xCoord - 7, tritanFirstPoint.yCoord - 13);

        graph.setColor('#666');        
        graph.setStroke(2);

        var squares = new Array();
        var pilot = new CoordPoint(color_pilot.u, color_pilot.v);
        squares.unshift(new Square("P", color_pilot.color, pilot.xCoord, pilot.yCoord));
        
        // plotting v on x-axis and v on y-axis!
        for (i = 0; i < spots.length; i++) {
          var nextSpot = new CoordPoint(spots[i].u, spots[i].v);
          squares.unshift(new Square(spots[i].id, spots[i].color, nextSpot.xCoord, nextSpot.yCoord));
          squares[0].connect(graph, squares[1]);
        }
        for (i = 0; i < squares.length; i++) {
          squares[i].paint(graph);
        }        
        
        graph.paint();
    },

    showDetailedResults: function(e) {
        if (this.detailedResultButton_clicked) return;
        this.detailedResultButton_clicked = true;

        spots.unshift(color_pilot);
        var moi = new MomentOfInertia(spots);
        $('angle').innerHTML = moi.majorAngle.toFixed(1);
        $('major_radius').innerHTML = moi.majorRadius.toFixed(1);
        $('minor_radius').innerHTML = moi.minorRadius.toFixed(1);
        $('tes').innerHTML = moi.tes.toFixed(1);
        $('s_index').innerHTML = moi.s_index.toFixed(2);
        $('c_index').innerHTML = moi.c_index.toFixed(2);

        Effect.Fade('graph_container', { queue: 'front' });
        Effect.Appear('result_container', { queue: 'end' });
        // if (moi.c_index.toFixed(2) > 1) {
        //   Effect.Appear('tag_email', { queue: 'end' });
        // }

        // CVD Type Criterions:
        // C-index: 1.6 (for cvd vs. normal)
        // Protan > +0.7 > Deutan > -65.0 > Tritan
        if (moi.c_index <= 1.6) {
          $('cvd_type').innerHTML = 'are <b>not colorblind</b>';
        } else if (moi.majorAngle >= +0.7) {
          $('cvd_type').innerHTML = 'have a <a href="https://color-blindness.com/2006/11/16/protanopia-red-green-color-blindness/" target="_top"><b>protan color vision defect</b></a>';
        } else if (moi.majorAngle < -65) {
          $('cvd_type').innerHTML = 'have a <a href="https://color-blindness.com/2006/05/08/tritanopia-blue-yellow-color-blindness/" target="_top"><b>tritan color vision defect</b></a>';
        } else {
          $('cvd_type').innerHTML = 'have a <a href="https://color-blindness.com/2007/04/17/deuteranopia-red-green-color-blindness/" target="_top"><b>deutan color vision defect</b></a>';
        }
        
        // Severity Criterions
        // C-index range: 1.6 - 4.2
        var max_width = 434;
        var adjusted_c = moi.c_index;
        if (adjusted_c < 1.6) adjusted_c = 1.6;
        if (adjusted_c > 4.2) adjusted_c = 4.2;
        $('severity_range').style.width = (adjusted_c - 1.6) * 434 / (4.2 - 1.6);
        
        this.saveResult();
    },
    
    saveResult: function() {
       var url = 'php/save_testresult.php';
       var pars = 'testtype=D-15&';
       pars += 'order=';
       for (i = 0; i < (spots.length-1); i++) {
        pars += spots[i].id + '-';
       }
       pars += spots[i].id;

       var myAjax = new Ajax.Request(url,
        {	method: 'get',
            parameters: pars,
            onSuccess: function(transport) {
              testId = transport.responseText;
            }
        });        
    },

    saveInfo: function(e) {
        if (this.saveButton_clicked) return;
        this.saveButton_clicked = true;

        Effect.Fade('tag_email');
        Effect.Appear('thank_you', { queue: 'end' } );
        
        var url = 'http://www.colblindor.com/disc_arrangement/php/save_email.php';
        var pars = 'testid='+testId+"&";
        pars += 'email='+escape($('email').value);
//        var myAjax = new Ajax.Request(url, {	method: 'get', parameters: pars });
    }
    
});

function moveDiscIntoSpot(disc, spot) {
    var id = spot.id.substr(4) - 1;
    if (rightSideFree(id)) {
      maybeMoveRight(id);
    } else {
      moveLeft(id);
    }
    spots[id] = discs[indexDiscList(disc)];
    new Effect.Move(disc, { x: spot.offsetLeft + 2, y: spot.offsetTop + 2, mode: 'absolute' });
    if (arrayIsFilled(spots)) { $('resultbutton').disabled = false; }
}

function arrayIsFilled(arr) {
    for (i = 0; i < arr.length; i++) {
      if (arr[i] == null) {
        return false;
      }
    }
    return true;
}

function indexDiscList(disc) {
    for (i = 0; i < discs.length; i++) {
      if (discs[i].element == disc) { return i; }
    }
    return null; 
}

function rightSideFree(id) {
    for (i = id; i < spots.length; i++) {
      if (spots[i] == null) { return true; }
    }
    return false;
}

function maybeMoveRight(id) {
    if (spots[id] == null) { return; } 
    maybeMoveRight(id + 1);
    new Effect.Move(spots[id].element, { x: $('spot' + (id+2)).offsetLeft + 2, y: $('spot' + (id+2)).offsetTop + 2, mode: 'absolute' }); 
    spots[id + 1] = spots[id];
}

function moveLeft(id) {
    if (spots[id] == null) { return; } 
    moveLeft(id - 1);
    new Effect.Move(spots[id].element, { x: $('spot' + (id)).offsetLeft + 2, y: $('spot' + (id)).offsetTop + 2, mode: 'absolute' }); 
    spots[id - 1] = spots[id];
}

function randOrd() {
  return (Math.round(Math.random()) - 0.5);
} 

