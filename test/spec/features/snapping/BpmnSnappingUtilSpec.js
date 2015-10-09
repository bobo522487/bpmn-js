'use strict';

var TestHelper = require('test/TestHelper');

/* global bootstrapModeler, inject */


var getParticipantSizeConstraints = require('lib/features/snapping/BpmnSnappingUtil').getParticipantSizeConstraints;

var coreModule = require('lib/core');

var LANE_MIN_HEIGHT = 60,
    LANE_RIGHT_PADDING = 20,
    LANE_LEFT_PADDING = 50,
    LANE_TOP_PADDING = 20,
    LANE_BOTTOM_PADDING = 20;


describe('features/snapping - BpmnSnappingUtil', function() {

  var diagramXML = require('./BpmnSnappingUtil.nestedLanes.bpmn');

  beforeEach(bootstrapModeler(diagramXML, { modules: [ coreModule ] }));


  describe('#getParticipantSizeConstraints', function() {

    it('resize participant (S)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Participant_Lane'),
          otherLaneShape = elementRegistry.get('Lane_B');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 's');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          bottom: otherLaneShape.y + LANE_MIN_HEIGHT
        },
        max: {}
      });

    }));


    it('bottom lane (S)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Lane_B'),
          otherLaneShape = elementRegistry.get('Lane_B');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 's');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          bottom: otherLaneShape.y + LANE_MIN_HEIGHT
        },
        max: {}
      });

    }));


    it('resize participant (N)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Participant_Lane'),
          otherLaneShape = elementRegistry.get('Nested_Lane_A');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 'n');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          top: otherLaneShape.y + otherLaneShape.height - LANE_MIN_HEIGHT
        },
        max: {}
      });

    }));


    it('resize top lane (N)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Lane_A'),
          otherLaneShape = elementRegistry.get('Nested_Lane_A');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 'n');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          top: otherLaneShape.y + otherLaneShape.height - LANE_MIN_HEIGHT
        },
        max: {}
      });

    }));


    it('resize middle lane (N)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Nested_Lane_B'),
          aboveLaneShape = elementRegistry.get('Nested_Lane_A');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 'n');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          top: resizeShape.y + resizeShape.height - LANE_MIN_HEIGHT
        },
        max: {
          top: aboveLaneShape.y + LANE_MIN_HEIGHT
        }
      });

    }));


    it('resize middle lane (S)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Nested_Lane_B'),
          otherLaneShape = elementRegistry.get('Lane_B');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 's');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          bottom: resizeShape.y + LANE_MIN_HEIGHT
        },
        max: {
          bottom: otherLaneShape.y + otherLaneShape.height - LANE_MIN_HEIGHT
        }
      });

    }));


    it('resize lane (W)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Nested_Lane_B'),
          otherShape = elementRegistry.get('Boundary_label');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 'w');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          left: otherShape.x - LANE_LEFT_PADDING
        },
        max: { }
      });

    }));


    it('resize lane (E)', inject(function(elementRegistry) {

      // given
      var resizeShape = elementRegistry.get('Lane_B'),
          otherShape = elementRegistry.get('Task');

      // when
      var sizeConstraints = getParticipantSizeConstraints(resizeShape, 'e');

      // then
      expect(sizeConstraints).to.eql({
        min: {
          right: otherShape.x + otherShape.width + LANE_RIGHT_PADDING
        },
        max: { }
      });

    }));


  });

});