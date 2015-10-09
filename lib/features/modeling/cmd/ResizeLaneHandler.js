'use strict';

var filter = require('lodash/collection/filter');

var is = require('../../../util/ModelUtil').is;

var getLanesRoot = require('../util/LaneUtil').getLanesRoot;

var asTRBL = require('diagram-js/lib/layout/LayoutUtil').asTRBL,
    substractTRBL = require('diagram-js/lib/features/resize/ResizeUtil').substractTRBL;

var eachElement = require('diagram-js/lib/util/Elements').eachElement;


/**
 * A handler that resizes a lane.
 *
 * @param {Modeling} modeling
 */
function ResizeLaneHandler(modeling, spaceTool) {
  this._modeling = modeling;
  this._spaceTool = spaceTool;
}

ResizeLaneHandler.$inject = [ 'modeling', 'spaceTool' ];

module.exports = ResizeLaneHandler;


ResizeLaneHandler.prototype.preExecute = function(context) {

  var spaceTool = this._spaceTool;

  var shape = context.shape,
      newBounds = context.newBounds;

  var shapeTrbl = asTRBL(shape),
      newTrbl = asTRBL(newBounds);

  var trblDiff = substractTRBL(newTrbl, shapeTrbl);

  var lanesRoot = getLanesRoot(shape);

  var allLanes = [];

  eachElement(lanesRoot, function(element) {

    allLanes.push(element);

    return filter(element.children, function(c) {
      return is(c, 'bpmn:Lane');
    });
  });

  var change,
      spacePos,
      direction,
      offset,
      adjustments;

  if (trblDiff.bottom || trblDiff.top) {

    change = trblDiff.bottom || trblDiff.top;
    spacePos = shape.y + (trblDiff.bottom ? shape.height : 0) + (trblDiff.bottom ? -10 : 10);
    direction = trblDiff.bottom ? 's' : 'n';

    offset = trblDiff.top > 0 || trblDiff.bottom < 0 ? -change : change;

    adjustments = spaceTool.calculateAdjustments(allLanes, 'y', offset, spacePos);

    spaceTool.makeSpace(adjustments.movingShapes, adjustments.resizingShapes, { x: 0, y: change }, direction);
  }


  if (trblDiff.left || trblDiff.right) {

    change = trblDiff.right || trblDiff.left;
    spacePos = shape.x + (trblDiff.right ? shape.width : 0) + (trblDiff.right ? -10 : 100);
    direction = trblDiff.right ? 'e' : 'w';

    offset = trblDiff.left > 0 || trblDiff.right < 0 ? -change : change;

    adjustments = spaceTool.calculateAdjustments(allLanes, 'x', offset, spacePos);

    spaceTool.makeSpace(adjustments.movingShapes, adjustments.resizingShapes, { x: change, y: 0 }, direction);
  }
};
