'use strict';

var filter = require('lodash/collection/filter');

var Elements = require('diagram-js/lib/util/Elements');

var getLanesRoot = require('../util/LaneUtil').getLanesRoot;


/**
 * A handler that allows us to add a new lane
 * above or below an existing one.
 *
 * @param {Modeling} modeling
 */
function AddLaneHandler(modeling, spaceTool) {
  this._modeling = modeling;
  this._spaceTool = spaceTool;
}

AddLaneHandler.$inject = [ 'modeling', 'spaceTool' ];

module.exports = AddLaneHandler;


AddLaneHandler.prototype.preExecute = function(context) {

  var spaceTool = this._spaceTool,
      modeling = this._modeling;

  var shape = context.shape,
      location = context.location;

  var lanesRoot = getLanesRoot(shape);

  var isRoot = lanesRoot === shape,
      laneParent = isRoot ? shape : shape.parent;

  var allAffected = [];

  Elements.eachElement(lanesRoot, function(element) {
    allAffected.push(element);

    if (element === shape) {
      return [];
    }

    return filter(element.children, function(c) {
      return c !== shape;
    });
  });

  var offset = location === 'top' ? -120 : 120,
      lanePosition = location === 'top' ? shape.y : shape.y + shape.height,
      spacePos = lanePosition + (location === 'top' ? 10 : -10),
      direction = location === 'top' ? 'n' : 's';

  var adjustments = spaceTool.calculateAdjustments(allAffected, 'y', offset, spacePos);

  spaceTool.makeSpace(adjustments.movingShapes, adjustments.resizingShapes, { x: 0, y: offset }, direction);

  context.newLane = modeling.createShape({ type: 'bpmn:Lane' }, {
    x: shape.x + (isRoot ? 30 : 0),
    y: lanePosition - (location === 'top' ? 120 : 0),
    width: shape.width - (isRoot ? 30 : 0),
    height: 120
  }, laneParent);
};