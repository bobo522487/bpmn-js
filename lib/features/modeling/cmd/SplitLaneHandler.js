'use strict';

var getChildLanes = require('../util/LaneUtil').getChildLanes;


/**
 * A handler that splits a lane into a number of sub-lanes,
 * creating new sub lanes, if neccessary.
 *
 * @param {Modeling} modeling
 */
function SplitLaneHandler(modeling) {
  this._modeling = modeling;
}

SplitLaneHandler.$inject = [ 'modeling' ];

module.exports = SplitLaneHandler;


SplitLaneHandler.prototype.preExecute = function(context) {

  var modeling = this._modeling;

  var shape = context.shape,
      count = context.count;

  var childLanes = getChildLanes(shape);

  if (childLanes.count > count) {
    throw new Error('more than ' + count + ' child lanes');
  }

  var existingLanesCount = childLanes.length;

  var newLanesHeight = Math.round(shape.height / count);

  // Iterate from top to bottom in child lane order,
  // resizing existing lanes and creating new ones
  // so that they split the parent proportionally.
  //
  // Due to rounding related errors, the last lane
  // needs to take up all the remaining space.
  var laneY,
      laneHeight,
      laneBounds,
      newLaneAttrs,
      idx;

  for (idx = 0; idx < count; idx++) {

    laneY = shape.y + idx * newLanesHeight;

    if (idx === count - 1) {
      laneHeight = shape.height - (newLanesHeight * idx);
    } else {
      laneHeight = newLanesHeight;
    }

    laneBounds = {
      x: shape.x + 30,
      y: laneY,
      width: shape.width - 30,
      height: laneHeight
    };

    if (idx < existingLanesCount) {
      // resize existing lane
      modeling.resizeShape(childLanes[idx], laneBounds);
    } else {
      // create a new lane at position
      newLaneAttrs = {
        type: 'bpmn:Lane'
      };

      modeling.createShape(newLaneAttrs, laneBounds, shape);
    }
  }
};
