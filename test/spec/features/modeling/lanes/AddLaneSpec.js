'use strict';

var TestHelper = require('../../../../TestHelper');

/* global bootstrapModeler, inject */


var pick = require('lodash/object/pick');

var modelingModule = require('../../../../../lib/features/modeling'),
    coreModule = require('../../../../../lib/core');

var DEFAULT_LANE_HEIGHT = 120;


function getBounds(element) {
  return pick(element, [ 'x', 'y', 'width', 'height' ]);
}


describe('features/modeling - add lane', function() {

  var diagramXML = require('./lanes.bpmn');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('should add after Lane', function() {

    it('execute', inject(function(elementRegistry, modeling) {

      // given
      var laneShape = elementRegistry.get('Lane_A'),
          belowLaneShape = elementRegistry.get('Lane_B');

      // when
      var newLane = modeling.addLane(laneShape, 'bottom');

      // then
      expect(newLane).to.have.bounds({
        x: laneShape.x,
        y: laneShape.y + laneShape.height,
        width: laneShape.width,
        height: DEFAULT_LANE_HEIGHT
      });

      // below lanes got moved by { dy: + LANE_HEIGHT }
      expect(belowLaneShape).to.have.bounds({
        x: laneShape.x,
        y: laneShape.y + laneShape.height + DEFAULT_LANE_HEIGHT - 1,
        width: laneShape.width,
        height: belowLaneShape.height
      });

    }));

  });


  describe('should add before Lane', function() {

    it('execute', inject(function(elementRegistry, modeling) {

      // given
      var laneShape = elementRegistry.get('Lane_B'),
          aboveLaneShape = elementRegistry.get('Lane_A');

      // when
      var newLane = modeling.addLane(laneShape, 'top');

      // then
      expect(newLane).to.have.bounds({
        x: laneShape.x,
        y: laneShape.y - DEFAULT_LANE_HEIGHT,
        width: laneShape.width,
        height: DEFAULT_LANE_HEIGHT
      });

      // below lanes got moved by { dy: + LANE_HEIGHT }
      expect(aboveLaneShape).to.have.bounds({
        x: laneShape.x,
        y: laneShape.y - aboveLaneShape.height - DEFAULT_LANE_HEIGHT + 1,
        width: laneShape.width,
        height: aboveLaneShape.height
      });
    }));

  });


  describe('should add after Participant', function() {

    it('execute', inject(function(elementRegistry, modeling) {

      // given
      var participantShape = elementRegistry.get('Participant_Lane'),
          participantBounds = getBounds(participantShape),
          lastLaneShape = elementRegistry.get('Lane_B'),
          lastLaneBounds = getBounds(lastLaneShape);

      // when
      var newLane = modeling.addLane(participantShape, 'bottom');

      // then
      expect(newLane).to.have.bounds({
        x: participantBounds.x + 30,
        y: participantBounds.y + participantBounds.height,
        width: participantBounds.width - 30,
        height: DEFAULT_LANE_HEIGHT
      });

      // last lane kept position
      expect(lastLaneShape).to.have.bounds(lastLaneBounds);

      // participant got enlarged by { dy: + LANE_HEIGHT } at bottom
      expect(participantShape).to.have.bounds({
        x: participantBounds.x,
        y: participantBounds.y,
        width: participantBounds.width,
        height: participantBounds.height + DEFAULT_LANE_HEIGHT
      });

    }));

  });


  describe('should add before Participant', function() {

    it('execute', inject(function(elementRegistry, modeling) {

      // given
      var participantShape = elementRegistry.get('Participant_Lane'),
          participantBounds = getBounds(participantShape),
          firstLaneShape = elementRegistry.get('Lane_A'),
          firstLaneBounds = getBounds(firstLaneShape);

      // when
      var newLane = modeling.addLane(participantShape, 'top');

      // then
      expect(newLane).to.have.bounds({
        x: participantBounds.x + 30,
        y: participantBounds.y - DEFAULT_LANE_HEIGHT,
        width: participantBounds.width - 30,
        height: DEFAULT_LANE_HEIGHT
      });

      // last lane kept position
      expect(firstLaneShape).to.have.bounds(firstLaneBounds);

      // participant got enlarged by { dy: + LANE_HEIGHT } at bottom
      expect(participantShape).to.have.bounds({
        x: participantBounds.x,
        y: participantBounds.y - DEFAULT_LANE_HEIGHT,
        width: participantBounds.width,
        height: participantBounds.height + DEFAULT_LANE_HEIGHT
      });

    }));


  });

});