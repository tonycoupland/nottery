/**
 * Gamebet model events
 */

'use strict';

import {EventEmitter} from 'events';
import Gamebet from './gamebet.model';
var GamebetEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GamebetEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Gamebet.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    GamebetEvents.emit(event + ':' + doc._id, doc);
    GamebetEvents.emit(event, doc);
  }
}

export default GamebetEvents;
