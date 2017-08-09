'use strict';

const EventEmitter = require('events');
const util = require('util');

module.exports = TestModel;

function TestModel() {
  EventEmitter.call(this);
  this.prototype = this.constructor.prototype;
};
util.inherits(TestModel, EventEmitter);

TestModel.prototype.observe = function (event, listener) {
  this.on(event, listener);
};

TestModel.prototype.defineProperty = function (name, value) {
  this[name] = value;
};

TestModel.prototype.beforeRemote = function (event, listener) {
  this.on(event, listener);
}